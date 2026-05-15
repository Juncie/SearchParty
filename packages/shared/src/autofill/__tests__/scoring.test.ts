import { describe, expect, it } from "vitest";

import {
  confidenceScoreToTier,
  matchDomFieldToAutofillDetailed,
  normalizeSignalValue,
} from "../index";

describe("Fuse-based autofill scoring", () => {
  it("returns explainable reasons for strong label matches", () => {
    const result = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "text",
      labelText: "LinkedIn Profile",
      placeholder: "https://linkedin.com/in/name",
      isVisible: true,
      isDisabled: false,
    });

    expect(result.kind).toBe("linkedin");
    expect(result.tier).toBe("auto");
    expect(
      result.reasons.some((r) =>
        /linkedin|linked in/i.test(r)
      )
    ).toBe(true);
  });

  it("uses input type to resolve contact wording", () => {
    const emailResult = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "email",
      labelText: "Where can we reach you?",
      isVisible: true,
      isDisabled: false,
    });
    const phoneResult = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "tel",
      labelText: "Where can we reach you?",
      isVisible: true,
      isDisabled: false,
    });

    expect(emailResult.kind).toBe("email");
    expect(phoneResult.kind).toBe("phone");
  });

  it("downgrades ambiguous profile fields instead of auto-filling", () => {
    const result = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "text",
      labelText: "Given or family name",
      isVisible: true,
      isDisabled: false,
    });

    expect(result.score).toBeLessThan(88);
    expect(result.tier).not.toBe("auto");
    expect(result.penalties.join(" ")).toContain(
      "conflicting"
    );
  });

  it("keeps unsupported vague fields in the ignore tier", () => {
    const result = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "text",
      labelText: "Internal referral code",
      isVisible: true,
      isDisabled: false,
    });

    expect(result.tier).toBe("ignore");
  });

  it("detects known application artifacts without borrowing contact values", () => {
    const resume = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "file",
      labelText: "Upload resume",
      interactionType: "file",
      isVisible: true,
      isDisabled: false,
    });

    expect(resume.kind).toBe("resume");
    expect(resume.score).toBeGreaterThanOrEqual(70);
  });

  it("does not penalize hidden resume file inputs for visibility", () => {
    const resume = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "file",
      labelText: "Upload resume",
      interactionType: "file",
      isVisible: false,
      isDisabled: false,
    });

    expect(resume.kind).toBe("resume");
    expect(resume.penalties.join(" ")).not.toContain(
      "field is not visible",
    );
  });

  it("does not let sibling field copy in formText steal phone/email matches", () => {
    const coverLetter = matchDomFieldToAutofillDetailed({
      tagName: "textarea",
      type: "textarea",
      labelText: "Cover letter (optional)",
      formText:
        "First name Last name Email address Mobile phone number Mailing address LinkedIn GitHub Portfolio",
      isVisible: true,
      isDisabled: false,
    });

    expect(coverLetter.kind).toBe("coverLetter");
    expect(coverLetter.kind).not.toBe("phone");
    expect(coverLetter.kind).not.toBe("email");

    const mailing = matchDomFieldToAutofillDetailed({
      tagName: "textarea",
      type: "textarea",
      labelText: "Mailing address",
      formText:
        "First name Email address Mobile phone Portfolio Cover letter optional",
      isVisible: true,
      isDisabled: false,
    });

    expect(mailing.kind).toBe("address");
    expect(mailing.score).toBeGreaterThanOrEqual(88);
  });

  it("keeps standard first and last name labels at high confidence", () => {
    const first = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "text",
      labelText: "First name",
      formText:
        "First name Last name Email Mobile phone Mailing address LinkedIn GitHub Portfolio Cover letter",
      isVisible: true,
      isDisabled: false,
    });
    const last = matchDomFieldToAutofillDetailed({
      tagName: "input",
      type: "text",
      labelText: "Last name",
      formText:
        "First name Last name Email Mobile phone Mailing address LinkedIn GitHub Portfolio Cover letter",
      isVisible: true,
      isDisabled: false,
    });

    expect(first.kind).toBe("firstName");
    expect(first.tier).toBe("auto");
    expect(first.score).toBeGreaterThanOrEqual(88);

    expect(last.kind).toBe("lastName");
    expect(last.tier).toBe("auto");
    expect(last.score).toBeGreaterThanOrEqual(88);
  });

  it("uses domain memory as a small boost only", () => {
    const result = matchDomFieldToAutofillDetailed(
      {
        tagName: "input",
        type: "text",
        labelText: "Website",
        isVisible: true,
        isDisabled: false,
      },
      {
        kind: "portfolio",
        acceptedCount: 3,
        rejectedCount: 0,
      }
    );

    expect(result.kind).toBe("portfolio");
    expect(result.reasons.join(" ")).toContain(
      "domain memory"
    );
  });

  it("uses domain memory as a small penalty when rejected", () => {
    const result = matchDomFieldToAutofillDetailed(
      {
        tagName: "input",
        type: "text",
        labelText: "Website",
        isVisible: true,
        isDisabled: false,
      },
      {
        kind: "portfolio",
        acceptedCount: 0,
        rejectedCount: 3,
      }
    );

    expect(result.penalties.join(" ")).toContain(
      "domain memory"
    );
  });
});

describe("normalization", () => {
  it("splits casing and expands common abbreviations", () => {
    expect(normalizeSignalValue("linkedInProfile")).toBe(
      "linkedin profile"
    );
    expect(normalizeSignalValue("phone_num")).toBe(
      "phone number"
    );
  });
});

describe("confidence tiers", () => {
  it("adds ignore below the confirmation threshold", () => {
    expect(confidenceScoreToTier(49)).toBe("ignore");
  });
});
