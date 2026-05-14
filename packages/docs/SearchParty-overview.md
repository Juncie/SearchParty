# Search Party

## AI-Assisted Job Hunt Platform & Chrome Extension

---

# Overview

Search Party is a Chrome Extension + Web Platform designed to drastically reduce the time and friction involved in applying for jobs.

The platform enables users to create multiple reusable **Applicant Profiles** tailored toward different career paths (Frontend Developer, Full Stack Engineer, Shopify Developer, etc.), then intelligently assist users with:

- Job application autofill
- ATS-optimized resume generation
- Tailored cover letter generation
- Job extraction and analysis
- Application tracking
- Reusable answers for common application questions

The Chrome Extension acts as the user-facing assistant during job applications while the web platform manages profiles, documents, AI generation, and application history.

---

# Core Product Goals

## Primary Goal

Reduce a 20–45 minute job application process into a 3–5 minute workflow while keeping the user in control.

---

# Product Objectives

## MVP Objectives

### Applicant Profiles

Users can:

- Create multiple profiles
- Store work history
- Store education
- Store skills/projects
- Store links and social profiles
- Upload/Store resume variations
- Upload/Store cover letter variations

---

### Autofill Assistance

The extension can:

- Detect application fields
- Match fields against user profile data
- Autofill common fields safely
- Ask for confirmation when confidence is low

---

### AI Assistance

The platform can:

- Generate cover letters
- Tailor resumes
- Generate answers to common application questions

---

### Application Tracking

Users can:

- Save jobs
- Track application status
- Save notes
- Track generated documents
- Save application answers

---

# Non-Goals (MVP)

The MVP WILL NOT:

- Auto-submit applications
- Apply to jobs in bulk
- Circumvent ATS protections
- Fully support all ATS systems
- Promise "guaranteed ATS scores"
- Fabricate user experience/credentials

---

# Tech Stack

Private **pnpm + Turbo** monorepo. Authoritative layout and runtime boundaries are
described in `packages/docs/architecture.md`.

```txt
apps/
  web/           TanStack Start + Vite (full-stack web)
  extension/     WXT MV3 extension (popup, side panel, autofill content scripts)

packages/
  shared/        Cross-app contracts; applicant profiles; autofill engine (Fuse.js)
  db/            Drizzle + PostgreSQL (server-side only)
  ui/            Shared design tokens / `theme.css`
  docs/          Architecture and planning docs (this folder)
  data/          Markdown catalogs (reference material; not a publishable workspace package)
```

**Form intelligence direction:** evolve autofill from simple keyword fills toward a
reliable, explainable **form interaction engine**—see `plans/architecture-plan.md`
and `plans/stack-upgrade.md` for phased goals (classification depth, verification,
optional Playwright-based **test** automation). Runtime extension code uses DOM APIs;
**Fuse.js** powers fuzzy matching in `@searchparty/shared`.

Planned or not yet present as packages: dedicated `packages/ai`,
`packages/documents`, or `packages/utils` trees (some goals appear in
`SearchParty-execution.md` as forward-looking product phases).
