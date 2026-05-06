# SearchParty Architecture

This document describes the architecture currently implemented in the
SearchParty repository. SearchParty is planned as an AI-assisted job hunt
platform with a web application for managing applicant data and a browser
extension for helping users complete job applications.

The codebase is still early. The current implementation includes a TanStack
Start web app, a WXT browser extension scaffold, Better Auth wiring, Hono and
tRPC API wiring, a minimal shared contracts package, and an initial
Drizzle/PostgreSQL schema.

## Repository Layout

SearchParty is a private `pnpm` monorepo orchestrated by Turbo.

```txt
SearchParty/
  apps/
    web/                 TanStack Start full-stack React app
      src/
        routes/          File-based routes and API route bridges
        server/          Hono API app
        integrations/    TanStack Query, tRPC, and Better Auth helpers
        lib/             Auth client/server helpers and utilities
        db/              Drizzle client and PostgreSQL schema
        db-collections/  TanStack React DB local-only collections
        router.tsx       Router factory and SSR query integration
        styles.css       Tailwind v4 theme and global styles
      drizzle.config.ts
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
    docs/                Architecture and product planning docs
    shared/              Minimal cross-app contracts
    ui/                  Shared CSS theme tokens and global styles
  package.json           Root Turbo scripts
  pnpm-workspace.yaml    Workspace definition for apps/* and packages/*
  turbo.json             Build/dev/test/lint task orchestration
  tsconfig.json          Shared strict TypeScript baseline
```

`packages/shared` is intentionally small in Phase 1. It exports app metadata and
the health-check contract used by the web app and extension. It does not contain
applicant profile, job posting, application, document, autofill, or AI domain
models yet.

## System Overview

