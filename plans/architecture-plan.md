# Search Party — Advanced Form Interaction Upgrade

## Objective

Upgrade Search Party from a basic autofill extension into a more intelligent form interaction engine capable of:

- understanding forms
- classifying fields
- selecting dropdown options
- clicking radio inputs
- toggling checkboxes
- interacting with custom comboboxes
- safely autofilling forms with confidence scoring

The system should operate more like a browser agent than a simple text injector.

---

# Core Philosophy

The system should no longer think:

```txt
fill inputs
````

Instead it should think:

```txt
understand and complete forms
```

This upgrade should prioritize:

* reliability
* explainability
* modularity
* safe interaction handling
* deterministic confidence scoring

Avoid “magic” behavior.

Every autofill decision should be explainable.

---

# Required Stack

## Install

```bash
pnpm add fuse.js
```

## Required Libraries

* Playwright (browser automation + DOM interaction)
* Fuse.js (fuzzy semantic matching)

## Optional Future Libraries

* compromise.js
* embeddings / transformers

Do NOT implement embeddings yet.

---

# New Architecture

Implement this structure:

```txt
Form Intelligence Engine
│
├── DOM Extraction
├── Field Classification
├── Interaction Classification
├── Semantic Matching
├── Confidence Scoring
├── Interaction Execution
├── Verification Layer
└── Learning Layer
```

---

# Phase 1 — DOM Extraction Upgrade

Create a dedicated extraction layer.

## Requirements

Extract ALL relevant fields:

* input
* textarea
* select
* button
* radio
* checkbox
* combobox
* custom dropdowns
* contenteditable fields (optional)

---

## Create Types

```ts
type DomFieldSignals = {
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

  isVisible: boolean;
  isDisabled: boolean;
  isRequired: boolean;

  cssPath: string;
  xpath?: string;
};
```

---

## Extraction Requirements

Support:

* `<label for="">`
* wrapped labels
* aria-labelledby
* sibling text
* nearby headings
* fieldsets
* legends
* forms
* shadow DOM traversal
* iframe traversal where possible

---

# Phase 2 — Field Interaction Classification

Create interaction classification.

---

## Create Types

```ts
type FieldInteractionType =
  | "text"
  | "textarea"
  | "select"
  | "combobox"
  | "radio"
  | "checkbox"
  | "file"
  | "date"
  | "unknown";
```

---

## Create Classifier

Implement:

```ts
function classifyInteractionType(
  element: HTMLElement,
): FieldInteractionType
```

Rules:

### Native Select

```html
<select>
```

→ `select`

---

### Radio

```html
<input type="radio">
```

→ `radio`

---

### Checkbox

```html
<input type="checkbox">
```

→ `checkbox`

---

### Custom Combobox

Detect:

```html
<button aria-haspopup="listbox"></button>
```

or:

```html
<div role="combobox">
```

or:

```html
<input role="combobox">
```

→ `combobox`

---

# Phase 3 — Semantic Matching Engine

Replace weak `includes()` logic with Fuse.js fuzzy matching.

---

## Create Field Dictionary

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
  | "coverLetter"
  | "workAuthorization"
  | "country"
  | "experienceLevel";
```

---

## Create Searchable Dictionary Records

```ts
type FieldDictionaryRecord = {
  kind: AutofillFieldKind;
  phrases: string[];
  negativePhrases: string[];
};
```

---

## Matching Requirements

Use weighted signal scoring.

Signal priority:

```txt
autocomplete
> labelText
> ariaLabel
> name
> id
> placeholder
> nearbyText
> parentSectionText
> type
```

Normalize:

* camelCase
* snake_case
* kebab-case
* punctuation
* spacing
* abbreviations

Examples:

```txt
fname -> first name
lname -> last name
e-mail -> email
tel -> phone
```

---

# Phase 4 — Confidence Engine

Create explainable confidence scoring.

---

## Create Candidate Type

```ts
type AutofillCandidate = {
  kind: AutofillFieldKind;

  score: number;

  reasons: string[];
  penalties: string[];
};
```

---

## Confidence Rules

### Strong Signals

* autocomplete exact match
* label exact match
* aria-label exact match

### Medium Signals

* fuzzy label match
* nearby semantic context

### Weak Signals

* placeholder-only matches
* generic IDs

---

## Add Negative Matching

Example:

```txt
"username"
```

should NOT strongly match:

* email
* firstName

---

## Add Ambiguity Penalty

If top candidates are too close:

```ts
if (top.score - second.score < 12)
```

downgrade confidence tier.

---

