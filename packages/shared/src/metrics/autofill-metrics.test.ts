/**
 * Privacy-safe autofill metrics smoke test.
 */
import { describe, expect, it } from "vitest";

import {
  clearAutofillMetrics,
  listAutofillMetrics,
  recordAutofillMetric,
} from "./autofill-metrics";

describe("autofill metrics", () => {
  it("records events without field values", () => {
    clearAutofillMetrics();
    recordAutofillMetric({
      type: "fill_accepted",
      kind: "email",
      tier: "auto",
      interactionType: "text",
    });
    const events = listAutofillMetrics();
    expect(events).toHaveLength(1);
    expect(JSON.stringify(events[0])).not.toMatch(/@/);
  });
});
