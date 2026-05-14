import type { ScannedAutofillFieldPayload } from "@searchparty/shared";
import { describe, expect, it } from "vitest";

import {
  autofillConfidenceGrade,
  autofillFieldPreviewGroup,
  groupAutofillPreviewFields,
} from "./autofill-display";

function field(
  overrides: Partial<ScannedAutofillFieldPayload> &
    Pick<ScannedAutofillFieldPayload, "tier" | "score" | "fillStatus" | "kind">,
): ScannedAutofillFieldPayload {
  return {
    spId: "id",
    labelPreview: "Label",
    currentValue: "",
    tagName: "input",
    interactionType: "text",
    ...overrides,
  };
}

describe("autofillConfidenceGrade", () => {
  it("maps 0–100 to a 0–10 grade", () => {
    expect(autofillConfidenceGrade(0)).toBe(0);
    expect(autofillConfidenceGrade(44)).toBe(4);
    expect(autofillConfidenceGrade(45)).toBe(5);
    expect(autofillConfidenceGrade(100)).toBe(10);
  });

  it("clamps out-of-range scores", () => {
    expect(autofillConfidenceGrade(-5)).toBe(0);
    expect(autofillConfidenceGrade(150)).toBe(10);
  });
});

describe("autofillFieldPreviewGroup", () => {
  it('returns "auto" for auto tier fillable fields with profile data', () => {
    expect(
      autofillFieldPreviewGroup(
        field({
          tier: "auto",
          score: 95,
          fillStatus: "fillable",
          kind: "fullName",
        }),
        "Ada Lovelace",
      ),
    ).toBe("auto");
  });

  it('returns "warning" when profile value is empty', () => {
    expect(
      autofillFieldPreviewGroup(
        field({
          tier: "auto",
          score: 95,
          fillStatus: "fillable",
          kind: "desiredSalary",
        }),
        "   ",
      ),
    ).toBe("warning");
  });

  it('returns "warning" for confirm tier even at high score', () => {
    expect(
      autofillFieldPreviewGroup(
        field({
          tier: "confirm",
          score: 100,
          fillStatus: "fillable",
          kind: "smsConsent",
        }),
        "on",
      ),
    ).toBe("warning");
  });

  it('returns "caution" for suggest tier with profile data', () => {
    expect(
      autofillFieldPreviewGroup(
        field({
          tier: "suggest",
          score: 75,
          fillStatus: "fillable",
          kind: "phone",
        }),
        "555-0100",
      ),
    ).toBe("caution");
  });

  it('returns "warning" when not fillable', () => {
    expect(
      autofillFieldPreviewGroup(
        field({
          tier: "auto",
          score: 89,
          fillStatus: "unsupported",
          kind: "resume",
        }),
        "/tmp/cv.pdf",
      ),
    ).toBe("warning");
  });
});

describe("groupAutofillPreviewFields", () => {
  it("preserves scan order within each bucket", () => {
    const a = field({
      spId: "a",
      tier: "auto",
      score: 90,
      fillStatus: "fillable",
      kind: "email",
    });
    const b = field({
      spId: "b",
      tier: "auto",
      score: 92,
      fillStatus: "fillable",
      kind: "fullName",
    });
    const c = field({
      spId: "c",
      tier: "suggest",
      score: 72,
      fillStatus: "fillable",
      kind: "phone",
    });
    const grouped = groupAutofillPreviewFields([a, c, b], (f) => {
      if (f.spId === "a") return "a@b.com";
      if (f.spId === "b") return "Name";
      return "555";
    });
    expect(grouped.auto.map((x) => x.spId)).toEqual(["a", "b"]);
    expect(grouped.caution.map((x) => x.spId)).toEqual(["c"]);
    expect(grouped.warning).toEqual([]);
  });
});
