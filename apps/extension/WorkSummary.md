# Autofill Stack Upgrade Work Summary

## Overall goal

The goal of this upgrade was to make SearchParty autofill less like a keyword
search and more like a small, deterministic field-intelligence engine.

Before this work, the extension scanned a page for basic form controls, collected
a few attributes, and asked shared code to classify each field with hand-written
keyword scoring. That was useful, but brittle: a field named `candidate_email`
was easy, while real job application labels like "Where can we reach you?" or
"Professional profile" were harder to reason about safely.

After this work, the autofill path has four clearer stages:

1. The content script extracts richer DOM signals from the page.
2. The shared matcher normalizes those signals and scores them with Fuse.js plus
   explicit rules.
3. The extension only exposes fields whose confidence is high enough to review
   or fill.
4. The apply layer fills selected fields safely and records successful matches
   as lightweight domain memory.

The important design principle is explainability. Every match can carry reasons
and penalties, so we can answer, "Why did SearchParty think this was an email
field?" instead of guessing.

## What changed and why

### 1. Dependency ownership

Fuse.js now belongs to `@searchparty/shared` because the matching engine lives in
that package. This matters in a monorepo: each package should declare the runtime
dependencies it imports directly, even if another app already has the package.

Playwright was moved to the extension's dev dependencies. Playwright is excellent
for driving a browser in tests, but it is not production extension runtime code.
A browser extension content script runs inside the user's page and uses normal
DOM APIs like `querySelector`, `value`, and `dispatchEvent`.

The extension also has a test script now:

```bash
pnpm --filter search-party-extension test
```

The plan originally called for jsdom. It is installed, but the available Node 20
runtime hit a transitive ESM/CommonJS startup issue before tests could run. I
kept jsdom installed for parity with the plan and configured Vitest to use
`happy-dom` for these lightweight DOM unit tests. The tests exercise our DOM
code, not browser automation.

### 2. Shared autofill engine modules

The previous shared autofill file was split into focused modules under:

```txt
packages/shared/src/autofill/
```

The important modules are:

- `types.ts` defines the shared contracts: field kinds, DOM signals, confidence
  tiers, candidates, execution options, and scan payloads.
- `normalizeFieldSignals.ts` cleans up raw strings so matching is more stable.
  For example, `phone_num` becomes `phone number`, and `linkedInProfile` becomes
  `linkedin profile`.
- `fieldDictionary.ts` contains the vocabulary for the field kinds SearchParty
  can currently fill: first name, last name, email, phone, address, LinkedIn,
  GitHub, and portfolio.
- `scoreAutofillField.ts` compares normalized DOM signals to the dictionary with
  Fuse.js and explicit negative phrases.
- `getAutofillCandidates.ts` ranks candidates, applies type/autocomplete hints,
  applies the ambiguity margin rule, and returns reasons and penalties.
- `confidence.ts` maps numeric scores into tiers: `auto`, `suggest`, `confirm`,
  and `ignore`.

I intentionally kept the current `AutofillFieldKind` set. The plan mentioned
future kinds like resume and cover letter, but the current profile schema does
not contain values for those fields. Detecting them now would create confusing
scan results that cannot actually be filled.

### 3. Normalization

Normalization is the cleanup step before matching. Real form fields use many
styles:

```txt
firstName
first_name
first-name
fname
```

All of those should point toward "first name." The matcher now normalizes
casing, separators, punctuation, and common abbreviations before scoring. This
makes the later Fuse.js comparison more reliable because it compares cleaned-up
signals rather than raw HTML attribute names.

### 4. Fuse.js scoring

Fuse.js performs fuzzy text matching. In this upgrade, it does not replace our
rules; it supports them.

The shared matcher still uses explicit field dictionaries and signal weights.
For example, an `autocomplete="email"` token is stronger than nearby paragraph
text, because autocomplete is a browser-standard hint from the page author.

The signal priority is:

```txt
autocomplete > labelText > ariaLabel > name > id > placeholder > nearbyText > parentSectionText > type
```

