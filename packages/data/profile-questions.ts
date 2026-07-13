/**
 * Canonical onboarding question catalog for applicant profile setup.
 * Each group is one wizard step (~2–4 prompts) to reduce cognitive load.
 */

export type ProfileQuestionType =
  | "text"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "tags"
  | "file";

export interface ProfileQuestion {
  field: string;
  question: string;
  helper?: string;
  type: ProfileQuestionType;
  options?: readonly string[];
  placeholder?: string;
  acceptedFileTypes?: readonly string[];
  required: boolean;
}

/** One wizard step — showOn controls account vs profile flow. */
export interface ProfileQuestionGroup {
  id: string;
  title: string;
  description?: string;
  showOn: "newAccount" | "newProfile";
  questions: readonly ProfileQuestion[];
}

const YES_NO = ["Yes", "No"] as const;

/** Fields stored in {@link ProfileQuestionGroup} `newAccount`; rest go in profile onboarding JSON. */
export const ACCOUNT_ONBOARDING_FIELD_IDS = ["workAuthorization", "isAdult", "requiresSponsorship"] as const;

export type AccountOnboardingFieldId = (typeof ACCOUNT_ONBOARDING_FIELD_IDS)[number];

export const profileQuestionGroups: readonly ProfileQuestionGroup[] = [
  {
    id: "eligibility",
    title: "Eligibility",
    description:
      "A few quick checks so we stay aligned with how employers hire.",
    showOn: "newAccount",
    questions: [
      {
        field: "workAuthorization",
        question: "Can you work in the US without sponsorship now or later?",
        type: "radio",
        options: YES_NO,
        required: true,
      },
      {
        field: "isAdult",
        question: "Are you 18 or older?",
        type: "radio",
        options: YES_NO,
        required: true,
      },
      {
        field: "requiresSponsorship",
        question: "Do you currently need visa sponsorship?",
        helper: "Optional — helps filter roles that sponsor.",
        type: "radio",
        options: YES_NO,
        required: false,
      },
    ],
  },
  {
    id: "basics",
    title: "Profile basics",
    description:
      "Name this profile so you can swap between versions for different roles.",
    showOn: "newProfile",
    questions: [
      {
        field: "profileName",
        question: "What should we call this profile?",
        helper: "Example: UX — Senior IC",
        type: "text",
        placeholder: "My job search profile",
        required: true,
      },
      {
        field: "firstName",
        question: "First name",
        type: "text",
        placeholder: "Alex",
        required: true,
      },
      {
        field: "lastName",
        question: "Last name",
        type: "text",
        placeholder: "Rivera",
        required: true,
      },
    ],
  },
  {
    id: "contact",
    title: "Contact & links",
    showOn: "newProfile",
    questions: [
      {
        field: "phone",
        question: "Phone number",
        type: "tel",
        placeholder: "+1 555 555 5555",
        required: true,
      },
      {
        field: "location",
        question: "Where are you based?",
        type: "text",
        placeholder: "City, State",
        required: true,
      },
      {
        field: "linkedinUrl",
        question: "LinkedIn URL",
        type: "url",
        placeholder: "https://www.linkedin.com/in/you",
        required: true,
      },
      {
        field: "professionalLinks",
        question: "Portfolio or other link",
        helper: "Optional — GitHub, site, Behance…",
        type: "url",
        placeholder: "https://",
        required: false,
      },
    ],
  },
  {
    id: "careerGoals",
    title: "Target role",
    showOn: "newProfile",
    questions: [
      {
        field: "desiredJobTitles",
        question: "Which titles are you targeting?",
        helper: "Add a few keywords we can match.",
        type: "tags",
        placeholder: "Product designer, Frontend engineer…",
        required: true,
      },
      {
        field: "industries",
        question: "Industries you like",
        type: "multiselect",
        options: [
          "Technology",
          "Healthcare",
          "Finance",
          "Education",
          "Retail",
          "Marketing",
          "Legal",
          "Government",
          "Hospitality",
          "Gaming",
          "Sports",
          "Construction",
          "Real Estate",
          "Other",
        ],
        required: false,
      },
      {
        field: "idealJobDescription",
        question: "Your ideal role in one short paragraph",
        type: "textarea",
        placeholder:
          "Example: Collaborative product design on customer-facing flows…",
        required: false,
      },
    ],
  },
  {
    id: "experience",
    title: "Background",
    showOn: "newProfile",
    questions: [
      {
        field: "yearsExperience",
        question: "Years of professional experience",
        type: "select",
        options: [
          "0-1 years",
          "2-3 years",
          "4-5 years",
          "6-8 years",
          "9-12 years",
          "13+ years",
        ],
        required: true,
      },
      {
        field: "educationLevel",
        question: "Highest education",
        type: "select",
        options: [
          "High School",
          "Associate Degree",
          "Bachelor's Degree",
          "Master's Degree",
          "Doctorate",
          "Bootcamp / Certification",
          "Self-Taught",
          "Other",
        ],
        required: false,
      },
      {
        field: "skills",
        question: "Top skills or tools",
        type: "tags",
        placeholder: "Figma, TypeScript…",
        required: false,
      },
    ],
  },
  {
    id: "workPrefs",
    title: "Work setup",
    showOn: "newProfile",
    questions: [
      {
        field: "employmentTypes",
        question: "What arrangements are you open to?",
        type: "multiselect",
        options: [
          "Full-time",
          "Part-time",
          "Contract",
          "Freelance",
          "Internship",
          "Temporary",
        ],
        required: true,
      },
      {
        field: "workEnvironment",
        question: "Work environments",
        type: "multiselect",
        options: ["Remote", "Hybrid", "On-site"],
        required: true,
      },
      {
        field: "commuteDistance",
        question: "Max commute if on-site?",
        type: "select",
        options: ["5 miles", "10 miles", "25 miles", "50 miles", "Anywhere"],
        required: false,
      },
      {
        field: "openToRelocation",
        question: "Open to relocation?",
        type: "radio",
        options: YES_NO,
        required: false,
      },
      {
        field: "startAvailability",
        question: "When could you start?",
        type: "select",
        options: [
          "Immediately",
          "Within 2 weeks",
          "Within 1 month",
          "More than 1 month",
        ],
        required: false,
      },
    ],
  },
  {
    id: "compensation",
    title: "Compensation & priorities",
    showOn: "newProfile",
    questions: [
      {
        field: "desiredSalary",
        question: "Target yearly compensation",
        type: "text",
        placeholder: "$120,000–$135,000",
        required: true,
      },
      {
        field: "companyCulture",
        question: "Cultures that fit you",
        type: "multiselect",
        options: [
          "Fast-paced",
          "Startup",
          "Corporate",
          "Creative",
          "Collaborative",
          "Independent",
          "Structured",
          "Mission-driven",
        ],
        required: false,
      },
      {
        field: "priorities",
        question: "What matters next?",
        type: "multiselect",
        options: [
          "Higher salary",
          "Career growth",
          "Work-life balance",
          "Remote flexibility",
          "Meaningful work",
          "Better leadership",
          "Learning opportunities",
          "Benefits",
          "Job stability",
        ],
        required: false,
      },
    ],
  },
  {
    id: "documents",
    title: "Resume",
    description: "Upload now or add later from settings.",
    showOn: "newProfile",
    questions: [
      {
        field: "resumeUpload",
        question: "Add a résumé to analyze?",
        type: "file",
        acceptedFileTypes: [".pdf", ".doc", ".docx"],
        required: false,
      },
    ],
  },
  {
    id: "automation",
    title: "How Search Party helps",
    description:
      "SearchParty prepares and fills applications; you always review and submit.",
    showOn: "newProfile",
    questions: [
      {
        field: "applicationReviewPreference",
        question: "When should we pause for your review before filling?",
        helper:
          "SearchParty never submits applications. You stay in control of the final click.",
        type: "radio",
        options: [
          "Always review first",
          "Only for low-confidence matches",
        ],
        required: true,
      },
      {
        field: "interviewConfidence",
        question: "How interview-ready do you feel?",
        type: "select",
        options: [
          "Beginner",
          "Somewhat confident",
          "Confident",
          "Very confident",
        ],
        required: false,
      },
      {
        field: "enableCoaching",
        question: "Turn on coaching + résumé tips?",
        type: "radio",
        options: YES_NO,
        required: false,
      },
    ],
  },
] as const;

/**
 * Returns groups visible for the current flow (`newAccount` groups omitted when account onboarding is done).
 */
export function getProfileQuestionGroupsForFlow(options: {
  skipAccountSections: boolean;
}): readonly ProfileQuestionGroup[] {
  return profileQuestionGroups.filter((group) => {
    if (group.showOn === "newAccount" && options.skipAccountSections) {
      return false;
    }
    return true;
  });
}
