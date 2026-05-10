/**
 * Categories of job-application fields the extension can detect and fill.
 */
export type AutofillFieldKind =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "address"
  | "linkedin"
  | "github"
  | "portfolio";

/**
 * UI / selection tier derived from a numeric confidence score.
 */
export type AutofillConfidenceTier = "auto" | "suggest" | "confirm";

/**
 * DOM-derived hints collected from a single form control for scoring.
 */
export type DomFieldSignals = {
  tagName: string;
  name: string;
  id: string;
  type: string;
  placeholder: string;
  ariaLabel: string;
  autocomplete: string;
  labelText: string;
};

/**
 * Result of classifying one DOM field into an {@link AutofillFieldKind}.
 */
export type AutofillMatchResult = {
  kind: AutofillFieldKind;
  score: number;
};

/**
 * String values keyed by autofill kind, ready to paste into matched controls.
 */
export type AutofillPayloadValues = Record<AutofillFieldKind, string>;

/** Minimal profile slice used when building autofill values (matches ApplicantProfile fields). */
export type AutofillProfileSlice = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  projects: ReadonlyArray<{ url: string }>;
};

/**
 * One scored field from a content-script scan, including stable id for apply messages.
 */
export type ScannedAutofillFieldPayload = {
  /** Stable id for apply messages. */
  spId: string;
  /** Detected field kind. */
  kind: AutofillFieldKind;
  /** Confidence score from 0 to 100. */
  score: number;
  /** UI / selection tier derived from the confidence score. */
  tier: AutofillConfidenceTier;
  labelPreview: string;
  currentValue: string;
  tagName: string;
};

/** Runtime message `type` for reading the cached autofill scan from a tab. */
export const extensionAutofillGetScanMessageType =
  "searchparty/extension/autofill/get-scan" as const;

/** Runtime message `type` for forcing a fresh autofill scan in a tab. */
export const extensionAutofillScanMessageType =
  "searchparty/extension/autofill/scan" as const;

/** Runtime message `type` for applying fill payloads to tagged controls in a tab. */
export const extensionAutofillApplyMessageType =
  "searchparty/extension/autofill/apply" as const;

/** All {@link AutofillFieldKind} values in stable iteration order (e.g. scoring loops). */
export const AUTOFILL_KINDS: readonly AutofillFieldKind[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "linkedin",
  "github",
  "portfolio",
] as const;

/** Maps normalized autocomplete detail tokens (see HTML autofill) to field kinds. */
const AUTOCOMPLETE_KIND: Record<string, AutofillFieldKind> = {
  "given-name": "firstName",
  fname: "firstName",
  "first-name": "firstName",
  "family-name": "lastName",
  lname: "lastName",
  "last-name": "lastName",
  email: "email",
  tel: "phone",
  "tel-national": "phone",
  "tel-local": "phone",
  "tel-extension": "phone",
  "street-address": "address",
  "address-line1": "address",
  "address-line2": "address",
  "address-line3": "address",
  "country-name": "address",
};

type SignalKey =
  | "name"
  | "id"
  | "placeholder"
  | "ariaLabel"
  | "labelText"
  | "autocomplete"
  | "type";

const SIGNAL_WEIGHTS: Record<SignalKey, number> = {
  autocomplete: 1.35,
  labelText: 1.25,
  ariaLabel: 1.15,
  name: 1.1,
  id: 1.05,
  placeholder: 0.95,
  type: 0.85,
};

const NEGATIVE_KEYWORDS: Record<AutofillFieldKind, readonly string[]> = {
  firstName: ["last", "family", "surname", "company", "business", "username", "user name", "password*"],
  lastName: ["first", "given", "company", "business", "username", "user name", "password*"],
  email: ["phone", "sms", "mobile", "website", "url", "linkedin", "github"],
  phone: ["email", "mail", "website", "url", "linkedin", "github"],
  address: ["email", "phone", "website", "url", "linkedin", "github", "ip address"],
  linkedin: ["github", "portfolio", "website", "personal site"],
  github: ["linkedin", "portfolio", "website", "personal site"],
  portfolio: ["linkedin", "github", "phone", "email"],
};

