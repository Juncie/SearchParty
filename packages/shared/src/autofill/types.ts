/** Categories of job-application fields the extension can detect and fill. */
export type AutofillFieldKind =
  | "fullName"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "address"
  | "linkedin"
  | "github"
  | "portfolio"
  | "resume"
  | "coverLetter"
  | "desiredSalary"
  | "workHistory"
  | "education"
  | "smsConsent";

/** The browser interaction needed to complete a detected application field. */
export type AutofillInteractionType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file"
  | "combobox"
  | "button"
  | "unknown";

/** Whether SearchParty can currently apply a value to a detected field. */
export type AutofillFillStatus =
  | "fillable"
  | "manual"
  | "unsupported";

/** UI / selection tier derived from a numeric confidence score. */
export type AutofillConfidenceTier =
  | "auto"
  | "suggest"
  | "confirm"
  | "ignore";

/** DOM-derived hints collected from a single form control for scoring. */
export type DomFieldSignals = {
  tagName: string;
  role?: string;
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  autocomplete?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  labelText?: string;
  nearbyText?: string;
  parentSectionText?: string;
  formText?: string;
  options?: string[];
  interactionType?: AutofillInteractionType;
  isVisible?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isChecked?: boolean;
  cssPath?: string;
  xpath?: string;
};

/** Result of classifying one DOM field into an {@link AutofillFieldKind}. */
export type AutofillMatchResult = {
  kind: AutofillFieldKind;
  score: number;
};

/** One scored candidate with human-readable evidence for the decision. */
export type AutofillCandidate = AutofillMatchResult & {
  reasons: string[];
  penalties: string[];
};

/** Full classification detail for UI debugging and tests. */
export type AutofillMatchDetail = AutofillCandidate & {
  tier: AutofillConfidenceTier;
  candidates: AutofillCandidate[];
};

/** Lightweight per-domain learning hint used as a scoring boost, never an override. */
export type DomainMemoryHint = {
  kind: AutofillFieldKind;
  acceptedCount: number;
  rejectedCount: number;
};

/** String values keyed by autofill kind, ready to paste into matched controls. */
export type AutofillPayloadValues = Record<
  AutofillFieldKind,
  string
>;

/** Minimal profile slice used when building autofill values (matches ApplicantProfile fields). */
export type AutofillProfileSlice = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  projects: ReadonlyArray<{ url: string }>;
};

/** One scored field from a content-script scan, including stable id for apply messages. */
export type ScannedAutofillFieldPayload = {
  /** Stable id for apply messages. */
  spId: string;
  /** Detected field kind. */
  kind: AutofillFieldKind;
  /** Confidence score from 0 to 100. */
  score: number;
  /** UI / selection tier derived from the confidence score. */
  tier: AutofillConfidenceTier;
  labelPreview: string;
  currentValue: string;
  tagName: string;
  interactionType: AutofillInteractionType;
  fillStatus: AutofillFillStatus;
  unsupportedReason?: string;
  cssPath?: string;
  options?: string[];
  reasons?: string[];
  penalties?: string[];
};

/** Options for content-script autofill execution. */
export type AutofillExecutionOptions = {
  overwriteExisting?: boolean;
  requireVisible?: boolean;
  dryRun?: boolean;
};

/** Per-field result from a verified autofill apply attempt. */
export type AutofillFieldExecutionResult = {
  spId: string;
  ok: boolean;
  reason?: string;
};
