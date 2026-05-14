# Core Packages

## `/packages/shared`

### Purpose

Shared types, schemas, and utilities used by:

- web
- extension
- backend

### Responsibilities

#### Shared Types

- ApplicantProfile
- JobPosting
- Application
- Document
- FormField

#### Shared Schemas

- Zod validation
- Shared DTOs

## `/packages/db`

### Purpose

Centralized DB logic.

### Responsibilities

- Drizzle schema
- Migrations
- DB client
- Query utilities

## `/packages/ai` (planned)

Not yet a workspace package. TanStack AI-related dependencies are installed in
`apps/web`; product workflows remain to be wired. When introduced, this package
would centralize prompts and provider-facing orchestration.

### Intended responsibilities

- Prompt templates
- AI service wrappers
- Resume generation
- Cover letter generation
- Job analysis

## `/packages/documents` (planned)

Not yet in the repository. Document export and template logic may land here or
coexist with `apps/web` until the boundary is clear.

### Intended responsibilities

- DOCX generation
- PDF generation
- Resume templates
- Cover letter templates

## `/packages/ui` (implemented)

### Purpose

Shared design tokens and global styles consumed by `apps/web` and
`apps/extension` (see `packages/ui/src/styles/theme.css` and
`packages/docs/architecture.md`).

---

# Database Design

## Tables

### `users`

```typescript
id: string;
email: string;
name: string;
createdAt: Date;
updatedAt: Date;
```

### `applicant_profiles`

```typescript
id: string;
userId: string;
name: string;
targetRole;
summary: string;
preferredTone: string;
createdAt: Date;
updatedAt: Date;
```

### `work_experiences`

```typescript
id: string;
profileId: string;
company: string;
title: string;
startDate: Date;
endDate: Date;
description: string;
technologies: string[];
achievements: string[];
```

### `profile_skills`

```typescript
id: string;
profileId: string;
name: string;
category: string;
yearsOfExperience: number;
```

### `projects`

```typescript
id: string;
profileId: string;
name: string;
description: string;
technologies: string[];
url: string;
```

### `documents`

```typescript
id: string;
userId: string;
profileId: string;
type: string;
storageKey: string;
mimeType: string;
createdAt: Date;
```

### `job_postings`

```typescript
id: string;
userId: string;
platform: string;
company: string;
title: string;
location: string;
description: string;
requirements: string;
sourceUrl: string;
createdAt: Date;
```

### `applications`

```typescript
id: string;
userId: string;
profileId: string;
jobPostingId: string;
status: string;
notes: string;
createdAt: Date;
updatedAt: Date;
```

### `custom_answers`

```typescript
id: string;
profileId: string;
questionPattern: string;
answer: string;
category: string;
```

---

# Development Phases

## Phase 1 — Foundation

### Goals

Establish repo structure and app communication.

### Tasks

**Monorepo**

- Bootstrap Turborepo
- Configure shared TS config
- Configure shared ESLint config
- Configure Prettier

**Web App**

- Create TanStack Start app
- Configure Tailwind
- Configure routing
- Configure auth

**Extension**

- Create WXT extension
- Configure MV3
- Configure side panel
- Configure messaging

**Shared Packages**

- Setup package exports
- Setup path aliases
- Setup shared schemas

### Deliverables

### Success Criteria

- Extension can call backend API
- Shared types compile correctly
- Local development works for all apps

### P1 Stabilization Exit Checklist

- Auth happy path works in both popup and sidepanel:
  - Sign up
  - Sign in
  - Session restore after extension reload
  - Sign out
- Fresh database bootstrap works:
  - `user`, `session`, `account`, and `verification` tables exist after migration
  - Auth succeeds immediately after migration
- Failure UX is friendly in extension UI (no backend stack traces surfaced):
  - Missing auth tables
  - Bad web app base URL
  - Invalid extension origin
- Trusted origins are constrained to local web origins plus explicit extension origins
  (no wildcard host permissions and no broad auth origin allowlist)
- Quality gate commands complete before phase handoff

### Source of Truth: Local Auth and Startup Config

Use the repo-root `.env` as the single source of truth, then sync app env files via:

```bash
pnpm write-env
```

Required local auth variables:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (recommended: `http://localhost:3001`)
- `BETTER_AUTH_TRUSTED_EXTENSION_ORIGINS` (comma-separated extension origins)

Web URL/port source of truth:

- `packages/shared/src/index.ts` -> `SEARCHPARTY_APP.webDevUrl` (`http://localhost:3001`)
- `apps/web` dev server runs on port `3001`
- `apps/extension/wxt.config.ts` `host_permissions` should match web dev URL only