## Confidence Tiers

```ts
type ConfidenceTier =
  | "auto"
  | "suggest"
  | "confirm"
  | "ignore";
```

Suggested thresholds:

```txt
auto >= 88
suggest >= 70
confirm >= 50
ignore < 50
```

---

# Phase 5 — Interaction Execution Layer

Create a dedicated execution engine.

---

## Create Execution API

```ts
async function executeFieldInteraction(
  field: ClassifiedField,
  value: unknown,
)
```

This layer should determine HOW to interact with a field.

---

# Native Select Support

Support:

```html
<select>
```

Implementation requirements:

* fuzzy match options
* set value safely
* dispatch:

  * input
  * change
  * blur

Verify selected value after interaction.

---

# Radio Support

Support:

```html
<input type="radio">
```

Requirements:

* detect grouped radio inputs
* understand yes/no style questions
* select matching option
* verify checked state afterward

---

# Checkbox Support

Requirements:

* determine intended boolean state
* avoid double toggling
* verify checked state afterward

---

# Combobox Support (Critical)

Support modern JS UI libraries:

* React Select
* MUI
* AntD
* Radix
* Chakra
* Headless UI

---

## Combobox Flow

General strategy:

1. Click combobox trigger
2. Wait for options to render
3. Extract visible options
4. Fuzzy-match best option
5. Click option
6. Verify selection succeeded

---

## Create Option Type

```ts
type SelectOption = {
  label: string;
  value?: string;
  element: HTMLElement;
};
```

---

## Create Option Extraction

Implement:

```ts
function extractVisibleOptions(): SelectOption[]
```

Support:

* role="option"
* listbox patterns
* menuitem patterns
* visible dropdown containers

---

# Phase 6 — Verification Layer

Every interaction must verify success.

---

## Verification Requirements

### Text Inputs

Verify:

* value changed
* React state updated

### Selects

Verify:

* correct option selected
* visible selected label updated

### Radios

Verify:

* checked === true

### Checkboxes

Verify:

* checked state matches expected value

### Comboboxes

Verify:

* selected option appears in UI
* dropdown closed successfully if applicable

---

# Phase 7 — Domain Memory

Create lightweight learning.

---

## Create Memory Type

```ts
type DomainAutofillMemory = {
  domain: string;

  fieldSelector: string;

  interactionType: FieldInteractionType;

  kind: AutofillFieldKind;

  acceptedCount: number;
  rejectedCount: number;

  lastUsedAt: string;
};
```

---

## Rules

* accepted user corrections increase confidence
* rejected autofills decrease confidence
* domain memory should BOOST confidence
* domain memory should NEVER fully override strong contradictory signals

---

# Phase 8 — Testing

Create extensive tests.

---

## Required Test Categories

* signup forms
* checkout forms
* job applications
* profile forms
* weird labels
* custom dropdowns
* radio groups
* React Select
* MUI selects
* dynamically rendered forms

---

## Required Assertions

Verify:

* field classification
* interaction classification
* confidence scoring
* ambiguity handling
* successful interaction execution
* verification success/failure
* safe fallback behavior

---

# Deliverables

Create/update:

```txt
src/autofill/
  extractDomFields.ts
  classifyInteractionType.ts
  normalizeFieldSignals.ts
  fieldDictionary.ts
  scoreAutofillField.ts
  getAutofillCandidates.ts

  interactions/
    executeFieldInteraction.ts
    handleTextInput.ts
    handleNativeSelect.ts
    handleCombobox.ts
    handleRadio.ts
    handleCheckbox.ts

  verification/
    verifyInteraction.ts

  memory/
    domainMemory.ts

  types.ts

  __tests__/
    fieldClassification.test.ts
    confidence.test.ts
    combobox.test.ts
    radio.test.ts
    select.test.ts
```

---

# Acceptance Criteria

The upgrade is complete when:

* weak `includes()` logic is removed
* Fuse.js powers semantic fuzzy matching
* the engine supports:

  * text inputs
  * selects
  * radios
  * checkboxes
  * comboboxes
* interactions are verified after execution
* confidence scoring is explainable
* ambiguous matches downgrade confidence
* custom dropdowns function correctly
* tests validate behavior across modern UI libraries
* architecture is modular enough for future embeddings support

---

# Important Rules

* Keep logic deterministic and testable
* Avoid hidden AI behavior
* Every autofill action should be explainable
* Never aggressively autofill low-confidence fields
* Prioritize reliability over speed
* Modularize all interaction handlers
* Treat forms as interactive workflows, not just DOM inputs


```