The matcher also tracks negative phrases. For example, if a candidate is `email`
but the signal says `phone`, that becomes a penalty. This is how the system avoids
being overly eager when a field contains mixed contact wording.

### 5. Confidence tiers

Each scored field maps to a tier:

```txt
auto     score >= 88
suggest  score >= 70
confirm  score >= 50
ignore   score < 50
```

The extension does not show `ignore` fields. This keeps the side panel focused on
fields that are plausibly useful.

There is also an ambiguity guard. When the top candidates are too close, the
matcher downgrades confidence. This is valuable because the safest behavior for
ambiguous forms is "ask the user" rather than "fill aggressively."

### 6. Rich DOM extraction

The content script now delegates DOM extraction to:

```txt
apps/extension/lib/autofill/extractDomFields.ts
```

That module collects more than basic attributes. It extracts:

- direct labels and wrapped labels
- `aria-labelledby` text
- placeholders, names, ids, types, and autocomplete tokens
- nearby sibling or helper text
- fieldset legend / section heading context
- select option labels and values
- visibility, disabled, and required state
- a best-effort CSS selector path for memory
- controls inside open shadow roots

There is one important browser limitation: cross-origin iframe scanning is still
not implemented here. Browser extensions need explicit frame configuration and
host access for that, and expanding those permissions should be a deliberate
product/security decision.

### 7. Safe execution

The fill layer moved into:

```txt
apps/extension/lib/autofill/executeAutofill.ts
```

It follows safer defaults:

- It does not overwrite non-empty fields unless `overwriteExisting` is passed.
- It can require fields to be visible.
- It supports a dry-run option for future preview workflows.
- After filling, it dispatches `input`, `change`, and `blur` events.

Dispatching events matters because many React/Vue/Angular forms do not only read
the DOM value. They listen for events to update internal state and validation.

### 8. Domain memory

The extension now has lightweight domain memory in:

```txt
apps/extension/lib/autofill/domainMemory.ts
```

When the user applies a selected fill, the extension stores:

```txt
origin + cssPath -> field kind + accepted count + rejected count + last used time
```

On a future scan of the same domain, memory can slightly boost the matching score
for that same selector and kind. It is intentionally only a boost. It does not
override strong contradictory signals such as a page clearly marking a field as
email while memory says phone.

This is the first step toward learning from user behavior without introducing AI
or hidden magic.

### 9. Tests

Shared package tests now cover:

- normalization
- confidence tiers, including `ignore`
- explainable reasons
- ambiguous/conflicting labels
- domain-memory boosts
- existing payload behavior

Extension tests cover:

- extracting labels, fieldset context, required state, and selector paths
- extracting `aria-labelledby` and select options
- walking open shadow roots
- avoiding overwrite by default
- dispatching fill events after a successful fill

The key commands are:

```bash
pnpm --filter @searchparty/shared test
pnpm --filter search-party-extension test
pnpm --filter search-party-extension compile
```

## How to extend this later

If you want to teach SearchParty about a new fillable field, add it in this
order:

1. Add a real value to the user/profile data model first. For example, do not add
   a `resume` field kind until the app has a resume value or document flow to
   fill from.
2. Add the new kind to `AutofillFieldKind`.
3. Add phrases and negative phrases in `fieldDictionary.ts`.
4. Add payload-building logic so the kind maps to a real string value.
5. Add tests that prove both confident and ambiguous labels behave safely.

If you want to improve confidence, prefer fixture tests over guesswork. Add a
realistic label, inspect the reasons and penalties, and then tune the dictionary
or signal weights with a clear expected behavior.

## What was intentionally deferred

Compromise.js and AI/embedding-based semantic matching were left out. The goal
for this phase was a deterministic engine that is easy to test and explain.

Playwright was kept as a dev dependency for a future full browser automation
harness. Loading and testing an unpacked MV3 extension in CI is a larger task
than a unit test, so this upgrade focuses on fast tests for the matching and DOM
logic that are easiest to maintain right now.
