import { describe, expect, it } from "vitest";

import {
  buildAutofillPayloadValues,
  confidenceScoreToTier,
  matchDomFieldToAutofill,
  normalizeAutofillHaystack,
  normalizeControlType,
  splitDisplayName,
  valueForAutofillKind,
} from "./autofill";

describe("matchDomFieldToAutofill", () => {
  it("matches Breezy-style full name fields as a single value", () => {
    const result = matchDomFieldToAutofill({
      tagName: "input",
      name: "name",
      id: "candidate-name",
      type: "text",
      placeholder: "Full Name",
      ariaLabel: "",
      autocomplete: "",
      labelText: "Full Name",
    });
    expect(result.kind).toBe("fullName");
    expect(result.score).toBeGreaterThanOrEqual(88);
  });

  it("prefers autocomplete email", () => {
    const result = matchDomFieldToAutofill({
      tagName: "input",
      name: "q",
      id: "",
      type: "text",
      placeholder: "",
      ariaLabel: "",
      autocomplete: "email",
      labelText: "",
    });
    expect(result.kind).toBe("email");
    expect(result.score).toBeGreaterThanOrEqual(90);
  });

  it("matches phone from label copy", () => {
    const result = matchDomFieldToAutofill({
      tagName: "input",
      name: "phone",
      id: "phone",
      type: "text",
      placeholder: "555…",
      ariaLabel: "",
      autocomplete: "",
      labelText: "Mobile phone number",
    });
    expect(result.kind).toBe("phone");
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it("matches LinkedIn from placeholder", () => {
    const result = matchDomFieldToAutofill({
      tagName: "input",
      name: "urls[LinkedIn]",
      id: "",
      type: "url",
      placeholder: "https://linkedin.com/in/…",
      ariaLabel: "",
      autocomplete: "",
      labelText: "",
    });
    expect(result.kind).toBe("linkedin");
  });
});

describe("confidenceScoreToTier", () => {
  it("maps thresholds from execution plan", () => {
    expect(confidenceScoreToTier(95)).toBe("auto");
    expect(confidenceScoreToTier(80)).toBe("suggest");
    expect(confidenceScoreToTier(50)).toBe("confirm");
  });
});

describe("buildAutofillPayloadValues", () => {
  it("splits account name when profile overrides are empty", () => {
    const values = buildAutofillPayloadValues({
      user: { name: "Jamie Doe", email: "jamie@example.com" },
      profile: null,
    });
    expect(values.firstName).toBe("Jamie");
    expect(values.lastName).toBe("Doe");
    expect(values.fullName).toBe("Jamie Doe");
    expect(values.email).toBe("jamie@example.com");
  });

  it("uses profile contact fields when present", () => {
    const values = buildAutofillPayloadValues({
      user: { name: "Jamie Doe", email: "jamie@example.com" },
      profile: {
        firstName: "James",
        lastName: "",
        phone: "+15551212",
        address: "1 Main St",
        linkedinUrl: "https://linkedin.com/in/j",
        githubUrl: "https://github.com/j",
        portfolioUrl: "https://j.dev",
        projects: [],
      },
    });
    expect(values.firstName).toBe("James");
    expect(values.phone).toBe("+15551212");
    expect(values.portfolio).toBe("https://j.dev");
  });

  it("falls back portfolio to first project URL", () => {
    const values = buildAutofillPayloadValues({
      user: { name: "A", email: "a@b.co" },
      profile: {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        projects: [{ url: "https://example.com/p" }],
      },
    });
    expect(values.portfolio).toBe("https://example.com/p");
  });

  it("maps confirmed onboarding salary and education answers", () => {
    const values = buildAutofillPayloadValues({
      user: { name: "A B", email: "a@b.co" },
      profile: {
        firstName: "A",
        lastName: "B",
        phone: "",
        address: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        projects: [],
        onboardingAnswers: {
          desiredSalary: "  $120,000–$135,000  ",
          educationLevel: "Bachelor's Degree",
          yearsExperience: "4-5 years",
        },
      },
    });
    expect(values.desiredSalary).toBe("$120,000–$135,000");
    expect(values.education).toBe("Bachelor's Degree");
    expect(values.workHistory).toBe("");
  });

  it("ignores malformed onboarding values and empty strings", () => {
    const values = buildAutofillPayloadValues({
      user: { name: "A B", email: "a@b.co" },
      profile: {
        firstName: "A",
        lastName: "B",
        phone: "",
        address: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        projects: [],
        onboardingAnswers: {
          desiredSalary: "   ",
          educationLevel: 42,
          openToRelocation: "Yes",
        },
      },
    });
    expect(values.desiredSalary).toBe("");
    expect(values.education).toBe("");
  });

  it("formats structured work experiences and never invents them", () => {
    const empty = buildAutofillPayloadValues({
      user: { name: "A B", email: "a@b.co" },
      profile: {
        firstName: "A",
        lastName: "B",
        phone: "",
        address: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        projects: [],
        onboardingAnswers: { yearsExperience: "4-5 years" },
        workExperiences: [],
      },
    });
    expect(empty.workHistory).toBe("");

    const values = buildAutofillPayloadValues({
      user: { name: "A B", email: "a@b.co" },
      profile: {
        firstName: "A",
        lastName: "B",
        phone: "",
        address: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        projects: [],
        workExperiences: [
          {
            company: "Acme",
            title: "Engineer",
            startDate: "2020",
            endDate: "2022",
            description: "Built APIs",
          },
        ],
      },
    });
    expect(values.workHistory).toContain("Engineer at Acme");
    expect(values.workHistory).toContain("2020 – 2022");
    expect(values.workHistory).toContain("Built APIs");
  });
});

describe("valueForAutofillKind", () => {
  it("reads the correct slot", () => {
    const v = buildAutofillPayloadValues({
      user: { name: "A B", email: "e@e.co" },
      profile: null,
    });
    expect(valueForAutofillKind(v, "email")).toBe("e@e.co");
  });
});

describe("normalizeAutofillHaystack", () => {
  it("normalizes casing and separators", () => {
    const h = normalizeAutofillHaystack({
      tagName: "INPUT",
      name: "First_NAME",
      id: "",
      type: "text",
      placeholder: "",
      ariaLabel: "",
      autocomplete: "",
      labelText: "",
    });
    expect(h).toContain("first name");
  });
});

describe("normalizeControlType", () => {
  it("keeps tel distinct from phone for HTML type hints", () => {
    expect(normalizeControlType("tel")).toBe("tel");
    expect(normalizeControlType("email")).toBe("email");
  });
});

describe("splitDisplayName", () => {
  it("handles single token", () => {
    expect(splitDisplayName("Madonna")).toEqual({
      firstName: "Madonna",
      lastName: "",
    });
  });
});
