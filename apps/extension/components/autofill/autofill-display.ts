import type { ScannedAutofillFieldPayload } from "@searchparty/shared";

/** Buckets for dashboard / preview field lists (10-point grade + fill safety). */
export type AutofillPreviewConfidenceGroup =
  | "auto"
  | "caution"
  | "warning";

/**
 * Maps the 0–100 match score to a 0–10 grade for UI copy and grouping hints.
 */
export function autofillConfidenceGrade(score: number): number {
  const clamped = Math.min(100, Math.max(0, score));
  return Math.min(10, Math.max(0, Math.round(clamped / 10)));
}

/**
 * Assigns a scanned field to Auto, Caution, or Warning for collapsible lists.
 * Uses {@link autofillConfidenceGrade} (0–10) alongside tier and fill state:
 * safe **Auto** rows are high-trust (`auto` tier) with data; scores above 80%
 * that land in **Warning** are usually `confirm` / missing profile / not
 * fillable rather than clean `auto` matches.
 *
 * - **Auto** — `auto` tier, fillable control, and a non-empty profile value.
 * - **Warning / error** — `confirm` or `ignore` tier, not fillable, or no
 *   profile value for this kind (includes strong matches that need consent
 *   or extra data).
 * - **Caution** — everything else (typically `suggest` with a value to apply).
 */
export function autofillFieldPreviewGroup(
  field: ScannedAutofillFieldPayload,
  profileValue: string
): AutofillPreviewConfidenceGroup {
  const empty = profileValue.trim().length === 0;

  if (field.tier === "auto" && field.fillStatus === "fillable" && !empty) {
    return "auto";
  }

  if (
    field.tier === "confirm" ||
    field.tier === "ignore" ||
    field.fillStatus !== "fillable" ||
    empty
  ) {
    return "warning";
  }

  return "caution";
}

/** Partitions fields into preview groups while preserving input order per bucket. */
export function groupAutofillPreviewFields(
  fields: ScannedAutofillFieldPayload[],
  profileValueForField: (
    field: ScannedAutofillFieldPayload
  ) => string
): Record<AutofillPreviewConfidenceGroup, ScannedAutofillFieldPayload[]> {
  const buckets: Record<
    AutofillPreviewConfidenceGroup,
    ScannedAutofillFieldPayload[]
  > = { auto: [], caution: [], warning: [] };

  for (const field of fields) {
    const group = autofillFieldPreviewGroup(
      field,
      profileValueForField(field)
    );
    buckets[group].push(field);
  }

  return buckets;
}

export function tierLabel(
  tier: ScannedAutofillFieldPayload["tier"]
): string {
  if (tier === "auto") {
    return "Auto";
  }
  if (tier === "suggest") {
    return "Suggest";
  }
  if (tier === "ignore") {
    return "Ignore";
  }
  return "Confirm";
}

export function defaultSelectedForTier(
  tier: ScannedAutofillFieldPayload["tier"]
): boolean {
  return tier === "auto" || tier === "suggest";
}

/** Fields Quick Apply will fill (high-confidence tiers only). */
export function quickApplyFields(
  fields: ScannedAutofillFieldPayload[]
): ScannedAutofillFieldPayload[] {
  return fields.filter(
    (f) =>
      f.fillStatus === "fillable" &&
      defaultSelectedForTier(f.tier)
  );
}

export function scanSummaryLine(
  fields: ScannedAutofillFieldPayload[]
): string {
  if (fields.length === 0) {
    return "No fields detected on this page yet.";
  }
  const quick = quickApplyFields(fields);
  const review = fields.length - quick.length;
  if (review === 0) {
    return `${fields.length} field${fields.length === 1 ? "" : "s"} matched`;
  }
  return `${quick.length} ready · ${review} need review`;
}
