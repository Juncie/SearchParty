import type { AutofillFieldKind } from "./types";

/** All {@link AutofillFieldKind} values in stable iteration order (e.g. scoring loops). */
export const AUTOFILL_KINDS: readonly AutofillFieldKind[] =
  [
    "fullName",
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "linkedin",
    "github",
    "portfolio",
    "resume",
    "coverLetter",
    "desiredSalary",
    "workHistory",
    "education",
    "smsConsent",
    "workAuthorization",
    "requiresSponsorship",
    "openToRelocation",
    "startAvailability",
  ] as const;

/** Weighted dictionary row used by the Fuse-backed matcher. */
export type FieldDictionaryRecord = {
  kind: AutofillFieldKind;
  phrases: readonly string[];
  negativePhrases: readonly string[];
};

/** Maps normalized autocomplete detail tokens (see HTML autofill) to field kinds. */
export const AUTOCOMPLETE_KIND: Readonly<
  Record<string, AutofillFieldKind>
> = {
  name: "fullName",
  "given-name": "firstName",
  fname: "firstName",
  "first-name": "firstName",
  "family-name": "lastName",
  lname: "lastName",
  "last-name": "lastName",
  email: "email",
  tel: "phone",
  "tel-national": "phone",
  "tel-local": "phone",
  "tel-extension": "phone",
  "street-address": "address",
  "address-line1": "address",
  "address-line2": "address",
  "address-line3": "address",
  "country-name": "address",
};

/** Search vocabulary for the deterministic autofill matcher. */
export const FIELD_DICTIONARY: readonly FieldDictionaryRecord[] =
  [
    {
      kind: "fullName",
      phrases: [
        "full name",
        "legal name",
        "name",
        "candidate name",
        "applicant name",
        "your name",
      ],
      negativePhrases: [
        "first name",
        "last name",
        "given name",
        "family name",
        "company name",
        "reference name",
        "user name",
        "username",
      ],
    },
    {
      kind: "firstName",
      phrases: [
        "first name",
        "given name",
        "preferred name",
        "what should we call you",
        "fname",
        "firstname",
        "givenname",
      ],
      negativePhrases: [
        "last",
        "family",
        "surname",
        "company",
        "business",
        "username",
        "user name",
        "password",
      ],
    },
    {
      kind: "lastName",
      phrases: [
        "last name",
        "family name",
        "surname",
        "lname",
        "lastname",
        "familyname",
      ],
      negativePhrases: [
        "first",
        "given",
        "company",
        "business",
        "username",
        "user name",
        "password",
      ],
    },
    {
      kind: "email",
      phrases: [
        "email",
        "email address",
        "e mail",
        "mail",
        "where can we reach you",
        "where can recruiters reach you",
      ],
      negativePhrases: [
        "phone",
        "sms",
        "mobile",
        "website",
        "url",
        "linkedin",
        "github",
        "mailing address",
        "street address",
        "address line",
        "cover letter",
        "coverletter",
        "resume",
        "personal statement",
        "motivation letter",
      ],
    },
    {
      kind: "phone",
      phrases: [
        "phone",
        "phone number",
        "mobile number",
        "cell phone",
        "telephone",
        "tel",
        "mobile",
      ],
      negativePhrases: [
        "email",
        "mail",
        "website",
        "url",
        "linkedin",
        "github",
        "mailing address",
        "street address",
        "address line",
        "cover letter",
        "coverletter",
        "resume",
        "personal statement",
        "motivation letter",
      ],
    },
    {
      kind: "address",
      phrases: [
        "address",
        "street address",
        "mailing address",
        "address line",
        "home address",
      ],
      negativePhrases: [
        "email",
        "phone",
        "website",
        "url",
        "linkedin",
        "github",
        "ip address",
      ],
    },
    {
      kind: "linkedin",
      phrases: [
        "linkedin",
        "linked in",
        "linked-in",
        "linkedin profile",
      ],
      negativePhrases: [
        "github",
        "git hub",
        "portfolio",
        "website",
        "personal site",
      ],
    },
    {
      kind: "github",
      phrases: [
        "github",
        "git hub",
        "github profile",
        "github url",
        "code repository",
      ],
      negativePhrases: [
        "linkedin",
        "linked in",
        "portfolio",
        "website",
        "personal site",
      ],
    },
    {
      kind: "portfolio",
      phrases: [
        "portfolio",
        "personal website",
        "personal site",
        "website",
        "website url",
        "homepage",
      ],
      negativePhrases: [
        "linkedin",
        "github",
        "git hub",
        "phone",
        "email",
      ],
    },
    {
      kind: "resume",
      phrases: [
        "resume",
        "cv",
        "upload resume",
        "attach resume",
        "resume file",
      ],
      negativePhrases: [
        "cover letter",
        "portfolio",
        "website",
      ],
    },
    {
      kind: "coverLetter",
      phrases: [
        "cover letter",
        "coverletter",
        "motivation letter",
        "personal statement",
        "message to hiring manager",
      ],
      negativePhrases: ["resume", "cv", "email", "phone"],
    },
    {
      kind: "desiredSalary",
      phrases: [
        "desired salary",
        "salary expectation",
        "compensation expectation",
        "expected compensation",
        "base salary",
      ],
      negativePhrases: ["company", "history", "education"],
    },
    {
      kind: "workHistory",
      phrases: [
        "work history",
        "employment history",
        "experience",
        "company",
        "title",
        "current employer",
      ],
      negativePhrases: [
        "education",
        "school",
        "email",
        "phone",
        "reference",
      ],
    },
    {
      kind: "education",
      phrases: [
        "education",
        "school",
        "university",
        "college",
        "degree",
        "major",
      ],
      negativePhrases: [
        "work history",
        "employment",
        "company",
        "reference",
      ],
    },
    {
      kind: "smsConsent",
      phrases: [
        "sms",
        "text messages",
        "receive sms messages",
        "agree to receive sms",
        "informational text messages",
      ],
      negativePhrases: [
        "phone number",
        "mobile number",
        "email",
      ],
    },
    {
      kind: "workAuthorization",
      phrases: [
        "work authorization",
        "authorized to work",
        "legally authorized to work",
        "eligible to work",
        "right to work",
        "work in the united states",
        "work in the us",
      ],
      negativePhrases: [
        "sponsorship",
        "visa",
        "require sponsorship",
      ],
    },
    {
      kind: "requiresSponsorship",
      phrases: [
        "require sponsorship",
        "requires sponsorship",
        "visa sponsorship",
        "need sponsorship",
        "will you now or in the future require sponsorship",
        "immigration sponsorship",
      ],
      negativePhrases: [
        "authorized to work",
        "work authorization",
        "eligible to work",
      ],
    },
    {
      kind: "openToRelocation",
      phrases: [
        "open to relocation",
        "willing to relocate",
        "relocate",
        "relocation",
      ],
      negativePhrases: ["commute", "remote", "salary"],
    },
    {
      kind: "startAvailability",
      phrases: [
        "start date",
        "available to start",
        "when can you start",
        "earliest start date",
        "availability",
      ],
      negativePhrases: [
        "salary",
        "relocation",
        "work authorization",
      ],
    },
  ] as const;