### Known-Good P1 Commands

```bash
# 1) Sync env
pnpm write-env

# 2) Run migrations
pnpm --filter web db:migrate

# 3) Start web + extension (in separate terminals)
pnpm --filter web dev
pnpm --filter search-party-extension dev

# 4) Quality gate
pnpm --filter web lint
pnpm --filter web test
pnpm --filter search-party-extension compile
pnpm --filter search-party-extension build
```

### Smoke Test Script (Manual)

1. Open extension popup and sidepanel.
2. Sign up with a new account from popup.
3. Reload extension and verify session restores to dashboard.
4. Sign out and verify redirect to `/login`.
5. Repeat login/logout flow in sidepanel.
6. Temporarily break DB tables or point to an unmigrated DB and verify auth returns
   a clear `AUTH_SCHEMA_NOT_READY` message in UI.
7. Set an invalid web base URL in extension storage and verify UI shows a clear
   connectivity error (no stack traces).
8. Remove extension origin from `BETTER_AUTH_TRUSTED_EXTENSION_ORIGINS` and verify
   UI shows a clear trusted-origin auth error.

## Phase 2 — Applicant Profiles

### Goals

Users can manage reusable job profiles.

### Roadmap

1. Shared contracts: define profile, work history, skill, project, active-profile,
   and API response schemas in `@searchparty/shared`.
2. Persistence: add Drizzle tables for applicant profiles, nested profile data,
   and per-user active profile settings.
3. Web API: expose authenticated CRUD endpoints under `/api/profiles` using
   Better Auth session cookies.
4. Extension UI: replace the foundation-only dashboard with profile creation,
   editing, deletion, and active-profile selection.
5. Verification: run shared, database, web, and extension type checks plus the
   extension compile/build gates.

### Tasks

**Profile CRUD**

- Create profile — implemented via `POST /api/profiles/` and extension form
- Edit profile — implemented via `PATCH /api/profiles/$profileId`
- Delete profile — implemented via `DELETE /api/profiles/$profileId`
- Select active profile — implemented via `PUT /api/profiles/active`

**Work History**

- Add/edit work experience — extension profile editor
- Add achievements — comma-separated achievement input per experience
- Add tech stacks — comma-separated technology input per experience

**Skills**

- Add/remove skills — extension profile editor
- Categorize skills — skill category field

**Projects**

- Add portfolio projects — extension profile editor
- Add project links — project URL field

### Deliverables

- Shared Zod schemas and TypeScript types for applicant profile workflows.
- Drizzle tables and migration for profiles, work history, skills, projects, and
  active profile selection.
- Authenticated TanStack Start API routes under `/api/profiles`.
- Extension dashboard profile manager with quick-start templates for Frontend,
  Full Stack, and Shopify/Webflow profiles.

### Success Criteria

User can create:

- Frontend profile
- Full Stack profile
- Shopify/Webflow profile

### Known-Good P2 Commands

```bash
# 1) Sync env
pnpm write-env

# 2) Run profile migration
pnpm --filter web db:migrate

# 3) Quality gate
pnpm --filter @searchparty/shared lint
pnpm --filter @searchparty/db lint
pnpm --filter web lint
pnpm --filter web test
pnpm --filter search-party-extension compile
pnpm --filter search-party-extension build
```

## Phase 3 — Extension Autofill MVP

### Goals

Reduce repetitive typing while moving toward the **form intelligence** stack
described in `plans/architecture-plan.md` and `plans/stack-upgrade.md`: Fuse.js
semantic matching, explainable scores, ambiguity handling, and safe execution (see
`packages/docs/architecture.md` for what is implemented today).

### Tasks

**Field Detection**

Detect:

- first name
- last name
- email
- phone
- address
- LinkedIn
- portfolio
- GitHub

**Matching Logic**

Use:

- input name
- labels
- placeholders
- aria labels
- autocomplete attributes

Weighted fuzzy matching is implemented in `@searchparty/shared` using **Fuse.js**
(`packages/shared/src/autofill/`). Extension-side extraction and apply paths live
under `apps/extension/lib/autofill/` and `apps/extension/entrypoints/autofill.content.ts`.

**Confidence System** (implemented thresholds in `@searchparty/shared`)

Numeric scores map to tiers via `confidenceScoreToTier` / ambiguity downgrade:

- **auto**: score ≥ 88
- **suggest**: score ≥ 70
- **confirm**: score ≥ 50
- **ignore**: scores below 50

