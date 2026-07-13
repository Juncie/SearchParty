# SearchParty Architecture

This document describes the architecture currently implemented in the
SearchParty repository. SearchParty is planned as an AI-assisted job hunt
platform with a web application for managing applicant data and a browser
extension for helping users complete job applications.

The codebase is still early. The current implementation includes a TanStack
Start web app, a WXT browser extension scaffold, Better Auth wiring, Hono and
tRPC API wiring, shared applicant profile contracts, and a Drizzle/PostgreSQL
schema for auth plus applicant profiles.

**Important Note**
“AI fills in gaps” needs an important constraint: it must never invent personal facts."

**Table of contents**

- [Repository layout](#repository-layout)
- [System overview](#system-overview)
- [Root tooling](#root-tooling)
- [Web application](#web-application)
- [Web build and runtime](#web-build-and-runtime)
- [Web routing](#web-routing)
- [Web shell and styling](#web-shell-and-styling)
- [API layer](#api-layer)
- [Authentication](#authentication)
- [Data layer](#data-layer)
  - [Uploaded file storage (R2)](#uploaded-file-storage-r2)
- [Browser extension](#browser-extension)
- [Environment configuration](#environment-configuration)
- [External integrations](#external-integrations)
- [Shared package](#shared-package)
  - [Form intelligence direction (implemented vs roadmap)](#form-intelligence-direction-implemented-vs-roadmap)
- [Shared UI theme](#shared-ui-theme)
- [Development and testing](#development-and-testing)
  - [Dev orchestration and local port](#dev-orchestration-and-local-port)
- [Generated files and outputs](#generated-files-and-outputs)
- [Security considerations](#security-considerations)
- [Known architectural gaps](#known-architectural-gaps)
- [Architecture readiness for extension UI](#architecture-readiness-for-extension-ui)
- [Product roadmap context](#product-roadmap-context)
- [Project identification](#project-identification)
- [Glossary](#glossary)

## Repository Layout

SearchParty is a private `pnpm` monorepo orchestrated by Turbo.

```txt
SearchParty/
  apps/
    web/                 TanStack Start full-stack React app
      src/
        routes/          File-based routes and API route bridges (incl. `/profile/new`)
        components/      App UI primitives + feature islands such as onboarding wizard
        server/          Hono API app
        integrations/    TanStack Query, tRPC, and Better Auth helpers
        lib/             Auth client/server helpers and utilities
        db/              Web DB entry (imports `@searchparty/db` client factory)
        db-collections/  TanStack React DB local-only collections
        router.tsx       Router factory and SSR query integration
        styles.css       Tailwind v4 theme and global styles
      vite.config.ts
      package.json
    extension/           WXT browser extension
      entrypoints/
        background.ts
        content.ts
        popup/           React popup UI
        sidepanel/       React side panel UI
      components/        Shared extension React components
      lib/               Extension API client helpers
      wxt.config.ts
      package.json
  packages/
    data/                Workspace package `@searchparty/data` — onboarding catalog + Markdown references
    db/                  Drizzle schema, `createDb`, migrations (server-side only)
    docs/                Architecture and product planning docs
    shared/              Minimal cross-app contracts
    ui/                  Shared CSS theme tokens and global styles
    utils/               Workspace package `@searchparty/utils` — small shared helpers (e.g. phone input masking)
  package.json           Root Turbo scripts
  pnpm-workspace.yaml    Workspace definition for apps/* and packages/*
  turbo.json             Build/dev/test/lint task orchestration
  tsconfig.json          Shared strict TypeScript baseline
```

`packages/shared` exports app metadata, the health-check contract, shared
applicant profile schemas/types, and the deterministic autofill engine. Autofill
lives under `packages/shared/src/autofill/`: **Fuse.js** backs fuzzy semantic
matching from normalized DOM signals; modules cover normalization, field
dictionary records, scoring, explainable candidates, confidence tiers, payload
building from the signed-in user + active profile, content-script message type
constants, and `ScannedAutofillFieldPayload`. Payload building reads confirmed
`onboardingAnswers` for salary and education and formats structured
`workExperiences` for work history — it never invents personal facts or treats
`yearsExperience` as employment history. The extension performs DOM extraction
and interaction execution (`apps/extension/lib/autofill/`); runtime autofill uses
normal DOM APIs, not Playwright (see **Form intelligence direction** below). Job
posting, application, document, and AI domain models beyond autofill are still
planned or partial.

**Planning sources** (product/engineering goals for the form engine, not a
promise that every phase is shipped):

- `plans/architecture-plan.md` — “advanced form interaction” vision: treat forms
  as interactive workflows, layered engine (extraction → classification →
  matching → confidence → execution → verification → domain memory), eventual
  combobox depth and Playwright-backed **test** harnesses.
- `plans/stack-upgrade.md` — concrete scope for Fuse.js-first matching,
  weighted signals, ambiguity handling, domain memory, and testing expectations.

`packages/data` is a workspace package (`@searchparty/data`) that publishes the
typed onboarding catalog `profile-questions.ts` (grouped question flow for the web
wizard). It also retains Markdown references such as `interview-questions.md` for
observed job-search workflows. Markdown files are reference material; questionnaire
data is imported at runtime by `apps/web`.

`packages/utils` is a workspace package (`@searchparty/utils`) for small,
dependency-free helpers such as phone input masking; the web app and extension
import it anywhere a phone number is edited (wizard `tel` questions, account
setup, profile overrides, and autofill test fixtures).

## System Overview

```txt
User
  -> Web app: apps/web
       -> TanStack Router pages (including `/profile/new` applicant onboarding wizard)
       -> /api/health handled by Hono
       -> /api/trpc/* handled by tRPC
       -> /api/auth/* handled by Better Auth
       -> /api/profiles/* handled by authenticated TanStack Start routes
       -> /api/account and nested `/api/account/onboarding` for account setup + eligibility JSONB snapshots
       -> `/api/resumes` and `/api/resumes/:resumeId` for authenticated resume metadata + R2 presigned upload/download
       -> `@searchparty/db` Drizzle client (via `apps/web/src/db`)

  -> Browser extension: apps/extension
       -> Popup React UI
       -> Side panel React UI
       -> Better Auth client calls to apps/web (`/api/auth/`*)
       -> Applicant profile API calls to apps/web (`/api/profiles/`*)
       -> Health-check client for apps/web
       -> Content scripts (`content.ts` for local web; `autofill.content.ts` for
          http(s) pages: scan + apply via `tabs.sendMessage`)
       -> Background script
```

The intended product architecture is a web platform plus a browser extension.
In the current code, the web app and extension are separate applications in the
same monorepo. The extension can call the web app's `/api/health` endpoint to
verify local backend connectivity.

## Root Tooling

- `pnpm@10.33.1` is declared as the root package manager.
- `pnpm-workspace.yaml` includes `apps/*` and `packages/*`.
- Root scripts delegate to Turbo: `dev`, `build`, `test`, and `lint`.
- `turbo.json` caches build outputs such as `dist/**`, `dist-ssr/**`,
  `.output/**`, and `.nitro/**`.
- The root `tsconfig.json` uses strict TypeScript, ES2022, React JSX, bundler
  module resolution, and `noEmit`.
- Formatting is handled by Prettier, including Tailwind class sorting through
  `prettier-plugin-tailwindcss`.

## Web Application

`apps/web` is the main full-stack web application. Product plans describe it as
the place where users will manage applicant profiles, resumes, cover letters,
generated answers, saved jobs, and application history. The implemented API now
persists applicant profiles for authenticated users; the visible web UI remains
a SearchParty foundation page.

Core stack:

- React 19
- TanStack Start
- TanStack Router
- TanStack Query
- TanStack Router SSR Query integration
- tRPC 11
- Hono
- SuperJSON
- Better Auth
- Drizzle ORM (also listed under `packages/db` for migrations)
- PostgreSQL via `pg` (via `@searchparty/db` at runtime)
- Vite 8
- Nitro
- Tailwind CSS v4
- Vitest and Testing Library
- ESLint with `@tanstack/eslint-config`

The web app also depends on several TanStack AI packages. They are installed in
`apps/web/package.json`, but no production AI workflow is implemented in the
current source tree.

## Web Build And Runtime

`apps/web/vite.config.ts` configures Vite with:

- TanStack devtools
- Nitro through `nitro/vite`
- Tailwind through `@tailwindcss/vite`
- TanStack Start
- React through `@vitejs/plugin-react`

The development server runs on port `3001` through:

```sh
pnpm --filter web dev
```

Build output is expected under TanStack Start and Nitro output directories such
as `.output/` and `.nitro/`.

## Web Routing

TanStack Router uses file-based routes under `apps/web/src/routes`.

Implemented routes:

- `/` from `apps/web/src/routes/index.tsx`
- Root shell from `apps/web/src/routes/__root.tsx`
- `/api/health` from `apps/web/src/routes/api/health/index.ts`
- `/api/todos` from `apps/web/src/routes/api/todos.ts`
- `/api/trpc/*` from `apps/web/src/routes/api.trpc.$.tsx`
- `/api/auth/*` from `apps/web/src/routes/api/auth/$.ts`
- `/api/profiles` from `apps/web/src/routes/api/profiles/index.ts`
- `/api/profiles/active` from `apps/web/src/routes/api/profiles/active.ts`
- `/api/profiles/$profileId` from
  `apps/web/src/routes/api/profiles/$profileId.ts`
- `/api/account` from `apps/web/src/routes/api/account.ts`
- `/api/resumes` from `apps/web/src/routes/api/resumes/index.ts`
- `/api/resumes/:resumeId` from `apps/web/src/routes/api/resumes/$resumeId.ts`
- `/api/user/me` from `apps/web/src/routes/api/user/me.ts`

`apps/web/src/routeTree.gen.ts` is generated by TanStack Router and should not
be edited manually.

`apps/web/src/router.tsx` creates the router, injects the generated route tree,
provides route context containing the TanStack Query client and tRPC helpers,
enables scroll restoration, and registers SSR query integration.

## Web Shell And Styling

`apps/web/src/routes/__root.tsx` owns the HTML shell. It sets viewport metadata,
imports global CSS, mounts TanStack devtools, and renders the scripts required
by TanStack Start. The document title is `SearchParty`.

`apps/web/src/styles.css` imports Tailwind v4 and related plugins, then imports
the shared theme stylesheet from `packages/ui/src/styles/theme.css`.

`packages/ui/src/styles/theme.css` is now the shared source for SearchParty's
design tokens and global visual primitives (light/dark variables, backgrounds,
card surfaces, typography accents, transitions, and utility presentation
classes). Both the web app and extension consume this file.

The web app supports these source aliases:

- `#/*` to `./src/*`
- `@/*` to `./src/*`

Prefer `#/*` in web code because it is already used throughout the current
source files.

## API Layer

The API surface is hosted inside the TanStack Start web app rather than in a
separate backend service. Hono is the backend HTTP app for foundation endpoints
and can grow into additional API routes without creating a separate server.

Core Hono files:

- `apps/web/src/server/api.ts`
- `apps/web/src/server/todos-store.ts` (in-memory todos shared by REST + tRPC)
- `apps/web/src/routes/api/health/index.ts`
- `apps/web/src/routes/api/todos.ts`

`api.ts` creates the Hono app and currently exposes `GET /api/health` and
`GET /api/todos`. The health response is created and validated through
`@searchparty/shared`. `api/health/index.ts` and `api/todos.ts` bridge TanStack
Start's file route handlers to `api.fetch()`.

Core tRPC files:

- `apps/web/src/integrations/trpc/init.ts`
- `apps/web/src/integrations/trpc/router.ts`
- `apps/web/src/integrations/trpc/react.ts`
- `apps/web/src/routes/api.trpc.$.tsx`
- `apps/web/src/integrations/tanstack-query/root-provider.tsx`

`init.ts` creates the tRPC factory with SuperJSON serialization. `router.ts`
currently exposes a small `todos` router with `todos.list` and `todos.add`.
Those procedures read and write the same in-memory list as `GET /api/todos`
via `todos-store.ts`; nothing persists to PostgreSQL yet.

`api.trpc.$.tsx` handles GET and POST requests with `fetchRequestHandler`. The
client uses `httpBatchStreamLink` and targets `/api/trpc`.

`root-provider.tsx` creates a `QueryClient` with SuperJSON hydrate/dehydrate
hooks and creates tRPC options helpers via `createTRPCOptionsProxy`.

Server-side tRPC URL construction uses `SERVER_URL` when set and otherwise
defaults to the shared local web dev URL, `http://localhost:3001`.

## Authentication

Authentication is implemented with Better Auth.

Core files:

- `apps/web/src/lib/auth.ts`
- `apps/web/src/lib/auth-client.ts`
- `apps/web/src/routes/api/auth/$.ts`
- `apps/web/src/integrations/better-auth/header-user.tsx`

Server-side auth:

- `betterAuth` enables email/password authentication.
- `drizzleAdapter` persists auth users/sessions in PostgreSQL via
  `apps/web/src/db/index.ts`.
- `ensureAuthTablesReady()` checks for required Better Auth tables (`user`,
  `session`, `account`, `verification`) before serving auth requests.
- `tanstackStartCookies` integrates auth cookies with TanStack Start.
- `/api/auth/*` validates auth schema readiness and then forwards requests to
  `auth.handler`.
- Trusted origins are sourced from local web origins plus
  `BETTER_AUTH_TRUSTED_EXTENSION_ORIGINS` (comma-separated extension origins).

Client-side auth:

- `authClient` is created with `createAuthClient()`.
- `BetterAuthHeader` demonstrates `useSession()` and `signOut()`.

Current caveat: production-grade hardening is still pending (email verification
flow, password reset delivery, and auth rate limiting).

## Data Layer

PostgreSQL and Drizzle live in the `**@searchparty/db**` workspace package.
Only server-side code (for example `apps/web` API routes and server functions)
should import `@searchparty/db`. The browser extension does **not** depend on
`@searchparty/db`; it continues to talk to the web app over HTTP.

Core files:

- `packages/db/src/schema.ts` — Drizzle PostgreSQL table definitions
- `packages/db/src/client.ts` — `createDb(databaseUrl)` factory using
  `drizzle-orm/node-postgres`
- `packages/db/src/index.ts` — package exports (`createDb`, schema symbols)
- `packages/db/drizzle.config.ts` — Drizzle Kit config; loads repo-root
  `.env.local` / `.env`, writes migrations to `packages/db/drizzle`
- `apps/web/src/db/index.ts` — constructs `db` with `createDb(env.DATABASE_URL)`

The current Drizzle schema defines PostgreSQL tables:

- `**todos`: `id` (serial PK), `title` (text), `created_at` (timestamp, default now)
- `**user`\*\*: Better Auth user record (`id`, `name`, `email`, `email_verified`,
  `image`, created and updated timestamps)
- `**session**`: Better Auth session record (`token`, `expires_at`, `user_id`,
  metadata fields, timestamps)
- `**account**`: Better Auth account/provider record, including password hash for
  email/password auth and optional token fields
- `**verification**`: Better Auth verification records for one-time values and
  expiry windows
- `**applicant_profiles**`: user-owned reusable applicant profiles with contact
  metadata (`first_name`, `last_name`, `phone`, address, outbound links), tone,
  summaries, timestamps, plus `onboarding_answers` (`jsonb`, default `{}`) that
  stores structured onboarding wizard answers for tooling/AI follow-up beyond the
  normalized columns embedded in applicant profile payloads
- `**work_experiences**`: profile-owned work history entries with descriptions,
  achievements, and technology stacks
- `**profile_skills**`: profile-owned skills with category and years of
  experience
- `**profile_projects**`: profile-owned portfolio projects with descriptions,
  technology stacks, and links
- `**user_profile_settings**`: per-user active applicant profile pointer plus
  global account setup fields (name, phone, structured mailing address, custom URLs)
  consumed by `/api/account`, augmented with `account_onboarding_answers` (`jsonb`,
  default `{}`) and nullable `account_onboarding_completed_at` to capture one-time
  eligibility onboarding that `/profile/new` runs before skipping to profile-only prompts
- `**resumes**`: user-owned uploaded documents (`kind`, `storage_provider`, `storage_key`,
  `mime_type`, `size_bytes`, `checksum`, `upload_status` `pending` \| `ready`) backed by
  Cloudflare R2 via presigned S3-compatible URLs; migration `packages/db/drizzle/0007_resumes.sql`

Database CLI scripts are defined on `@searchparty/db` (`db:generate`, `db:migrate`,
`db:push`, and so on). `apps/web` forwards the same script names via
`pnpm --filter @searchparty/db …` so existing `pnpm --filter web db:push` workflows
keep working.

Current caveats:

- The tRPC todos API does not use the Drizzle tables yet.
- Profile APIs currently replace nested work history, skills, and projects during
  profile updates instead of patching individual nested rows.

`apps/web/src/db-collections/index.ts` defines a TanStack React DB
`messagesCollection` using `localOnlyCollectionOptions`. This is a browser-side
local collection and is not connected to PostgreSQL.

### Uploaded file storage (R2)

Resumes (and future cover letters) use **Cloudflare R2** with the S3-compatible
API from server-only code. Metadata lives in PostgreSQL (`resumes`); bytes
never pass through the app except via **presigned PUT** (upload) and
**presigned GET** (download). Access is enforced on every API call using the
signed-in Better Auth session.

Implemented pieces:

- Drizzle table `resumes` (`packages/db/src/schema.ts`, migration `0007_resumes.sql`).
- Server adapter `apps/web/src/server/storage/r2-object-storage.ts` (S3 client,
  presigned URLs, `HeadObject` for finalize, `DeleteObject` on delete).
- HTTP API (cookie session, same pattern as `/api/profiles`):
  - `GET /api/resumes` — list current user’s resume rows.
  - `POST /api/resumes` — create a `pending` row + presigned PUT payload `{ resumeId, uploadUrl, method, headers, expiresInSeconds }`.
  - `PATCH /api/resumes/:resumeId` — body `{ "finalizeUpload": true }`; verifies the object in R2 then sets `upload_status` to `ready` and stores ETag-derived checksum.
  - `GET /api/resumes/:resumeId` — presigned download URL JSON when `upload_status` is `ready`.
  - `DELETE /api/resumes/:resumeId` — remove object from R2 and delete the row.
- Shared Zod contracts: `packages/shared/src/resume-documents.ts` (kinds, MIME allowlist, size cap, API response shapes).
- Shared client orchestration: `packages/shared/src/resume-presigned-upload.ts` (`uploadResumeWithPresignedFlow`) used by the extension and web profile wizards to POST presign, PUT bytes to `uploadUrl` with returned headers, then PATCH finalize.
- Object keys use the bucket prefix `resumes/users/{userId}/{resumeId}/{filename}` so files appear under the top-level `resumes/` path in the R2 console.

Environment (server, `apps/web/src/env.ts`): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY` (or legacy alias `R2_API_TOKEN` for the secret key),
`R2_BUCKET_NAME`. Optional root `wrangler.jsonc` remains useful for Wrangler CLI
and future Workers bindings; it does not replace these env vars for the Node
server path.

Roadmap (not implemented here): generalize the table name to `documents`,
additional kinds, virus scanning, multipart uploads, and alternative providers
(Supabase Storage, B2, S3) behind the same adapter surface.

## Browser Extension

`apps/extension` is the browser extension application. Product plans describe
it as the assistant that detects job application fields, helps autofill data,
and supports user-controlled job application workflows.

The current code is a WXT + React foundation shell.

Core stack:

- WXT
- React 19
- `@wxt-dev/module-react`
- TanStack Router for in-extension login, dashboard, profile, and settings routes
- Tailwind CSS v4 (via PostCSS in extension)
- shadcn/ui CLI and component patterns
- TypeScript

Entrypoints:

- `apps/extension/entrypoints/background.ts` applies the saved toolbar-click
  behavior (`popup` or `sidepanel`) when the browser supports the Side Panel API.
- `apps/extension/entrypoints/content.ts` matches the local web app only
  (foundation log).
- `apps/extension/entrypoints/autofill.content.ts` matches `http://*/*` and
  `https://*/*`, extracts field signals through `apps/extension/lib/autofill`,
  scores inputs with the Fuse-backed `@searchparty/shared` matcher, applies a
  small per-domain memory boost when available, tags controls with
  `data-searchparty-autofill-id`, runs an automatic scan after `DOMContentLoaded`
  (cached for reuse), and responds to panel messages:
  `SEARCHPARTY_AUTOFILL_GET_SCAN` (reuse cache or scan once),
  `SEARCHPARTY_AUTOFILL_SCAN` (force refresh), and `SEARCHPARTY_AUTOFILL_APPLY`.
  Runtime filling uses normal DOM APIs, not Playwright; Playwright remains a
  dev/test dependency for future browser automation harnesses.
- `apps/extension/entrypoints/popup/main.tsx` mounts `SearchPartyPanel` with the
  popup surface.
- `apps/extension/entrypoints/sidepanel/main.tsx` mounts `SearchPartyPanel` with
  the side panel surface.
- `apps/extension/entrypoints/autofill-test-form/` is an unlisted HTML page
  (`autofill-test-form.html` in the build output) with a generic job application
  form for manual autofill testing. Because Chrome does not inject autofill
  content scripts on `chrome-extension://` pages, run
  `pnpm --filter search-party-extension serve:test-form` and open
  `http://localhost:7242/autofill-test-form.html` with the extension loaded.
- `apps/extension/components/SearchPartyPanel.tsx` owns the memory-backed
  TanStack Router for popup and side panel surfaces. It defines `/login`,
  `/dashboard`, `/autofill`, `/profiles/new`, `/profiles/$profileId`, and
  `/settings`.
- `apps/extension/components/navigation/BottomNav.tsx` renders the extension’s
  primary bottom tab bar (`/dashboard`, `/autofill`, `/settings`) on every
  route, fixed to the bottom of the panel viewport and full width, with an
  active-tab highlight when the current path matches a tab; `SearchPartyPanel`
  pads the scroll outlet so content clears the bar.
- `apps/extension/components/AppRouter.tsx` remains as a compatibility wrapper
  for generated WXT auto-import metadata and delegates to `SearchPartyPanel`.
- `apps/extension/components/screens/LoginPage.tsx` renders the logo-backed
  login screen.
- `apps/extension/components/screens/DashboardPage.tsx` renders the personalized
  authenticated dashboard with Quick Apply (default profile, high-confidence
  fields only), minimal profile rows (Apply, overflow menu for default/edit/delete),
  profile creation, settings, and sign out.
- `apps/extension/components/screens/ProfileEditPage.tsx` renders the dedicated
  edit-profile route using `ProfileEditor`, plus an autofill panel (scan, tier
  preview, prominent apply) for an existing profile. The create flow now routes
  to `ProfileSetupPage` instead.
- `apps/extension/components/screens/ProfileSetupPage.tsx` owns `/profiles/new`
  and renders the multi-step onboarding wizard from
  `apps/extension/components/profile-setup/*`. On submit it calls
  `markAccountOnboardingComplete` (only for the user's first profile) followed
  by `createApplicantProfile`, then navigates to the new profile's edit route.
- `apps/extension/components/profile-setup/` ports the wizard primitives
  (`ProfileSetupWizard`, `QuestionField`, `StepHeader`, `WizardProgress`,
  `WizardFooter`) and helpers (`payload-from-answers`, `question-validation`)
  consumed by `ProfileSetupPage`. The catalog comes from
  `@searchparty/data/profile-questions`. The wizard’s optional résumé step
  (`resumeUpload`) runs the same presign → PUT to object storage → finalize flow
  as `/api/resumes` via `uploadResumeFromWizardFile` in
  `apps/extension/lib/searchparty-api.ts` (shared orchestration in
  `packages/shared/src/resume-presigned-upload.ts`).
- `apps/extension/components/screens/SettingsPage.tsx` renders theme, layout,
  display-name, connection, and account-deletion settings.
- `apps/extension/components/profiles/ProfileEditor.tsx` provides the reusable
  profile form for application autofill contact fields, work history, skills,
  and projects.
- `apps/extension/components/screens/AutofillPage.tsx` loads a cached scan on
  open, supports manual refresh, previews mapped values and confidence tiers, and
  applies selected fills.
- `apps/extension/components/ui/*` stores shadcn/ui primitives generated for the
  extension app (starting with `button.tsx`).
- `apps/extension/lib/profile-quick-starts.ts` defines five general
  quick-start profile templates (Full Stack Engineer, Graphic Designer,
  Customer Service Representative, Sales, and Operations Coordinator).
- `apps/extension/lib/extension-preferences.ts` persists extension theme and
  toolbar open behavior in `browser.storage.local`.
- `apps/extension/lib/searchparty-api.ts` calls the web app health endpoint,
  Better Auth endpoints (`sign-up`, `sign-in`, `get-session`, `sign-out`),
  authenticated profile endpoints, and `/api/user/me` over HTTP with cookie
  credentials. It maps common failures (invalid origin, missing auth tables,
  unreachable web app) to user-friendly messages.
- `apps/extension/lib/autofill/extractDomFields.ts` collects labels,
  `aria-labelledby` text, nearby text, form/fieldset context, select and radio
  options, interaction type, visibility/required/disabled/checked state, and a
  best-effort CSS selector path. It scans text inputs, textareas, native
  selects, checkboxes, radios, file inputs, and upload/listbox-style buttons. It
  walks open shadow roots, but cross-origin iframe scanning is still limited by
  the browser extension manifest and frame permissions.
- `apps/extension/lib/autofill/executeAutofill.ts` applies selected values
  safely: it skips non-empty fields unless explicitly told to overwrite, fills
  text/textarea controls through the native value setter, selects native options
  by normalized label/value, can set checkbox state from an explicit boolean
  value, dispatches `input`, `change`, and `blur` events, and returns per-field
  verification results. **Resume `<input type="file">` controls** matched as
  `resume` receive a synthetic `File`: the side panel sends only the short-lived
  presigned GET URL from `/api/resumes/:id` plus a filename over `tabs.sendMessage`;
  the **service worker** `fetch`es the bytes (host_permissions + `RESUME_AUTOFILL_MAX_BYTES`),
  then the content script asks the worker to run `chrome.scripting.executeScript` in the
  page **MAIN** world to assign a `File` via `DataTransfer` and dispatch events (so React /
  ATS page JS can observe the change). If that step is unavailable, it falls back to the
  isolated content-script world. Vitest falls back to content `fetch` when messaging is
  unavailable. A `data:` URL fill remains supported for tests.
  Radios, custom comboboxes, other file kinds, generated cover letters, salary,
  work history, and education remain manual or unsupported where the payload model
  does not supply values.
- `apps/extension/lib/autofill/domainMemory.ts` stores successful user-applied
  matches in `browser.storage.local` by origin and selector. Memory boosts a
  future scan score, but does not override strong contradictory field signals.
- `apps/extension/lib/utils.ts` exposes the shared `cn()` helper used by
  shadcn/ui components.
- `apps/extension/components.json` is the shadcn/ui config for extension-local
  generation and alias resolution.
- `apps/extension/postcss.config.mjs` enables Tailwind CSS v4 processing for
  extension stylesheets.

`apps/extension/wxt.config.ts` enables the React module, declares MV3 side panel
metadata, requests `sidePanel`, `storage`, `tabs`, and `scripting`, and grants host access to
the local web app URL plus `http://*/*` and `https://*/*` so the autofill content
script can run on job application pages. Generated WXT files live under
`apps/extension/.wxt/` and should not be edited manually.

`apps/extension/entrypoints/popup/style.css` now imports Tailwind and
`shadcn/tailwind.css` before the shared UI theme so utility classes and shadcn
design tokens are available in both popup and side panel surfaces. Popup and
side-panel HTML documents tag `<html>` with `extension-popup` or
`extension-sidepanel` so `#root` can avoid viewport-sized minimum heights in the
toolbar popup (reducing unwanted scroll) while keeping full-height behavior in
the side panel. The same stylesheet defines extension layout tokens on `:root`
(for example `--sp-extension-shell-width`, `--sp-auth-cq-*`, `--sp-auth-gap-*`)
and uses them in named [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
(`auth-layout`) plus BEM-style classes (`.auth-layout`, `.auth-layout__*`) for
login typography and spacing—no arbitrary breakpoint literals in TSX. The router
outlet wrapper `.extension-outlet` sets `container-type: inline-size` so
Tailwind `@sm:` / `@lg:` variants on dashboard and settings respond to shell
width; `container-type` is not applied on the same `<main>` as the popup flex
column to avoid width collapse.

Current caveat: extension auth and profile management currently target local
development only and depend on the local web app being reachable from
`host_permissions`. tRPC and application workflow APIs are still not wired into
the extension UI.

## Environment Configuration

The root `package.json` exposes `pnpm write-env`, which runs
`packages/scripts/write-env.ts`. It finds the monorepo root using
`pnpm-workspace.yaml`, reads the root env file (default: `.env`), and copies it
to each direct child of `apps/` (for example `apps/web/.env` and
`apps/extension/.env`). Pass another filename as the first argument to copy a
different root file, or use `--dry-run` to print targets without writing.

`apps/web/src/env.ts` uses `@t3-oss/env-core`.

Declared variables:

- Server: `SERVER_URL`, optional URL
- Server: `DATABASE_URL`, optional URL
- Server (optional): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
  or `R2_API_TOKEN`, `R2_BUCKET_NAME` — required for resume upload/download/delete
  endpoints; when unset, those routes respond with `503` and a configuration message
- Better Auth runtime: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`,
  `BETTER_AUTH_TRUSTED_EXTENSION_ORIGINS`
- Client: `VITE_APP_TITLE`, optional non-empty string

## External Integrations

Implemented or configured integrations:

- Better Auth for authentication
- Hono for backend HTTP routing inside the web app
- PostgreSQL through `@searchparty/db` (`pg` + Drizzle ORM)
- Cloudflare R2 via `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` in
  `apps/web` (resume presigned URLs)
- **Fuse.js** (`fuse.js`) in `@searchparty/shared` for autofill dictionary /
  candidate scoring (not used in the web app bundle directly today).
- Shared Fontsource variable fonts (`DM Sans` and `Outfit`) imported from
  `packages/ui/src/styles/theme.css` and resolved from root dependencies

Dependencies present but not yet wired into visible product flows:

- TanStack AI provider packages for Anthropic, Gemini, Ollama, and OpenAI
- **Playwright** is a **development dependency** of `apps/extension`
  (`playwright` in `apps/extension/package.json`). It is intended for future
  browser automation tests or harnesses (for example validating autofill
  against real pages). It is **not** part of the shipped extension runtime.
- Sentry is not installed, but `vite.config.ts` marks `@sentry/` as external
  in Nitro's Rollup config

## Shared Package

`packages/shared` contains cross-app contracts used by the web app and extension.

Current exports include:

- `SEARCHPARTY_APP`: shared app metadata and the local web development URL.
- Health-check schema/types and `createHealthResponse()`.
- Applicant profile Zod schemas and TypeScript types (including optional contact
  fields used for autofill: first/last name overrides, phone, address, LinkedIn,
  GitHub, portfolio URLs).
- **Autofill** (`packages/shared/src/autofill/`): normalization
  (`normalizeFieldSignals.ts`), dictionary (`fieldDictionary.ts`), scoring
  (`scoreAutofillField.ts`, `getAutofillCandidates.ts`), confidence
  (`confidence.ts`), payloads (`payload.ts`), message constants (`messages.ts`),
  types (`types.ts`). Public API includes `matchDomFieldToAutofill` for legacy
  callers, `matchDomFieldToAutofillDetailed` for explainable candidates,
  `confidenceScoreToTier`, `buildAutofillPayloadValues`, `valueForAutofillKind`,
  scan/apply message type constants, execution option types, and
  `ScannedAutofillFieldPayload`.
- Vitest unit tests under `packages/shared/src/autofill/__tests__/` (for example
  `scoring.test.ts`; `pnpm --filter @searchparty/shared test`).

Job postings, applications, documents, and AI generation contracts are still
planned or minimal beyond autofill.

### Form intelligence direction (implemented vs roadmap)

The codebase already reflects several goals from `plans/architecture-plan.md` and
`plans/stack-upgrade.md`: deterministic scoring, explainable candidates,
weighted fuzzy matching with **Fuse.js**, ambiguity-aware tiers, and domain memory
on the extension side (`apps/extension/lib/autofill/domainMemory.ts`). Larger
items still outlined in those plans—deep custom combobox automation across UI
libraries, iframe-heavy flows, expanded verification, and Playwright-driven
**automated** form fixtures—are roadmap work, not fully realized in production
paths yet.

## Shared UI Theme

`packages/ui/src/styles/theme.css` contains the shared CSS theme used by:

- `apps/web/src/styles.css`
- `apps/extension/entrypoints/popup/style.css` (and sidepanel via popup style import)

This keeps extension and web visual language aligned while still allowing each
app to define small surface-specific layout rules.

The design system documentation (palette, typography, components, motion, and
accessibility rules) lives as an always-applied Cursor rule at
`.cursor/rules/design.mdc`. `theme.css` is the source of truth for tokens; the
rule explains them and codifies how to use them. There is no separate
`packages/docs/design.md` — that file was consolidated into the rule on
2026-05-07 to remove drift between the doc and the implemented theme.

## Development And Testing

Common root commands:

```sh
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format
pnpm write-env
```

Useful app-specific commands:

```sh
pnpm --filter web dev
pnpm --filter web test
pnpm --filter web lint
pnpm --filter web db:generate
pnpm --filter web db:migrate
pnpm --filter web db:push
pnpm --filter search-party-extension dev
pnpm --filter search-party-extension build
```

### Dev orchestration and local port

Quick review of root `pnpm dev` behavior and local port wiring:

- Root `pnpm dev` runs `turbo dev`, which starts every workspace package with a
  `dev` script (`apps/web` and `apps/extension` in the current repo).
- `apps/web/package.json` runs Vite with `--port 3001 --strictPort`.
- The extension and shared package target the same origin:
  - `apps/extension/wxt.config.ts` host permissions:
    `http://localhost:3001/*`
  - `apps/extension/entrypoints/content.ts` matches the local web app URL (same
    host/port as above).
  - `packages/shared/src/index.ts` `SEARCHPARTY_APP.webDevUrl`:
    `http://localhost:3001`
- `strictPort` is enabled for web dev, so startup fails fast when `3001` is in
  use instead of silently switching ports.

Operational notes:

1. Keep `SEARCHPARTY_APP.webDevUrl`, extension `host_permissions`, and the web
   dev port aligned when changing local URLs.
2. Optional: add root scripts such as `dev:web` / `dev:extension` if you want
   one-app dev without full `turbo dev`.
3. If `3001` is occupied, free the port or update the shared dev URL consistently
   across web, extension, and `packages/shared`.

Testing and quality tools:

- Web app tests use Vitest.
- Web app UI testing dependencies include Testing Library and JSDOM.
- Web app linting uses ESLint with TanStack's ESLint config.
- Extension type checking uses `tsc --noEmit` through the `compile` script.

CI lives at `.github/workflows/ci.yml` and runs lint, tests, extension compile,
and shared/db typecheck on pull requests and main-branch pushes.

## Generated Files And Outputs

Do not hand-edit these files or directories:

- `apps/web/src/routeTree.gen.ts`
- `apps/web/.output/`
- `apps/web/.nitro/`
- `apps/extension/.wxt/`
- `apps/extension/.output/`

## Security Considerations

Current implemented security mechanisms:

- Better Auth handles auth routes and session cookies.
- `tanstackStartCookies` integrates auth cookies into TanStack Start.
- Client-exposed environment variables must use the `VITE_` prefix.
- The extension grants host access to the local web app URL and to `http://*/*`
  and `https://*/*` for the autofill content script (review before production
  store submission).

Security gaps to address before production:

- Configure durable Better Auth persistence explicitly.
- Validate auth secrets through the central env schema.
- Continue hardening authorization boundaries for documents, generated answers,
  and application history.
- Formalize extension-to-web authentication for production beyond local Better
  Auth cookie development.
- Preserve the MVP rule that the extension should not auto-submit applications.

## Known Architectural Gaps

- Shared domain contracts now exist for applicant profiles, jobs, applications,
  résumé proposals, and evidence-bound generation drafts.
- The web UI remains thin beyond onboarding and the `/proposals` review queue.
- The browser extension manages applicant profiles, Phase 3 autofill, and job
  save (`/jobs/save`). Application tracker and generation UIs are API-first.
- tRPC stores todos in memory while Drizzle defines a PostgreSQL `todos` table.
- AI provider packages are installed; generation currently uses a deterministic
  evidence-bound draft path until a server-only model adapter is configured.
- Run migration `0008_provenance_jobs_applications.sql` before using the new
  tables in a live database.

## Architecture Readiness For Extension UI

Architecture is sufficient to begin a beginner extension UI.

Ready now:

- Monorepo boundaries are clear (`apps/web`, `apps/extension`, `packages/shared`,
  `packages/db` for server-side persistence).
- Extension shell exists (popup + side panel + background + content scripts).
- Shared package provides cross-app contracts for health checks and applicant
  profiles.

Do next before/while UI work continues:

- Keep local web URL/port changes synchronized across web, extension, and shared.
- Keep profile and autofill-related columns synchronized across
  `packages/shared`, `packages/db` migrations, web `/api/profiles`, and
  extension profile + autofill UIs.
- Tighten extension host permissions toward supported ATS origins when Phase 4
  job extraction lands.

## Product data contract (facts, preferences, narratives)

SearchParty treats applicant data in three categories:

- **Facts** — identity, authorization, employment, education, skills. Only
  user-entered or explicitly approved facts may be used for autofill.
- **Preferences** — salary, target roles, location, availability. User decisions;
  AI may recommend but never silently decide.
- **Narratives** — cover letters and open-ended answers. AI may draft from
  approved evidence; users must review before reuse or autofill.

Autofill keeps **two independent signals**: field confidence (what the page
asks) and answer trust (confirmed vs draft). Only strong field matches with
confirmed answers are eligible for automatic selection. SearchParty fills forms
but never submits applications.

Shared packages cover:

- `packages/shared/src/answers/` — provenance, approval, deterministic resolver
- `packages/shared/src/jobs/` — job posting contracts
- `packages/shared/src/applications/` — tracker statuses and transitions
- `packages/shared/src/generation/` — evidence-bound draft helpers and
  hallucination guards
- `packages/shared/src/resume-extraction.ts` — proposal schemas
- `packages/shared/src/metrics/autofill-metrics.ts` — privacy-safe metrics

PostgreSQL tables (migration `0008_provenance_jobs_applications.sql`) add
`profile_education`, `profile_document_links`, `document_extractions`,
`fact_proposals`, `job_postings`, `applications`, `application_events`,
`generated_documents`, `custom_answers`, and `generation_runs`.

Web APIs:

- `/api/fact-proposals` — list / extract / review résumé proposals
- `/api/jobs` — save and list job postings
- `/api/applications` — track applications (status never inferred from fill alone)
- `/api/generation` — evidence-bound draft generation and approval

The extension exposes `/jobs/save` for extract-and-save. The web app exposes
`/proposals` for reviewing pending résumé facts.

## Product Roadmap Context

The documented MVP direction is a job application assistant with:

- Applicant profiles for different career paths
- Resume and cover letter variants
- Safe autofill assistance in the browser extension, evolving toward the **form
  intelligence** goals in `plans/architecture-plan.md` and
  `plans/stack-upgrade.md` (reliable classification, fuzzy matching, explainable
  confidence, verified interactions—without “magic” auto-behavior)
- AI-generated cover letters, resume tailoring, and reusable answers
- Application tracking with saved jobs, notes, generated documents, and answers

MVP non-goals include bulk auto-apply, auto-submission, bypassing ATS
protections, guaranteed ATS scores, and fabricated credentials. Onboarding no
longer offers auto-submit; SearchParty prepares and fills, and the user always
submits.

Likely next architecture steps:

- Add shared contracts for job postings, applications, documents, generated
  answers, and autofill field mappings.
- Persist applications, documents, and generated answers in PostgreSQL.
- Replace demo tRPC procedures with database-backed routers.
- Define a production auth/session strategy shared by the web app and extension.
- Add AI service boundaries for generation providers and prompt workflows.
- Expand automated testing around autofill (Vitest today; Playwright available for
  future integration or e2e harnesses per extension `package.json`).
- Add CI for type checking, linting, tests, and builds.

## Project Identification

- Project name: SearchParty
- Repository type: private `pnpm` and Turbo monorepo
- Primary applications: `apps/web` and `apps/extension`
- Documentation location: `packages/docs`
- Supplementary execution/product phases: `packages/docs/SearchParty-execution.md`,
  `packages/docs/SearchParty-overview.md`
- Planning (form engine goals / stack upgrade scope): `plans/architecture-plan.md`,
  `plans/stack-upgrade.md`
- Last architecture update: 2026-07-12

## Glossary

- ATS: Applicant Tracking System.
- Better Auth: Authentication library used by the web app.
- Drizzle: TypeScript ORM and migration toolkit used for PostgreSQL.
- Hono: HTTP routing framework used for backend API endpoints in the web app.
- Nitro: Server runtime and build layer used by TanStack Start.
- TanStack Start: Full-stack React framework used by the web app.
- tRPC: Type-safe API layer used by the web app.
- WXT: Browser extension framework used by the extension app.
