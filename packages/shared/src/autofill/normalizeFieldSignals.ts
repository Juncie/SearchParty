import type { DomFieldSignals } from "./types";

type SignalStringKey = Exclude<
  keyof DomFieldSignals,
  | "options"
  | "isVisible"
  | "isDisabled"
  | "isRequired"
  | "isChecked"
  | "interactionType"
>;

const ABBREVIATIONS: Readonly<Record<string, string>> = {
  fname: "first name",
  lname: "last name",
  "e mail": "email",
  tel: "phone",
  telephone: "phone",
  mobile: "phone",
  phone_num: "phone number",
  phonenum: "phone number",
  "linked in": "linkedin",
  linkedInProfile: "linkedin profile",
};

const SIGNAL_KEYS: readonly SignalStringKey[] = [
  "tagName",
  "role",
  "type",
  "name",
  "id",
  "placeholder",
  "autocomplete",
  "ariaLabel",
  "ariaLabelledBy",
  "labelText",
  "nearbyText",
  "parentSectionText",
  "formText",
  "cssPath",
  "xpath",
] as const;

function normalizeWithoutAbbreviations(
  value: string
): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_.\/:\\[\](){}-]+/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9@\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function replaceKnownAbbreviations(value: string): string {
  let normalized = value;
  for (const [abbr, expansion] of Object.entries(
    ABBREVIATIONS
  )) {
    const escaped = normalizeWithoutAbbreviations(
      abbr
    ).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    normalized = normalized.replace(
      new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "g"),
      `$1${expansion}`
    );
  }
  return normalized;
}

/** Normalizes a field signal for deterministic matching and Fuse queries. */
export function normalizeSignalValue(
  value: string
): string {
  return replaceKnownAbbreviations(
    normalizeWithoutAbbreviations(value)
  );
}

/**
 * Normalizes an HTML control `type` attribute without abbreviation expansion,
 * so `tel`, `email`, and `url` stay distinct tokens for matchers.
 */
export function normalizeControlType(
  value: string
): string {
  return normalizeWithoutAbbreviations(value);
}

/** Returns normalized string signals while preserving boolean metadata. */
export function normalizeDomFieldSignals(
  signals: DomFieldSignals
): DomFieldSignals {
  const normalized: DomFieldSignals = {
    tagName: normalizeSignalValue(signals.tagName),
    interactionType: signals.interactionType,
    isVisible: signals.isVisible,
    isDisabled: signals.isDisabled,
    isRequired: signals.isRequired,
    isChecked: signals.isChecked,
    options: signals.options
      ?.map(normalizeSignalValue)
      .filter(Boolean),
  };

  for (const key of SIGNAL_KEYS) {
    if (key === "tagName") {
      continue;
    }
    const value = signals[key];
    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      /** Keep HTML `type` tokens literal — `tel` must not become `phone` or hints break. */
      normalized[key] =
        key === "type"
          ? normalizeWithoutAbbreviations(value)
          : normalizeSignalValue(value);
    }
  }

  return normalized;
}

/** Builds a single normalized string from all DOM signals on a control. */
export function normalizeAutofillHaystack(
  signals: DomFieldSignals
): string {
  const normalized = normalizeDomFieldSignals(signals);
  return [
    normalized.tagName,
    normalized.role,
    normalized.name,
    normalized.id,
    normalized.type,
    normalized.placeholder,
    normalized.ariaLabel,
    normalized.ariaLabelledBy,
    normalized.autocomplete,
    normalized.labelText,
    normalized.nearbyText,
    normalized.parentSectionText,
    ...(normalized.options ?? []),
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" && value.length > 0
    )
    .join(" ");
}

/** Checks whether a normalized value contains a complete normalized phrase. */
export function hasNormalizedPhrase(
  value: string,
  phrase: string
): boolean {
  const normalizedValue = normalizeSignalValue(value);
  const normalizedPhrase = normalizeSignalValue(phrase);
  if (!normalizedPhrase) {
    return false;
  }
  const escaped = normalizedPhrase.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
  return new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "i").test(
    normalizedValue
  );
}
