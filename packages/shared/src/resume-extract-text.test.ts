import { describe, expect, it } from "vitest";

import { extractResumeProposalsFromText } from "./resume-extract-text";

describe("extractResumeProposalsFromText", () => {
  it("returns empty structures for blank text without inventing facts", () => {
    const result = extractResumeProposalsFromText("   ");
    expect(result.workExperiences).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.summary).toBeNull();
  });

  it("extracts cited experience and skills from clear section headings", () => {
    const text = `
Jane Doe
Summary
Engineer

Experience
Engineer at Acme
Designer - Contoso

Education
State University

Skills
TypeScript, React, SQL
`;
    const result = extractResumeProposalsFromText(text);
    expect(result.workExperiences.length).toBeGreaterThan(0);
    expect(result.workExperiences[0]?.company).toBe("Acme");
    expect(result.workExperiences[0]?.title).toBe("Engineer");
    expect(result.workExperiences[0]?.sourceSpan?.excerpt).toContain(
      "Acme",
    );
    expect(result.education[0]?.school).toBe("State University");
    expect(result.skills.map((s) => s.name)).toContain("TypeScript");
  });

  it("does not invent employers when experience section is missing", () => {
    const result = extractResumeProposalsFromText("Hello world");
    expect(result.workExperiences).toEqual([]);
  });
});
