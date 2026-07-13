import type {
  AutofillAnswerContext,
  AutofillFieldKind,
  AutofillPayloadValues,
  AutofillProfileSlice,
  AutofillWorkExperienceSlice,
} from "./types";

/**
 * Splits a display name into first and last tokens for autofill when profile
 * name overrides are empty.
 */
export function splitDisplayName(displayName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: "" };
  }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Reads a non-empty string from onboarding/account JSON, ignoring blank values.
 */
export function readConfirmedStringAnswer(
  answers: Readonly<Record<string, unknown>> | undefined,
  field: string,
): string {
  if (!answers) {
    return "";
  }
  const raw = answers[field];
  if (typeof raw !== "string") {
    return "";
  }
  return raw.trim();
}

/**
 * Formats structured work experiences into a plain-text work history answer.
 * Returns empty when no structured rows exist — never invents employment.
 */
export function formatWorkHistoryAnswer(
  experiences: ReadonlyArray<AutofillWorkExperienceSlice> | undefined,
): string {
  if (!experiences || experiences.length === 0) {
    return "";
  }

  return experiences
    .map((experience) => {
      const range = [experience.startDate.trim(), experience.endDate?.trim()]
        .filter(Boolean)
        .join(" – ");
      const header = [experience.title.trim(), experience.company.trim()]
        .filter(Boolean)
        .join(" at ");
      const lines = [header, range, experience.description?.trim() ?? ""].filter(
        Boolean,
      );
      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Builds the flat string map used when applying autofill values from confirmed
 * profile and account answers. Never invents personal facts.
 */
export function buildAutofillPayloadValues(
  input: AutofillAnswerContext | {
    user: { name: string; email: string };
    profile: AutofillProfileSlice | null;
    resumeAttachment?: { label: string };
  },
): AutofillPayloadValues {
  const fromName = splitDisplayName(input.user.name);
  const p = input.profile;
  const onboarding = p?.onboardingAnswers;
  const accountAnswers =
    "accountOnboardingAnswers" in input
      ? input.accountOnboardingAnswers
      : undefined;

  const firstName = (
    p?.firstName.trim() || fromName.firstName
  ).trim();
  const lastName = (
    p?.lastName.trim() || fromName.lastName
  ).trim();
  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const phone = p?.phone.trim() ?? "";
  const address = p?.address.trim() ?? "";
  const linkedin = p?.linkedinUrl.trim() ?? "";
  const github = p?.githubUrl.trim() ?? "";
  let portfolio = p?.portfolioUrl.trim() ?? "";
  if (!portfolio && p?.projects) {
    for (const project of p.projects) {
      const url = project.url?.trim();
      if (url) {
        portfolio = url;
        break;
      }
    }
  }

  const desiredSalary = readConfirmedStringAnswer(
    onboarding,
    "desiredSalary",
  );
  const education = readConfirmedStringAnswer(
    onboarding,
    "educationLevel",
  );
  const workHistory = formatWorkHistoryAnswer(p?.workExperiences);
  const openToRelocation = readConfirmedStringAnswer(
    onboarding,
    "openToRelocation",
  );
  const startAvailability = readConfirmedStringAnswer(
    onboarding,
    "startAvailability",
  );
  const workAuthorization = readConfirmedStringAnswer(
    accountAnswers,
    "workAuthorization",
  );
  const requiresSponsorship = readConfirmedStringAnswer(
    accountAnswers,
    "requiresSponsorship",
  );

  const approvedCoverLetter =
    "approvedCoverLetter" in input
      ? (input.approvedCoverLetter?.trim() ?? "")
      : "";

  return {
    fullName,
    firstName,
    lastName,
    email: input.user.email.trim(),
    phone,
    address,
    linkedin,
    github,
    portfolio,
    resume: input.resumeAttachment?.label.trim() ?? "",
    coverLetter: approvedCoverLetter,
    desiredSalary,
    workHistory,
    education,
    smsConsent: "",
    workAuthorization,
    requiresSponsorship,
    openToRelocation,
    startAvailability,
  };
}

/** Looks up the fill string for a scanned field kind from a payload map. */
export function valueForAutofillKind(
  values: AutofillPayloadValues,
  kind: AutofillFieldKind,
): string {
  return values[kind] ?? "";
}