(Earlier roadmap copy used round percentages like “90%+”; the shipped thresholds
above are authoritative.)

**Autofill UI**

- Preview fills
- Allow approval
- Apply values safely

### Deliverables

### Success Criteria

User can autofill common job fields.

**Testing:** Vitest covers shared scoring behavior; **Playwright** is listed under
`apps/extension` devDependencies for future browser-level fixtures—not used in the
shipped extension runtime.

## Phase 4 — Job Extraction

### Goals

Extract structured job posting data.

### Supported Platforms (Initial)

- Greenhouse
- Lever
- Ashby
- Generic fallback

### Tasks

**Detect**

- Job title
- Company
- Description
- Requirements
- Location

**Save Job**

- Save extracted job to DB
- Link to applications

### Deliverables

### Success Criteria

User can save job postings from supported ATS pages.

## Phase 5 — Cover Letter Generation

### Goals

Generate high-quality tailored cover letters.

### Tasks

**AI Prompting**

Use:

- Applicant profile
- Job description
- Company name
- Role title

**Constraints — AI MUST NOT**

- Invent credentials
- Invent employers
- Invent technologies
- Invent education

**Output Modes**

- Professional
- Confident
- Friendly

### Deliverables

### Success Criteria

User can generate + edit + copy cover letters.

## Phase 6 — Document Management

### Goals

Centralize resumes and generated docs.

### Tasks

**Uploads**

- Resume upload
- Portfolio upload
- Cover letter upload

**Generated Docs**

- Save generated docs
- Attach docs to applications

**Export**

- DOCX export
- PDF export

### Deliverables

### Success Criteria

User can manage application documents.

## Phase 7 — Application Tracker

### Goals

Turn Search Party into a job hunt operating system.

### Statuses

- Saved
- Started
- Applied
- Interviewing
- Offer
- Rejected
- Archived

### Tasks

**Application Tracking**

- Save applications
- Update statuses
- Add notes
- Add follow-up reminders

### Deliverables

### Success Criteria

User can manage their entire job hunt workflow.

## Phase 8 — Resume Tailoring

### Goals

Generate ATS-friendly resume variants.

### Tasks

**Resume Parsing**

- Extract structured data
- Normalize experience
- Extract skills

**Resume Generation**

- Tailor summaries
- Reorder skills
- Rewrite bullets
- Highlight relevant projects

**ATS Optimization**

- Match keywords naturally
- Improve readability
- Improve relevance

**Constraints — AI MUST NOT**

- Fabricate experience
- Inflate years of experience
- Invent projects

### Deliverables

### Success Criteria

User can generate role-specific resume versions.

---

# Future Features

## V2

### Advanced ATS Support

- Workday
- BambooHR
- SmartRecruiters
- iCIMS

### AI Enhancements

- Interview prep
- Recruiter response drafting
- Salary negotiation drafting
- Follow-up emails

### Learning System

- Learn user corrections
- Improve autofill confidence

## V3

### SaaS Expansion

- Subscription billing
- Team accounts
- Career coach access
- Analytics dashboard

---

# Security & Privacy

## Core Rules

### User Data

User data is sensitive.

Search Party MUST:

- Encrypt sensitive data
- Use secure auth
- Minimize extension permissions
- Never sell user data

### AI Usage

- AI outputs must remain truthful
- AI must not fabricate credentials
- User must review generated content

### Extension Permissions

Only request permissions required for:

- Active tabs
- Supported job platforms
- Storage
- Scripting

**Avoid:** `<all_urls>` unless absolutely necessary.

---

# Engineering Standards

## Code Quality

### Requirements

- Type-safe APIs
- Shared schemas
- Strict TypeScript
- Zod validation
- Centralized error handling

## Testing

### Required

- Unit tests for AI formatting
- Integration tests for APIs
- Autofill logic testing
- ATS adapter testing

## Performance Goals

### Extension

- Fast injection
- Minimal DOM blocking
- Low memory usage

### Backend

- Streaming AI responses
- Efficient DB queries
- Caching where appropriate

## Initial MVP Success Metrics

Search Party MVP is successful if a user can:

- Create a reusable profile
- Open a Greenhouse/Lever job post
- Autofill fields
- Generate a tailored cover letter
- Save the application
- Track application progress

All within a few minutes.

## Final Product Vision

Search Party should eventually become **the operating system for modern job hunting**.

Not just:

- a resume tool
- an AI writer
- or an autofill extension

But a complete workflow assistant that helps users **organize**, **optimize**, **apply**, and **track** their entire career search process.
