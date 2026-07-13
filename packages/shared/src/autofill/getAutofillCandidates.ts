import {
  AUTOCOMPLETE_KIND,
  AUTOFILL_KINDS,
} from "./fieldDictionary";
import {
  hasNormalizedPhrase,
  normalizeControlType,
  normalizeSignalValue,
} from "./normalizeFieldSignals";
import { scoreAutofillField } from "./scoreAutofillField";
import type {
  AutofillCandidate,
  AutofillMatchDetail,
  AutofillMatchResult,
  DomainMemoryHint,
  DomFieldSignals,
} from "./types";
import {
  confidenceScoreToTier,
  downgradeConfidenceTier,
} from "./confidence";

function scoreFromAutocomplete(
  signals: DomFieldSignals
): AutofillCandidate | null {
  const tokens = normalizeSignalValue(
    signals.autocomplete ?? ""
  ).split(/\s+/);
  for (const token of tokens) {
    const kind = AUTOCOMPLETE_KIND[token];
    if (kind) {
      return {
        kind,
        score: 98,
        reasons: [
          `autocomplete token "${token}" maps directly to ${kind}`,
        ],
        penalties: [],
      };
    }
  }
  return null;
}

function applyTypeHint(
  candidate: AutofillCandidate,
  signals: DomFieldSignals
): AutofillCandidate {
  const type = normalizeControlType(signals.type ?? "");
  if (type === "email" && candidate.kind === "email") {
    const boostedScore =
      candidate.score < 94 ? 94 : candidate.score;
    const hasReason = candidate.reasons.some((r) =>
      r.includes("input type=email")
    );
    return {
      ...candidate,
      score: boostedScore,
      reasons: hasReason
        ? candidate.reasons
        : [
          ...candidate.reasons,
          "input type=email strongly indicates email",
        ],
    };
  }
  if (type === "tel" && candidate.kind === "phone") {
    const boostedScore =
      candidate.score < 94 ? 94 : candidate.score;
    const hasReason = candidate.reasons.some((r) =>
      r.includes("input type=tel")
    );
    return {
      ...candidate,
      score: boostedScore,
      reasons: hasReason
        ? candidate.reasons
        : [
          ...candidate.reasons,
          "input type=tel strongly indicates phone",
        ],
    };
  }
  return candidate;
}

function applyPlaceholderOnlyPenalty(
  candidate: AutofillCandidate
): AutofillCandidate {
  if (
    candidate.score < 88 ||
    candidate.reasons.length === 0 ||
    candidate.reasons.some(
      (reason) => !reason.startsWith("placeholder ")
    )
  ) {
    return candidate;
  }

  return {
    ...candidate,
    score: Math.max(0, candidate.score - 16),
    penalties: [
      ...candidate.penalties,
      "placeholder-only evidence is not enough for automatic filling",
    ],
  };
}

/**
 * HTML input type is authoritative for contact channels: a `tel` field should not
 * lose to `email` just because the label uses generic wording like "reach you".
 */
function preferNativeContactType(
  candidates: AutofillCandidate[],
  signals: DomFieldSignals
): AutofillCandidate[] {
  const normalizedType = normalizeControlType(
    signals.type ?? ""
  );
  if (!normalizedType) {
    return candidates;
  }

  const emailIdx = candidates.findIndex(
    (c) => c.kind === "email"
  );
  const phoneIdx = candidates.findIndex(
    (c) => c.kind === "phone"
  );
  if (emailIdx === -1 || phoneIdx === -1) {
    return candidates;
  }

  const emailCand = candidates[emailIdx]!;
  const phoneCand = candidates[phoneIdx]!;

  if (
    normalizedType === "tel" &&
    emailCand.score >= phoneCand.score
  ) {
    const next = [...candidates];
    next[phoneIdx] = {
      ...phoneCand,
      score: Math.min(100, emailCand.score + 1),
      reasons: [
        ...phoneCand.reasons,
        "native input type=tel prefers phone over email for this control",
      ],
    };
    return next;
  }

  if (
    normalizedType === "email" &&
    phoneCand.score >= emailCand.score
  ) {
    const next = [...candidates];
    next[emailIdx] = {
      ...emailCand,
      score: Math.min(100, phoneCand.score + 1),
      reasons: [
        ...emailCand.reasons,
        "native input type=email prefers email over phone for this control",
      ],
    };
    return next;
  }

  return candidates;
}

