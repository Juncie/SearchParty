import Fuse from "fuse.js";

import { FIELD_DICTIONARY } from "./fieldDictionary";
import {
  hasNormalizedPhrase,
  normalizeDomFieldSignals,
  normalizeSignalValue,
} from "./normalizeFieldSignals";
import type {
  AutofillCandidate,
  AutofillFieldKind,
  DomainMemoryHint,
  DomFieldSignals,
} from "./types";

type SignalKey =
  | "autocomplete"
  | "labelText"
  | "ariaLabel"
  | "ariaLabelledBy"
  | "name"
  | "id"
  | "placeholder"
  | "nearbyText"
  | "parentSectionText"
  | "formText"
  | "options"
  | "role"
  | "type";

const SIGNAL_WEIGHTS: Record<SignalKey, number> = {
  autocomplete: 1.35,
  labelText: 1.25,
  ariaLabel: 1.15,
  ariaLabelledBy: 1.12,
  name: 1.1,
  id: 1.05,
  placeholder: 0.9,
  nearbyText: 0.72,
  parentSectionText: 0.58,
  formText: 0.42,
  options: 0.56,
  role: 0.48,
  type: 0.85,
};

const SEARCH_OPTIONS = {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.35,
  keys: ["text"],
};

function fusePhraseScore(
  value: string,
  phrase: string
): number {
  const fuse = new Fuse([{ text: value }], SEARCH_OPTIONS);
  const match = fuse.search(normalizeSignalValue(phrase), {
    limit: 1,
  })[0];
  if (!match || match.score === undefined) {
    return 0;
  }
  return Math.max(0, 1 - match.score);
}

/**
 * Signals used for phrase scoring. We intentionally omit `formText`: it is the
 * concatenated text of the entire form, so matching against it credits every
 * field with keywords from sibling controls (e.g. "Mobile phone" on a cover
 * letter textarea, or "Email address" on mailing address).
 */
function rawSignalValuesForScoring(
  signals: DomFieldSignals
): Array<[SignalKey, string]> {
  return [
    ["autocomplete", signals.autocomplete ?? ""],
    ["labelText", signals.labelText ?? ""],
    ["ariaLabel", signals.ariaLabel ?? ""],
    ["ariaLabelledBy", signals.ariaLabelledBy ?? ""],
    ["name", signals.name ?? ""],
    ["id", signals.id ?? ""],
    ["placeholder", signals.placeholder ?? ""],
    ["nearbyText", signals.nearbyText ?? ""],
    ["parentSectionText", signals.parentSectionText ?? ""],
    ["options", (signals.options ?? []).join(" ")],
    ["role", signals.role ?? ""],
    ["type", signals.type ?? ""],
  ];
}

function scorePositivePhrase(
  signalKey: SignalKey,
  value: string,
  phrase: string
): { score: number; reason: string | null } {
  if (hasNormalizedPhrase(value, phrase)) {
    const exactBase = phrase.includes(" ") ? 76 : 68;
    return {
      score: exactBase * SIGNAL_WEIGHTS[signalKey],
      reason: `${signalKey} matched "${phrase}"`,
    };
  }

  const similarity = fusePhraseScore(value, phrase);
  if (similarity < 0.72) {
    return { score: 0, reason: null };
  }

  return {
    score: similarity * 64 * SIGNAL_WEIGHTS[signalKey],
    reason: `${signalKey} fuzzy matched "${phrase}"`,
  };
}

function scoreNegativePhrase(
  signalKey: SignalKey,
  value: string,
  phrase: string
): { penalty: number; reason: string | null } {
  if (hasNormalizedPhrase(value, phrase)) {
    return {
      penalty: 30 * SIGNAL_WEIGHTS[signalKey],
      reason: `${signalKey} contained conflicting term "${phrase}"`,
    };
  }

  const similarity = fusePhraseScore(value, phrase);
  if (similarity < 0.82) {
    return { penalty: 0, reason: null };
  }

  return {
    penalty: similarity * 18 * SIGNAL_WEIGHTS[signalKey],
    reason: `${signalKey} fuzzy matched conflicting term "${phrase}"`,
  };
}

function applyDomainMemoryHint(
  candidate: AutofillCandidate,
  hint: DomainMemoryHint | undefined
): AutofillCandidate {
  if (
    !hint ||
    candidate.kind !== hint.kind ||
    candidate.score >= 94
  ) {
    return candidate;
  }

  const acceptedDelta =
    hint.acceptedCount - hint.rejectedCount;
  if (acceptedDelta > 0) {
    const boost = Math.min(8, acceptedDelta * 2);
    return {
      ...candidate,
      score: Math.min(100, candidate.score + boost),
      reasons: [
        ...candidate.reasons,
        `domain memory boosted ${candidate.kind} by ${boost} points`,
      ],
    };
  }

  if (acceptedDelta < 0) {
    const penalty = Math.min(
      10,
      Math.abs(acceptedDelta) * 2
    );
    return {
      ...candidate,
      score: Math.max(0, candidate.score - penalty),
      penalties: [
        ...candidate.penalties,
        `domain memory penalized ${candidate.kind} by ${penalty} points`,
      ],
    };
  }

  return candidate;
}

/** Scores one field kind against all normalized DOM signals. */
export function scoreAutofillField(
  kind: AutofillFieldKind,
  signals: DomFieldSignals,
  memoryHint?: DomainMemoryHint
): AutofillCandidate {
  const normalized = normalizeDomFieldSignals(signals);
  const dictionary = FIELD_DICTIONARY.find(
    (record) => record.kind === kind
  );
  if (!dictionary) {
    return { kind, score: 0, reasons: [], penalties: [] };
  }

  let score = 0;
  const reasons: string[] = [];
  const penalties: string[] = [];

  for (const [
    signalKey,
    value,
  ] of rawSignalValuesForScoring(normalized)) {
    if (!value) {
      continue;
    }

    /** One best positive hit per signal — avoids stacking "phone", "mobile", "tel" on the same label. */
    let bestPositive: {
      score: number;
      reason: string | null;
    } = { score: 0, reason: null };
    for (const phrase of dictionary.phrases) {
      const result = scorePositivePhrase(
        signalKey,
        value,
        phrase
      );
      if (result.score > bestPositive.score) {
        bestPositive = result;
      }
    }

    /** Strongest penalty per signal — multiple negatives on the same blob still apply once. */
    let worstNegative: {
      penalty: number;
      reason: string | null;
    } = { penalty: 0, reason: null };
    for (const phrase of dictionary.negativePhrases) {
      const result = scoreNegativePhrase(
        signalKey,
        value,
        phrase
      );
      if (result.penalty > worstNegative.penalty) {
        worstNegative = result;
      }
    }

    score += bestPositive.score;
    if (bestPositive.reason) {
      reasons.push(bestPositive.reason);
    }
    score -= worstNegative.penalty;
    if (worstNegative.reason) {
      penalties.push(worstNegative.reason);
    }
  }

  if (signals.isDisabled) {
    score -= 45;
    penalties.push("field is disabled");
  }
  const skipHiddenPenalty =
    kind === "resume" && signals.interactionType === "file";
  if (signals.isVisible === false && !skipHiddenPenalty) {
    score -= 35;
    penalties.push("field is not visible");
  }

  const candidate = {
    kind,
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
    penalties,
  };

  return applyDomainMemoryHint(candidate, memoryHint);
}
