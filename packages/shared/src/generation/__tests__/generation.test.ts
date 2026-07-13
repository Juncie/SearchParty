import { describe, expect, it } from "vitest";

import {
  assertNoInventedEntities,
  buildEvidenceBoundDraft,
} from "../index";

describe("buildEvidenceBoundDraft", () => {
  it("only includes supplied evidence", () => {
    const draft = buildEvidenceBoundDraft({
      kind: "cover_letter",
      company: "Acme",
      title: "Engineer",
      tone: "professional",
      evidence: [
        { label: "Role", value: "Built APIs at Contoso" },
        { label: "Skill", value: "TypeScript" },
      ],
    });
    expect(draft).toContain("Acme");
    expect(draft).toContain("Built APIs at Contoso");
    expect(draft).toContain("TypeScript");
  });
});

describe("assertNoInventedEntities", () => {
  it("rejects banned tokens absent from evidence", () => {
    const result = assertNoInventedEntities({
      content: "I worked at FakeCorp for 10 years.",
      evidenceValues: ["Built APIs at Contoso"],
      bannedTokens: ["FakeCorp"],
    });
    expect(result.ok).toBe(false);
  });

  it("allows tokens present in evidence", () => {
    const result = assertNoInventedEntities({
      content: "I worked at Contoso.",
      evidenceValues: ["Built APIs at Contoso"],
      bannedTokens: ["Contoso"],
    });
    expect(result.ok).toBe(true);
  });
});
