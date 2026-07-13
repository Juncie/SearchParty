import { describe, expect, it } from "vitest";

import {
  buildOnboardingAnswerCandidates,
  isAnswerEligibleForAutofill,
  provenanceLabelForSource,
  resolveAnswer,
} from "../index";

describe("resolveAnswer", () => {
  it("prefers user edits over profile answers", () => {
    const resolved = resolveAnswer([
      {
        key: "desiredSalary",
        value: "$100k",
        category: "preference",
        source: "profile",
        approval: "confirmed",
      },
      {
        key: "desiredSalary",
        value: "$120k",
        category: "preference",
        source: "user_edit",
        approval: "confirmed",
      },
    ]);
    expect(resolved?.value).toBe("$120k");
    expect(resolved?.source).toBe("user_edit");
  });

  it("never returns draft generated answers", () => {
    const resolved = resolveAnswer([
      {
        key: "coverLetter",
        value: "Draft letter",
        category: "narrative",
        source: "draft_generated",
        approval: "draft",
      },
    ]);
    expect(resolved).toBeNull();
  });

  it("ignores empty confirmed values", () => {
    expect(
      isAnswerEligibleForAutofill({
        key: "educationLevel",
        value: "   ",
        category: "fact",
        source: "profile",
        approval: "confirmed",
      }),
    ).toBe(false);
  });
});

describe("buildOnboardingAnswerCandidates", () => {
  it("resolves account eligibility separately from profile preferences", () => {
    const answers = buildOnboardingAnswerCandidates({
      accountOnboardingAnswers: {
        workAuthorization: "Yes",
        requiresSponsorship: "No",
      },
      profileOnboardingAnswers: {
        desiredSalary: "$130,000",
        openToRelocation: "Yes",
      },
    });

    expect(
      answers.find((a) => a.key === "workAuthorization")?.source,
    ).toBe("account");
    expect(
      answers.find((a) => a.key === "desiredSalary")?.source,
    ).toBe("profile");
    expect(provenanceLabelForSource("account")).toBe(
      "From your account",
    );
  });
});