function applyContextualTieBreaker(
  candidates: AutofillCandidate[],
  signals: DomFieldSignals
): AutofillCandidate[] {
  const normalizedType = normalizeControlType(
    signals.type ?? ""
  );
  const text = normalizeSignalValue(
    [
      signals.labelText,
      signals.ariaLabel,
      signals.name,
      signals.id,
      signals.placeholder,
      signals.nearbyText,
      signals.parentSectionText,
    ]
      .filter(Boolean)
      .join(" ")
  );

  return candidates.map((candidate) => {
    if (
      candidate.kind === "fullName" &&
      (hasNormalizedPhrase(text, "first name") ||
        hasNormalizedPhrase(text, "given name") ||
        hasNormalizedPhrase(text, "last name") ||
        hasNormalizedPhrase(text, "family name") ||
        hasNormalizedPhrase(text, "surname"))
    ) {
      return {
        ...candidate,
        score: Math.max(0, candidate.score - 40),
        penalties: [
          ...candidate.penalties,
          "specific first/last name wording should not use fullName",
        ],
      };
    }
    if (
      candidate.kind === "fullName" &&
      (hasNormalizedPhrase(text, "full name") ||
        hasNormalizedPhrase(text, "legal name") ||
        hasNormalizedPhrase(text, "applicant name"))
    ) {
      return {
        ...candidate,
        score: Math.min(100, candidate.score + 18),
        reasons: [
          ...candidate.reasons,
          "full-name context favors a single fullName value",
        ],
      };
    }
    if (
      (candidate.kind === "firstName" ||
        candidate.kind === "lastName") &&
      hasNormalizedPhrase(text, "full name")
    ) {
      return {
        ...candidate,
        score: Math.max(0, candidate.score - 24),
        penalties: [
          ...candidate.penalties,
          "full-name context should not split into first or last name",
        ],
      };
    }
    if (
      candidate.kind === "email" &&
      hasNormalizedPhrase(text, "where can we reach you") &&
      normalizedType === "email"
    ) {
      return {
        ...candidate,
        score: Math.min(100, candidate.score + 8),
        reasons: [
          ...candidate.reasons,
          "contact wording plus email type favors email",
        ],
      };
    }
    if (
      candidate.kind === "phone" &&
      hasNormalizedPhrase(text, "where can we reach you") &&
      normalizedType === "tel"
    ) {
      return {
        ...candidate,
        score: Math.min(100, candidate.score + 8),
        reasons: [
          ...candidate.reasons,
          "contact wording plus telephone type favors phone",
        ],
      };
    }
    if (
      candidate.kind === "portfolio" &&
      hasNormalizedPhrase(text, "professional profile") &&
      (hasNormalizedPhrase(text, "website") ||
        hasNormalizedPhrase(text, "portfolio") ||
        hasNormalizedPhrase(text, "personal site"))
    ) {
      return {
        ...candidate,
        score: Math.min(100, candidate.score + 25),
        reasons: [
          ...candidate.reasons,
          "professional profile context points toward portfolio",
        ],
      };
    }
    if (
      candidate.kind === "linkedin" &&
      hasNormalizedPhrase(text, "professional profile") &&
      hasNormalizedPhrase(text, "linkedin")
    ) {
      return {
        ...candidate,
        score: Math.min(100, candidate.score + 25),
        reasons: [
          ...candidate.reasons,
          "professional profile context points toward linkedin",
        ],
      };
    }
    return candidate;
  });
}

/** Returns ranked autofill candidates for a DOM field. */
export function getAutofillCandidates(
  signals: DomFieldSignals,
  memoryHint?: DomainMemoryHint
): AutofillCandidate[] {
  const autocomplete = scoreFromAutocomplete(signals);
  const candidates = AUTOFILL_KINDS.map((kind) =>
    applyPlaceholderOnlyPenalty(
      applyTypeHint(
        scoreAutofillField(kind, signals, memoryHint),
        signals
      )
    )
  );

  const withAutocomplete = autocomplete
    ? candidates.map((candidate) =>
      candidate.kind === autocomplete.kind
        ? {
          ...autocomplete,
          score: Math.max(
            autocomplete.score,
            candidate.score,
          ),
          reasons:
            candidate.score > autocomplete.score
              ? [
                ...autocomplete.reasons,
                ...candidate.reasons,
              ]
              : autocomplete.reasons,
          penalties: candidate.penalties,
        }
        : candidate
    )
    : candidates;

  const tieBroken = applyContextualTieBreaker(
    withAutocomplete,
    signals
  );
  const resolved = preferNativeContactType(
    tieBroken,
    signals
  );
  const nameSpecificity: Partial<
    Record<(typeof AUTOFILL_KINDS)[number], number>
  > = {
    firstName: 2,
    lastName: 2,
    fullName: 1,
  };
  return resolved.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (
      (nameSpecificity[b.kind] ?? 0) -
      (nameSpecificity[a.kind] ?? 0)
    );
  });
}

/** Classifies a DOM field and keeps the full candidate list for explainability. */
export function matchDomFieldToAutofillDetailed(
  signals: DomFieldSignals,
  memoryHint?: DomainMemoryHint
): AutofillMatchDetail {
  const candidates = getAutofillCandidates(
    signals,
    memoryHint
  );
  const best = candidates[0] ?? {
    kind: "firstName" as const,
    score: 0,
    reasons: [],
    penalties: [],
  };
  const second = candidates[1];

  let adjusted = best;
  let tier = confidenceScoreToTier(best.score);
  const hasAuthoritativeReason = best.reasons.some(
    (reason) =>
      reason.startsWith("autocomplete token") ||
      reason.startsWith("input type=") ||
      reason.includes("native input type=")
  );

  if (
    second &&
    !hasAuthoritativeReason &&
    best.score - second.score < 12
  ) {
    adjusted = {
      ...best,
      score: Math.max(0, best.score - 18),
      penalties: [
        ...best.penalties,
        `top candidates were too close (${best.kind} ${best.score}, ${second.kind} ${second.score})`,
      ],
    };
    tier = downgradeConfidenceTier(
      confidenceScoreToTier(best.score)
    );
  } else {
    tier = confidenceScoreToTier(adjusted.score);
  }

  return {
    ...adjusted,
    tier,
    candidates,
  };
}

/** Backward-compatible simple matcher used by older callers. */
export function matchDomFieldToAutofill(
  signals: DomFieldSignals,
  memoryHint?: DomainMemoryHint
): AutofillMatchResult {
  const result = matchDomFieldToAutofillDetailed(
    signals,
    memoryHint
  );
  return { kind: result.kind, score: result.score };
}