```txt
User
  -> Web app: apps/web
       -> TanStack Router pages
       -> /api/health handled by Hono
       -> /api/trpc/* handled by tRPC
       -> /api/auth/* handled by Better Auth
       -> Drizzle client and PostgreSQL schema

  -> Browser extension: apps/extension
       -> Popup React UI
       -> Side panel React UI
       -> Health-check client for apps/web
       -> Content script
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
generated answers, saved jobs, and application history. Its visible UI is a
SearchParty foundation page with a link to the health endpoint.

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
- Drizzle ORM and Drizzle Kit
- PostgreSQL via `pg`
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

The development server runs on port `4310` through:

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
- `/api/health` from `apps/web/src/routes/api/health.ts`
- `/api/trpc/*` from `apps/web/src/routes/api.trpc.$.tsx`
- `/api/auth/*` from `apps/web/src/routes/api/auth/$.ts`

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
- `apps/web/src/routes/api/health.ts`

`api.ts` creates the Hono app and currently exposes `GET /api/health`. The
health response is created and validated through `@searchparty/shared`.
`api/health.ts` bridges TanStack Start's file route handler to `api.fetch()`.

Core tRPC files:

- `apps/web/src/integrations/trpc/init.ts`
- `apps/web/src/integrations/trpc/router.ts`
- `apps/web/src/integrations/trpc/react.ts`
- `apps/web/src/routes/api.trpc.$.tsx`
- `apps/web/src/integrations/tanstack-query/root-provider.tsx`

`init.ts` creates the tRPC factory with SuperJSON serialization. `router.ts`
currently exposes a small `todos` router with `todos.list` and `todos.add`.
These procedures use an in-memory array and do not persist to PostgreSQL yet.

`api.trpc.$.tsx` handles GET and POST requests with `fetchRequestHandler`. The
client uses `httpBatchStreamLink` and targets `/api/trpc`.

`root-provider.tsx` creates a `QueryClient` with SuperJSON hydrate/dehydrate
hooks and creates tRPC options helpers via `createTRPCOptionsProxy`.

Server-side tRPC URL construction uses `SERVER_URL` when set and otherwise
defaults to the shared local web dev URL, `http://localhost:4310`.

## Authentication

Authentication is implemented with Better Auth.

Core files:

- `apps/web/src/lib/auth.ts`
- `apps/web/src/lib/auth-client.ts`
- `apps/web/src/routes/api/auth/$.ts`
- `apps/web/src/integrations/better-auth/header-user.tsx`

Server-side auth:

- `betterAuth` enables email/password authentication.
- `tanstackStartCookies` integrates auth cookies with TanStack Start.
- `/api/auth/*` forwards GET and POST requests to `auth.handler`.

Client-side auth:

- `authClient` is created with `createAuthClient()`.
- `BetterAuthHeader` demonstrates `useSession()` and `signOut()`.

Current caveat: the Better Auth configuration does not declare a database
adapter in the visible source. Auth persistence should be reviewed before the
application relies on real user accounts.

## Data Layer

PostgreSQL and Drizzle are configured in the web app.

Core files:

- `apps/web/src/db/schema.ts`
- `apps/web/src/db/index.ts`
- `apps/web/drizzle.config.ts`

The current Drizzle schema defines one PostgreSQL table:

- `todos`
- `id`: serial primary key
- `title`: required text
- `created_at`: timestamp defaulting to now

`db/index.ts` creates a Drizzle client from the validated `DATABASE_URL`
environment variable.
`drizzle.config.ts` loads `.env.local` and `.env`, writes migrations to
`./drizzle`, and targets PostgreSQL.

Current caveats:

- No generated `apps/web/drizzle/` migration files are present in the current
  repository snapshot.
- The tRPC todos API does not use the Drizzle table yet.

`apps/web/src/db-collections/index.ts` defines a TanStack React DB
`messagesCollection` using `localOnlyCollectionOptions`. This is a browser-side
local collection and is not connected to PostgreSQL.

### Uploaded File Storage Direction (Planned)

For resumes, cover letters, and generated documents, prefer object storage
instead of storing binary file blobs in PostgreSQL. Keep file metadata in the
database and store the file bytes in an object bucket.

Recommended near-term options before AWS S3:

- Cloudflare R2: S3-compatible API, no egress fees, generous free tier for
  early usage.
- Supabase Storage: simple developer UX when already using Supabase services;
  good free tier for MVPs.
- Backblaze B2: low-cost object storage with predictable pricing and
  S3-compatible access.

Suggested metadata model in PostgreSQL:

- `documents` table with `id`, `user_id`, `kind`, `storage_provider`,
  `storage_key`, `mime_type`, `size_bytes`, `checksum`, and timestamps.
- Access control enforced in application/API logic; never expose bucket-wide
  public access for private user documents.

Migration-friendly approach:

- Use an internal storage adapter (`putObject`, `getSignedUploadUrl`,
  `getSignedDownloadUrl`, `deleteObject`) so provider changes do not affect
  route handlers.
- Keep object keys provider-agnostic (for example:
  `users/{userId}/documents/{documentId}/{filename}`) to simplify future moves
  between R2, B2, Supabase Storage, and S3.

## Browser Extension

`apps/extension` is the browser extension application. Product plans describe
it as the assistant that detects job application fields, helps autofill data,
and supports user-controlled job application workflows.

The current code is a WXT + React foundation shell.

Core stack:

- WXT
- React 19
- `@wxt-dev/module-react`
- TanStack Router for in-extension `/login` and `/dashboard` routes
- Tailwind CSS v4 (via PostCSS in extension)
- shadcn/ui CLI and component patterns
- TypeScript

Entrypoints:

- `apps/extension/entrypoints/background.ts` enables opening the side panel from
  the extension action when the browser supports the Side Panel API.
- `apps/extension/entrypoints/content.ts` currently matches the local web app
  only and logs a foundation message.
- `apps/extension/entrypoints/popup/main.tsx` mounts the React popup.
- `apps/extension/entrypoints/sidepanel/main.tsx` mounts the React side panel.
- `apps/extension/components/SearchPartyPanel.tsx` hosts the shared extension
  router for popup and side panel surfaces.
- `apps/extension/components/AppRouter.tsx` defines memory-backed TanStack
  Router routes for `/login` and `/dashboard`.
- `apps/extension/components/screens/LoginPage.tsx` renders the logo-backed
  login screen.
- `apps/extension/components/screens/DashboardPage.tsx` renders the current
  authenticated foundation dashboard with web API health status.
- `apps/extension/components/ui/*` stores shadcn/ui primitives generated for the
  extension app (starting with `button.tsx`).
- `apps/extension/lib/searchparty-api.ts` calls the web app health endpoint and
  validates the response with `@searchparty/shared`.
- `apps/extension/lib/utils.ts` exposes the shared `cn()` helper used by
  shadcn/ui components.
- `apps/extension/components.json` is the shadcn/ui config for extension-local
  generation and alias resolution.
- `apps/extension/postcss.config.mjs` enables Tailwind CSS v4 processing for
  extension stylesheets.

`apps/extension/wxt.config.ts` enables the React module, declares MV3 side panel
metadata, requests `sidePanel` and `storage`, and grants host access only to the
local web app URL used during Phase 1 development. Generated WXT files live
under `apps/extension/.wxt/` and should not be edited manually.

`apps/extension/entrypoints/popup/style.css` now imports Tailwind and
`shadcn/tailwind.css` before the shared UI theme so utility classes and shadcn
design tokens are available in both popup and side panel surfaces.

Current caveat: the extension is not yet integrated with web app auth, tRPC,
user profiles, or database-backed data. Login currently validates non-empty
credentials client-side and routes to `/dashboard`; its implemented
communication path is still only a health check against `/api/health`.

## Environment Configuration

`apps/web/src/env.ts` uses `@t3-oss/env-core`.

Declared variables:

- Server: `SERVER_URL`, optional URL
- Server: `DATABASE_URL`, optional URL
- Client: `VITE_APP_TITLE`, optional non-empty string

## External Integrations

Implemented or configured integrations:

- Better Auth for authentication
- Hono for backend HTTP routing inside the web app
- PostgreSQL through `pg` and Drizzle
- Google Fonts in `styles.css`

Dependencies present but not yet wired into visible product flows:

- TanStack AI provider packages for Anthropic, Gemini, Ollama, and OpenAI
- Sentry is not installed, but `vite.config.ts` marks `@sentry/*` as external
  in Nitro's Rollup config

## Shared Package

`packages/shared` contains foundation-only contracts used across apps.

Current exports:

- `SEARCHPARTY_APP`: shared app metadata and the local web development URL.
- `healthResponseSchema`: Zod schema for the web health response.
- `HealthResponse`: inferred TypeScript type for the health response.
- `createHealthResponse()`: helper used by the Hono health endpoint.

The package intentionally does not define applicant profiles, job postings,
applications, documents, autofill models, or AI contracts yet.

## Shared UI Theme

`packages/ui/src/styles/theme.css` contains the shared CSS theme used by:

- `apps/web/src/styles.css`
- `apps/extension/entrypoints/popup/style.css` (and sidepanel via popup style import)

This keeps extension and web visual language aligned while still allowing each
app to define small surface-specific layout rules.

## Development And Testing

Common root commands:

```sh
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format
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

### Dev Orchestration Check (2026-05-06)

Quick review of root `pnpm dev` behavior and local port wiring:

- Root `pnpm dev` runs `turbo dev`, which starts every workspace package with a
  `dev` script (`apps/web` and `apps/extension` in the current repo).
- `apps/web/package.json` hard-codes Vite to `--port 4310 --strictPort`.
- The extension and shared package also hard-code the same web URL:
  - `apps/extension/wxt.config.ts` host permissions: `http://localhost:4310/*`
  - `apps/extension/entrypoints/content.ts` matches: `http://localhost:4310/*`
  - `packages/shared/src/index.ts` `SEARCHPARTY_APP.webDevUrl`:
    `http://localhost:4310`
- `strictPort` is enabled for web dev, so startup fails fast when `4310` is in
  use instead of silently switching to a different port.

Primary risk:

- Port collisions can still block startup, but host targeting no longer drifts
  between web and extension during local development.

Recommended fix before Phase 2+ work:

1. Enforce a stable web port in development (`strictPort`) so startup fails
   fast instead of silently switching ports.
2. Keep one source of truth for local web URL (env-driven or shared constant)
   and consume it in extension host permissions, extension match patterns, and
   API client defaults.
3. Add root convenience scripts to run apps independently when needed (for
   example, `dev:web` and `dev:extension`) while keeping `turbo dev` for full
   stack runs.
4. Add a short troubleshooting note in docs: if `4310` is occupied, free it or
   change the shared configured dev URL across web, extension, and shared.

Testing and quality tools:

- Web app tests use Vitest.
- Web app UI testing dependencies include Testing Library and JSDOM.
- Web app linting uses ESLint with TanStack's ESLint config.
- Extension type checking uses `tsc --noEmit` through the `compile` script.

No CI configuration is present under `.github/` in the current repository
snapshot.

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
- The extension currently grants host access only to `http://localhost:4310/*`.

Security gaps to address before production:

- Configure durable Better Auth persistence explicitly.
- Validate auth secrets through the central env schema.
- Define authorization boundaries for applicant profiles, documents, generated
  answers, and application history.
- Design extension-to-web authentication before the extension reads or writes
  user data.
- Preserve the MVP rule that the extension should not auto-submit applications.

## Known Architectural Gaps

- Shared domain packages for applicant, job, document, and application data do
  not exist yet.
- The web UI is still a foundation landing route.
- The browser extension is connected only to the health endpoint.
- tRPC stores todos in memory while Drizzle defines a PostgreSQL `todos` table.
- Better Auth is configured but not visibly connected to Drizzle/PostgreSQL.
- AI dependencies are installed, but AI generation workflows are not
  implemented.

## Architecture Readiness For Extension UI

Architecture is sufficient to begin a beginner extension UI.

Ready now:

- Monorepo boundaries are clear (`apps/web`, `apps/extension`, `packages/shared`).
- Extension shell exists (popup + side panel + background + content scripts).
- Shared package already provides a cross-app contract pattern.

Do next before/while UI work starts:

- Keep local web URL/port changes synchronized across web, extension, and shared.
- Keep MVP UI focused on read-only/foundation flows until auth persistence and
  profile data models are implemented.
- Build UI primitives for extension side panel first (status, connectivity,
  action sections) to match the documented product phases.

## Product Roadmap Context

The documented MVP direction is a job application assistant with:

- Applicant profiles for different career paths
- Resume and cover letter variants
- Safe autofill assistance in the browser extension
- AI-generated cover letters, resume tailoring, and reusable answers
- Application tracking with saved jobs, notes, generated documents, and answers

MVP non-goals include bulk auto-apply, auto-submission, bypassing ATS
protections, guaranteed ATS scores, and fabricated credentials.

Likely next architecture steps:

- Move shared domain types and validation schemas into workspace packages.
- Persist profiles, applications, documents, and generated answers in
  PostgreSQL.
- Replace demo tRPC procedures with database-backed routers.
- Define an auth/session strategy shared by the web app and extension.
- Add AI service boundaries for generation providers and prompt workflows.
- Add CI for type checking, linting, tests, and builds.

## Project Identification

- Project name: SearchParty
- Repository type: private `pnpm` and Turbo monorepo
- Primary applications: `apps/web` and `apps/extension`
- Documentation location: `packages/docs`
- Last architecture update: 2026-05-03

## Glossary

- ATS: Applicant Tracking System.
- Better Auth: Authentication library used by the web app.
- Drizzle: TypeScript ORM and migration toolkit used for PostgreSQL.
- Hono: HTTP routing framework used for backend API endpoints in the web app.
- Nitro: Server runtime and build layer used by TanStack Start.
- TanStack Start: Full-stack React framework used by the web app.
- tRPC: Type-safe API layer used by the web app.
- WXT: Browser extension framework used by the extension app.
