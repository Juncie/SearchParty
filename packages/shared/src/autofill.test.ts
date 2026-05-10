import { describe, expect, it } from "vitest";

import {
  buildAutofillPayloadValues,
  confidenceScoreToTier,
  matchDomFieldToAutofill,
  normalizeAutofillHaystack,
  splitDisplayName,
  valueForAutofillKind,
} from "./autofill";

describe("matchDomFieldToAutofill", () => {
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

describe("splitDisplayName", () => {
  it("handles single token", () => {
    expect(splitDisplayName("Madonna")).toEqual({
      firstName: "Madonna",
      lastName: "",
    });
  });
});
