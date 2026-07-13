/**
 * Privacy-safe product metrics for autofill quality.
 * Never includes raw field values or sensitive personal data.
 */
export type AutofillMetricEvent =
  | {
      type: "fill_accepted";
      kind: string;
      tier: string;
      interactionType: string;
    }
  | {
      type: "fill_corrected";
      kind: string;
      tier: string;
    }
  | {
      type: "unsupported_control";
      kind: string;
      interactionType: string;
    }
  | {
      type: "verification_failed";
      kind: string;
      reasonCode: string;
    };

/** In-memory sink suitable for local aggregation; swap for analytics later. */
const buffer: AutofillMetricEvent[] = [];

/** Records a privacy-safe autofill metric event. */
export function recordAutofillMetric(event: AutofillMetricEvent): void {
  buffer.push(event);
  if (buffer.length > 500) {
    buffer.shift();
  }
}

/** Returns a shallow copy of buffered metric events (for tests/debug). */
export function listAutofillMetrics(): AutofillMetricEvent[] {
  return [...buffer];
}

/** Clears buffered metrics (tests). */
export function clearAutofillMetrics(): void {
  buffer.length = 0;
}
