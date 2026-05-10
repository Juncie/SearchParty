import type { ScannedAutofillFieldPayload } from "@searchparty/shared";

export function tierLabel(
  tier: ScannedAutofillFieldPayload["tier"],
): string {
  if (tier === "auto") {
    return "Auto";
  }
  if (tier === "suggest") {
    return "Suggest";
  }
  return "Confirm";
}

export function defaultSelectedForTier(
  tier: ScannedAutofillFieldPayload["tier"],
): boolean {
  return tier !== "confirm";
}

/** Fields Quick Apply will fill (high-confidence tiers only). */
export function quickApplyFields(
  fields: ScannedAutofillFieldPayload[],
): ScannedAutofillFieldPayload[] {
  return fields.filter((f) => defaultSelectedForTier(f.tier));
}

export function scanSummaryLine(fields: ScannedAutofillFieldPayload[]): string {
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
