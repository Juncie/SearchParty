import type { AutofillConfidenceTier } from "./types";

/** Maps a numeric match score to UI tiers: auto-select, suggest, confirm, or ignore. */
export function confidenceScoreToTier(
  score: number
): AutofillConfidenceTier {
  if (score >= 88) {
    return "auto";
  }

  if (score >= 70) {
    return "suggest";
  }

  if (score >= 50) {
    return "confirm";
  }

  return "ignore";
}

/** Downgrades a tier once when the top candidates are too close to trust. */
export function downgradeConfidenceTier(
  tier: AutofillConfidenceTier
): AutofillConfidenceTier {
  if (tier === "auto") {
    return "suggest";
  }
  if (tier === "suggest") {
    return "confirm";
  }
  return "ignore";
}
