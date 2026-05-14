# Search Party Autofill Upgrade Scope

## Goal

Upgrade Search Party’s autofill system from basic keyword matching into a more reliable, confidence-based field intelligence engine.

The system should read web pages, extract form context, classify fields more accurately, autofill user data safely, and improve confidence consistency over time.

---

## Primary Objectives

1. Add stronger DOM field extraction.
2. Replace loose keyword matching with weighted fuzzy matching.
3. Add contextual page/form understanding.
4. Improve confidence scoring and ambiguity handling.
5. Create a reusable autofill engine that can improve over time.

---

## Recommended Stack

### Required

- **Playwright**  
  Use for browser/page interaction, DOM querying, iframe support, and controlled autofill execution.

- **Fuse.js**  
  Use for fuzzy matching field labels, placeholders, names, IDs, aria labels, and nearby text.

### Optional / Phase 2

- **Compromise.js**  
  Use for lightweight NLP normalization and phrase handling.

- **Embeddings / AI semantic matching**  
  Use later for difficult labels like:
  - “What should we call you?”
  - “Where can recruiters reach you?”
  - “Share your professional profile”

---

## Phase 1 — DOM Extraction Upgrade

Create a dedicated DOM extraction module.

### Tasks

- Traverse all relevant fields:
  - `input`
  - `textarea`
  - `select`
  - `button`
  - contenteditable fields if needed

- Capture field signals:

```ts
type DomFieldSignals = {
  tagName: string;
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  autocomplete?: string;
  ariaLabel?: string;
  labelText?: string;
  nearbyText?: string;
  parentSectionText?: string;
  formText?: string;
  options?: string[];
  isVisible: boolean;
  isDisabled: boolean;
  isRequired: boolean;
  cssPath: string;
  xpath?: string;
};
```

- Support:
  - associated `<label for="">`
  - parent-wrapped labels
  - `aria-labelledby`
  - nearby sibling text
  - form/fieldset/legend context
  - iframe detection
  - shadow DOM traversal where possible

---

## Phase 2 — Normalization Layer

Create a normalization utility.

### Tasks

Normalize all signals before scoring:

- lowercase
- trim whitespace
- convert camelCase to words
- convert snake_case and kebab-case to words
- remove unnecessary punctuation
- normalize common abbreviations

### Examples

```ts
fname -> first name
lname -> last name
e-mail -> email
tel -> phone
phone_num -> phone number
linkedInProfile -> linkedin profile
```

Create a synonym map for common autofill fields.

---

## Phase 3 — Fuse.js Matching Engine

Replace `includes()` style matching with Fuse.js.

### Tasks

Install:

```bash
pnpm add fuse.js
```

Create a field dictionary:

```ts
type AutofillFieldKind =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "state"
  | "zip"
  | "linkedin"
  | "github"
  | "portfolio"
  | "resume"
  | "coverLetter";
```

Create weighted searchable records:

```ts
type FieldDictionaryRecord = {
  kind: AutofillFieldKind;
  phrases: string[];
  negativePhrases: string[];
};
```

Use Fuse.js to compare normalized field signals against this dictionary.

Prioritize signals by strength:

```ts
autocomplete >
  labelText >
  ariaLabel >
  name >
  id >
  placeholder >
  nearbyText >
  parentSectionText >
  type;
```

---

## Phase 4 — Confidence Scoring

Create a dedicated confidence engine.

### Tasks

Each candidate should return:

```ts
type AutofillCandidate = {
  kind: AutofillFieldKind;
  score: number;
  reasons: string[];
  penalties: string[];
};
```

Scoring rules:

- Exact `autocomplete` match should score very high.
- Exact label phrase match should score high.
- Fuzzy match should score medium.
- Placeholder-only match should not be enough for auto-fill unless very strong.
- Penalize conflicting terms.
- Penalize hidden/disabled fields.
- Penalize ambiguity when top two results are close.

Confidence tiers:

```ts
type ConfidenceTier =
  | "auto"
  | "suggest"
  | "confirm"
  | "ignore";
```

Suggested thresholds:

```ts
auto: score >= 88;
suggest: score >= 70;
confirm: score >= 50;
ignore: score < 50;
```

Add a margin rule:

```ts
if topCandidate.score - secondCandidate.score < 12:
  lower confidence tier
```

---

## Phase 5 — Autofill Execution

Create a safe execution layer.

### Tasks

- Only autofill fields with `auto` confidence.
- Suggest or ask confirmation for lower-confidence fields.
- Never overwrite non-empty fields unless explicitly allowed.
- Dispatch proper browser events after filling:
  - `input`
  - `change`
  - `blur`

Support:

```ts
type AutofillExecutionOptions = {
  overwriteExisting?: boolean;
  requireVisible?: boolean;
  dryRun?: boolean;
};
```

---

## Phase 6 — Domain Memory

Add lightweight learning.

### Tasks

Store successful matches by domain:

```ts
type DomainAutofillMemory = {
  domain: string;
  fieldSelector: string;
  kind: AutofillFieldKind;
  acceptedCount: number;
  rejectedCount: number;
  lastUsedAt: string;
};
```

Use memory as a scoring boost, not an automatic override.

Rules:

- Accepted user correction increases confidence.
- Rejected autofill lowers future confidence.
- Domain memory should never override strong contradictory field signals.

---

## Phase 7 — Testing

Create test fixtures for common forms:

- job application
- signup form
- checkout form
- profile form
- contact form
- social profile fields
- weird/ambiguous labels

Test cases should include:

```ts
"What should we call you?" -> firstName or fullName
"Where can we reach you?" -> email or phone depending on field type
"Professional profile" -> linkedin or portfolio depending on nearby text
"Website" -> portfolio
"GitHub URL" -> github
"LinkedIn Profile" -> linkedin
```

Assert:

- correct field kind
- confidence score
- confidence tier
- ambiguity handling
- no autofill on unsafe fields

---

## Deliverables

The agent should create or update:

```txt
src/autofill/
  extractDomFields.ts
  normalizeFieldSignals.ts
  fieldDictionary.ts
  scoreAutofillField.ts
  getAutofillCandidates.ts
  executeAutofill.ts
  domainMemory.ts
  types.ts
  __tests__/
    autofillScoring.test.ts
    domExtraction.test.ts
    confidence.test.ts
```

---

## Acceptance Criteria

The upgrade is complete when:

- Field matching no longer relies on broad `includes()` logic.
- Fuse.js is used for fuzzy field classification.
- Field extraction includes labels, aria text, nearby text, and form context.
- Each match returns a score, confidence tier, reasons, and penalties.
- Ambiguous fields are downgraded instead of auto-filled.
- Non-empty fields are not overwritten by default.
- Autofill dispatches correct browser events.
- Tests cover common and ambiguous form fields.
- The system is modular enough to add embeddings later.

---

## Important Rules

- Do not over-engineer with AI/embeddings in this phase.
- Keep the first upgrade deterministic and testable.
- Prefer clear scoring logic over hidden magic.
- Every autofill decision should be explainable through `reasons` and `penalties`.
- Prioritize user safety over aggressive autofill.