const STRONG_KEYWORDS: Record<AutofillFieldKind, readonly string[]> = {
  firstName: ["first name", "given name", "firstname", "first-name", "fname", "givenname"],
  lastName: ["last name", "family name", "surname", "lastname", "last-name", "lname"],
  email: ["email address", "e-mail", "email"],
  phone: ["phone number", "mobile number", "cell phone", "telephone", "phone", "mobile", "tel"],
  address: ["street address", "mailing address", "address line", "address"],
  linkedin: ["linkedin", "linked in", "linked-in"],
  github: ["github", "git hub"],
  portfolio: ["portfolio", "personal website", "personal site", "website url", "website"],
};

function normalizeSignal(value: string): string {
  return value
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_./:-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPhrase(value: string, phrase: string): boolean {
  const normalized = normalizeSignal(value);
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`, "i").test(normalized);
}

function scoreSignalForKind(
  kind: AutofillFieldKind,
  signalKey: SignalKey,
  rawValue: string,
): number {
  const value = normalizeSignal(rawValue);
  if (!value) return 0;

  let score = 0;

  for (const phrase of STRONG_KEYWORDS[kind]) {
    if (hasPhrase(value, phrase)) {
      const base = phrase.includes(" ") ? 72 : 58;
      score = Math.max(score, base * SIGNAL_WEIGHTS[signalKey]);
    }
  }

  for (const phrase of NEGATIVE_KEYWORDS[kind]) {
    if (hasPhrase(value, phrase)) {
      score -= 35 * SIGNAL_WEIGHTS[signalKey];
    }
  }

  return score;
}

function getSignalEntries(signals: DomFieldSignals): Array<[SignalKey, string]> {
  return [
    ["autocomplete", signals.autocomplete],
    ["labelText", signals.labelText],
    ["ariaLabel", signals.ariaLabel],
    ["name", signals.name],
    ["id", signals.id],
    ["placeholder", signals.placeholder],
    ["type", signals.type],
  ];
}

/**
 * Splits a display name into first and last tokens for autofill when profile
 * name overrides are empty. Uses the first whitespace-separated token as given
 * name and the remainder as family name.
 *
 * @param displayName - Raw display name (e.g. account `user.name`).
 * @returns Trimmed `firstName` and `lastName`; empty strings if input is blank.
 */
export function splitDisplayName(displayName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: "" };
  }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Builds a single normalized string from all DOM signals on a control so callers
 * can search or compare against vocabulary (casing and separators normalized).
 *
 * @param signals - Collected attributes and label text for one control.
 * @returns Lowercased, separator-normalized haystack string.
 */
export function normalizeAutofillHaystack(signals: DomFieldSignals): string {
  return normalizeSignal(
    [
      signals.tagName,
      signals.name,
      signals.id,
      signals.type,
      signals.placeholder,
      signals.ariaLabel,
      signals.autocomplete,
      signals.labelText,
    ].join(" "),
  );
}

/**
 * Builds the flat string map used when applying autofill: email from the signed-in
 * user; first/last from profile when set, otherwise derived from `user.name`;
 * contact and links from profile; portfolio falls back to the first project URL.
 *
 * @param input - Authenticated user plus optional applicant profile slice.
 * @returns Values keyed by {@link AutofillFieldKind} for `valueForAutofillKind`.
 */
export function buildAutofillPayloadValues(input: {
  user: { name: string; email: string };
  profile: AutofillProfileSlice | null;
}): AutofillPayloadValues {
  const fromName = splitDisplayName(input.user.name);
  const p = input.profile;

  const firstName = (p?.firstName.trim() || fromName.firstName).trim();
  const lastName = (p?.lastName.trim() || fromName.lastName).trim();
  const phone = p?.phone.trim() ?? "";
  const address = p?.address.trim() ?? "";
  const linkedin = p?.linkedinUrl.trim() ?? "";
  const github = p?.githubUrl.trim() ?? "";
  let portfolio = p?.portfolioUrl.trim() ?? "";
  if (!portfolio && p?.projects) {
    for (const project of p.projects) {
      const u = project.url?.trim();
      if (u) {
        portfolio = u;
        break;
      }
    }
  }

  return {
    firstName,
    lastName,
    email: input.user.email.trim(),
    phone,
    address,
    linkedin,
    github,
    portfolio,
  };
}

/**
 * Looks up the fill string for a scanned field kind from a payload map.
 *
 * @param values - Output of {@link buildAutofillPayloadValues}.
 * @param kind - Detected kind for the target control.
 * @returns Value to send with apply (may be empty if not present on profile).
 */
export function valueForAutofillKind(
  values: AutofillPayloadValues,
  kind: AutofillFieldKind,
): string {
  return values[kind];
}

/**
 * If the control's `autocomplete` attribute contains a known HTML autofill token,
 * returns a high-confidence match; otherwise returns `null`.
 *
 * @param autocompleteRaw - Raw `autocomplete` attribute value (may include multiple tokens).
 * @returns Fixed score result or `null` when no mapped token is found.
 */
export function scoreFromAutocomplete(
  autocompleteRaw: string,
): AutofillMatchResult | null {
  const tokens = autocompleteRaw.trim().toLowerCase().split(/\s+/);

  for (const token of tokens) {
    const kind = AUTOCOMPLETE_KIND[token];
    if (kind) {
      return { kind, score: 98 };
    }
  }

  return null;
}

/**
 * Classifies a single form control using weighted keyword signals, autocomplete,
 * and input `type`, including a margin guard when top candidates are ambiguous.
 *
 * @param signals - DOM hints for the control (name, id, labels, autocomplete, etc.).
 * @returns Best {@link AutofillFieldKind} and a 0–100 confidence score.
 */
export function matchDomFieldToAutofill(
  signals: DomFieldSignals,
): AutofillMatchResult {
  const candidates = AUTOFILL_KINDS.map((kind) => {
    let score = 0;

    for (const [signalKey, rawValue] of getSignalEntries(signals)) {
      score += scoreSignalForKind(kind, signalKey, rawValue);
    }

    return {
      kind,
      score: Math.max(0, Math.min(100, Math.round(score))),
    };
  }).sort((a, b) => b.score - a.score);

  let best = candidates[0] ?? { kind: "firstName" as const, score: 0 };
  const second = candidates[1];

  const ac = scoreFromAutocomplete(signals.autocomplete);
  if (ac && ac.score >= best.score) {
    best = ac;
  }

  const type = normalizeSignal(signals.type);

  if (type === "email" && best.score < 94) {
    best = { kind: "email", score: 94 };
  }

  if (type === "tel" && best.score < 94) {
    best = { kind: "phone", score: 94 };
  }

  /**
   * Margin guard:
   * If the top two matches are close, reduce confidence.
   * This prevents random-looking high confidence when a field has vague text
   * like "profile", "contact", "url", or "name".
   */
  if (second && best.score < 94) {
    const margin = best.score - second.score;

    if (margin < 12) {
      best = {
        kind: best.kind,
        score: Math.max(0, best.score - 18),
      };
    }
  }

  return best;
}

/**
 * Maps a numeric match score to UI tiers: auto-select, suggest, or confirm.
 *
 * @param score - Rounded confidence from {@link matchDomFieldToAutofill}.
 * @returns `"auto"` ≥ 88, `"suggest"` ≥ 68, otherwise `"confirm"`.
 */
export function confidenceScoreToTier(score: number): AutofillConfidenceTier {
  if (score >= 88) {
    return "auto";
  }

  if (score >= 68) {
    return "suggest";
  }

  return "confirm";
}
