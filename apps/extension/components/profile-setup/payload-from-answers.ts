import {
  ACCOUNT_ONBOARDING_FIELD_IDS,
  type AccountOnboardingFieldId,
} from "@searchparty/data/profile-questions";
import { applicantProfileInputSchema } from "@searchparty/shared";
import type { ApplicantProfileInput } from "@searchparty/shared";

/**
 * Parses tag-style answers into trimmed strings for profile skills payloads.
 */
export function coerceStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter(
        (v): v is string =>
          typeof v === "string" && v.trim().length > 0,
      )
      .map((v) => v.trim());
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Splits onboarding state into JSON-safe account vs profile payloads.
 */
export function partitionOnboardingAnswers(
  answers: Record<string, unknown>,
): {
  account: Record<string, unknown>;
  profile: Record<string, unknown>;
} {
  const account: Record<string, unknown> = {};
  const profile: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(answers)) {
    if (
      ACCOUNT_ONBOARDING_FIELD_IDS.includes(
        key as AccountOnboardingFieldId,
      )
    ) {
      account[key] = value;
    } else {
      profile[key] = value;
    }
  }

  return { account, profile };
}

/**
 * Maps wizard answers onto the persisted applicant profile + onboardingAnswers blob for the AI/agent.
 */
export function buildApplicantProfileInputFromAnswers(
  answers: Record<string, unknown>,
): ApplicantProfileInput {
  const { profile: profileAnswers } =
    partitionOnboardingAnswers(answers);

  const desiredTitles = coerceStringArray(
    profileAnswers.desiredJobTitles,
  );
  const skillNames = coerceStringArray(profileAnswers.skills);

  const onboardingAnswers: Record<string, unknown> = {
    ...profileAnswers,
  };

  const professionalLinksRaw = profileAnswers.professionalLinks;
  const portfolioUrl =
    typeof professionalLinksRaw === "string" &&
      professionalLinksRaw.trim().length > 0
      ? professionalLinksRaw.trim()
      : "";

  const parsed = applicantProfileInputSchema.safeParse({
    name:
      typeof profileAnswers.profileName === "string"
        ? profileAnswers.profileName
        : "",
    targetRole:
      desiredTitles.length > 0
        ? (desiredTitles[0] ?? "")
        : "Open to opportunities",
    summary:
      typeof profileAnswers.idealJobDescription === "string"
        ? profileAnswers.idealJobDescription.trim()
        : "",
    preferredTone: "professional",
    firstName:
      typeof profileAnswers.firstName === "string"
        ? profileAnswers.firstName
        : "",
    lastName:
      typeof profileAnswers.lastName === "string"
        ? profileAnswers.lastName
        : "",
    phone:
      typeof profileAnswers.phone === "string"
        ? profileAnswers.phone
        : "",
    address:
      typeof profileAnswers.location === "string"
        ? profileAnswers.location
        : "",
    linkedinUrl:
      typeof profileAnswers.linkedinUrl === "string"
        ? profileAnswers.linkedinUrl
        : "",
    githubUrl: "",
    portfolioUrl,
    onboardingAnswers,
    workExperiences: [],
    skills: skillNames.map((name) => ({
      name,
      category: "Skills",
      yearsOfExperience: 0,
    })),
    projects: [],
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues
        .map((issue) => issue.message)
        .join("; "),
    );
  }

  return parsed.data;
}
