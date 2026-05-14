import type {
  AutofillFieldKind,
  AutofillPayloadValues,
  AutofillProfileSlice,
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

/** Builds the flat string map used when applying autofill values. */
export function buildAutofillPayloadValues(input: {
  user: { name: string; email: string };
  profile: AutofillProfileSlice | null;
}): AutofillPayloadValues {
  const fromName = splitDisplayName(input.user.name);
  const p = input.profile;

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
    resume: "",
    coverLetter: "",
    desiredSalary: "",
    workHistory: "",
    education: "",
    smsConsent: "",
  };
}

/** Looks up the fill string for a scanned field kind from a payload map. */
export function valueForAutofillKind(
  values: AutofillPayloadValues,
  kind: AutofillFieldKind
): string {
  return values[kind];
}
