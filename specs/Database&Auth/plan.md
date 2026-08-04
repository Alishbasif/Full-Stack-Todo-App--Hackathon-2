# Implementation Plan: Account Creation and Authenticated Sessions

**Branch**: `003-database-auth` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/Database&Auth/spec.md`

**Note**: The feature directory for this plan is `specs/Database&Auth/`
rather than `specs/003-database-auth/` — the spec folder was named this way
per explicit user request when `/sp.specify` ran (matching the naming
pattern already established by `specs/frontendspecs/` and
`specs/backendspecs/`). The git branch (`003-database-auth`) and
`history/prompts/003-database-auth/` folder are unaffected and keep their
original names.

## Summary

Build the third and final Phase II feature: account creation and
authenticated sessions (spec.md User Stories 1–4), using Better Auth
configured on the already-built Next.js frontend, issuing JWTs that the
already-built Backend feature already independently verifies (it was built
against this exact contract in advance — see `specs/backendspecs/research.md`'s
JWT/shared-secret decisions). This plan adds new code only to `frontend/`
(Better Auth server config, its route handler, sign-up/sign-in pages, a
session-aware API client) and to the shared Neon database's schema (the
`users`/session/account tables Better Auth owns and manages). It makes zero
changes to `backend/`, which already reads `BETTER_AUTH_SECRET` from its own
`.env` and requires no new work — this feature must reuse that exact secret
value, not mint a new one, or the two services would stop agreeing on token
validity.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS (this feature adds
code only inside the existing `frontend/` Next.js 16 App Router project;
`backend/`, already implemented in Python/FastAPI, requires zero changes)
**Primary Dependencies**: `better-auth` (npm) with its email/password
provider and JWT plugin, using its bundled Postgres/Kysely adapter against
the same Neon connection string the backend already uses; no new backend
dependency
**Storage**: Neon Serverless PostgreSQL (same database the Backend feature
already uses for `tasks`) — Better Auth's own schema-generation tooling
creates and owns the `user`, `session`, `account`, and `verification`
tables it needs; this is a deliberate, documented exception to "accessed
exclusively through SQLModel" (see Constitution Check below and
research.md)
**Testing**: Vitest + React Testing Library for sign-up/sign-in form
component tests, Playwright for end-to-end flows — reusing the Frontend
feature's already-installed testing stack, no new tooling introduced
**Target Platform**: Web browser, deployed to Vercel as part of the same
Next.js app the Frontend feature already deploys there
**Project Type**: Web application (monorepo `frontend/` + `backend/`, per
Constitution's Technology Stack table) — this plan extends `frontend/`
only; `backend/` is unchanged
**Performance Goals**: SC-001 — account creation + sign-in completes in
under 1 minute; SC-002 — sign-in completes in under 15 seconds
**Constraints**: FR-010 — passwords are never stored or returned in plain
text (delegated entirely to Better Auth's built-in hashing — this feature
does not implement its own hashing); FR-012 — the JWT verification
mechanism MUST be identical to what `backend/app/core/security.py` already
expects (HS256, `sub` claim = user id, verified against
`BETTER_AUTH_SECRET`); FR-008/SC-006 — credentials expire after 7 days
**Scale/Scope**: Email + password only, one account per email, no social/
OAuth login (spec.md Assumptions); this feature covers account creation,
sign-in, sign-out, and session persistence only — it does not touch
task-level authorization, which the Backend feature already owns and has
already implemented

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design (see below).*

| Principle | Gate | Status |
|---|---|---|
| I. Spec-Driven Development (NON-NEGOTIABLE) | Plan and all downstream code are generated from `specs/Database&Auth/spec.md` via Claude Code; a PHR is recorded for this planning step | PASS |
| II. Frontend: Responsive Next.js App Router UI | New sign-up/sign-in pages and components follow the same Next.js 16 App Router + TypeScript + Tailwind + centralized-API-client conventions already established by the Frontend feature; Client Components used only where interactivity (forms) requires them | PASS |
| III. Backend: FastAPI REST API with Enforced User Isolation | N/A to this plan — zero backend code changes. The Backend feature already implements JWT verification and per-user isolation against exactly the contract this feature must produce (HS256, shared secret, `sub` = user id) | PASS (N/A — no backend changes; contract compatibility verified in research.md) |
| IV. Database & Authentication: Neon PostgreSQL via SQLModel + Better Auth/JWT | Partial, documented exception: Better Auth (a Node/TypeScript library) manages its own `user`/`session`/`account`/`verification` schema via its own migration tooling against the same Neon database — not through SQLModel, since Better Auth has no Python runtime and reimplementing it would contradict "smallest viable diff." SQLModel remains the exclusive access path for this project's own Python-owned data (`tasks`, already governed by this principle via the Backend feature). `BETTER_AUTH_SECRET` is reused verbatim from the value already generated in `backend/.env` — never hardcoded, never regenerated | PASS (documented exception — see research.md; ADR suggested below) |

**Result**: PASS, with one documented Constitution IV exception (schema
ownership split between SQLModel and Better Auth's own tooling — see
Complexity Tracking).

**Post-Design Re-check** (after Phase 1 research/data-model/contracts/quickstart):
No new dependency, entity, or integration point introduced during Phase 1
changes this gate — `research.md`'s decisions (schema ownership, password
hashing, JWT plugin/secret reuse, token expiry, testing stack, UI
placement) all stay inside Better Auth + the frontend's existing stack, and
`contracts/auth-endpoints.md` only documents Better Auth's own
sign-up/sign-in/sign-out/session endpoints plus the one open integration
detail (exact JWT-retrieval mechanism) that implementation must confirm
against the installed Better Auth version. **Result: PASS, unchanged.**

📋 **Architectural decision detected**: splitting schema/migration
ownership between SQLModel (backend's own tables) and Better Auth's own
tooling (its `user`/`session`/`account`/`verification` tables) on the same
Neon database, rather than forcing all schema through one tool. This has
long-term consequences (data model, migration workflow), had viable
alternatives (e.g., hand-defining a SQLModel `User` model and pointing
Better Auth's adapter at it), and is cross-cutting across the Database &
Authentication and Backend features. Document reasoning and tradeoffs? Run
`/sp.adr schema-ownership-split-sqlmodel-better-auth`. (Waiting for your
consent — not created automatically.)

## Project Structure

### Documentation (this feature)

```text
specs/Database&Auth/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-endpoints.md
└── checklists/
    └── requirements.md  # Spec quality checklist (from /sp.specify)
```

### Source Code (repository root)

```text
frontend/
├── lib/
│   ├── auth.ts                     # Better Auth server instance: secret, DB adapter,
│   │                                # email/password provider, JWT plugin, 7-day expiry
│   ├── auth-client.ts               # Better Auth React client (signUp, signIn, signOut,
│   │                                # useSession) — consumed by sign-up/sign-in forms
│   └── api.ts                       # MODIFIED — replace the dev-only getAuthToken()/
│                                     # getCurrentUserId() localStorage stubs with real
│                                     # Better Auth session/JWT values; every existing
│                                     # call site in lib/api.ts stays unchanged (US3, FR-012)
├── app/
│   ├── api/auth/[...all]/route.ts   # Better Auth's catch-all route handler
│   └── (auth)/
│       ├── sign-up/page.tsx         # US1
│       └── sign-in/page.tsx         # US2
├── components/
│   └── auth/
│       ├── SignUpForm.tsx           # US1
│       ├── SignInForm.tsx           # US2
│       └── SignOutButton.tsx        # US4
├── middleware.ts                    # Redirects unauthenticated requests to /sign-in for
│                                     # the (tasks) route group (US3)
└── tests/
    ├── unit/                        # Vitest + RTL: sign-up/sign-in form validation
    └── e2e/                         # Playwright: one spec per user story

# Shared Neon database (no new backend/ files):
# `user`, `session`, `account`, `verification` tables generated and applied
# via Better Auth's own CLI (`npx @better-auth/cli generate`/`migrate`)
# against the same DATABASE_URL the Backend feature already uses — see
# research.md and quickstart.md.

# backend/ — zero changes. Already reads BETTER_AUTH_SECRET from its own
# .env and verifies JWTs against it (specs/backendspecs/, already implemented).
```

**Structure Decision**: Web application monorepo (same as the Frontend and
Backend features' plans). This plan adds files only inside the existing
`frontend/` directory plus a schema addition to the shared Neon database;
it does not create a new top-level directory and does not modify
`backend/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `users`/session schema managed by Better Auth's own tooling, not SQLModel (partial exception to Constitution IV's "accessed exclusively through SQLModel") | Better Auth is a Node/TypeScript library with no Python runtime; it needs to own its full internal schema (including `session`/`account`/`verification` bookkeeping tables that have no equivalent in the constitution's `users`-only description) to function correctly, and the hackathon brief mandates using Better Auth specifically | Hand-defining a SQLModel `User` model and pointing Better Auth's adapter at a pre-existing, externally-authored table was rejected — Better Auth's migration tooling and internal schema evolve together; splitting authorship between two migration systems on the same tables risks silent drift and contradicts "smallest viable diff." Building a custom Python-only auth system instead of Better Auth was rejected outright — Constitution IV mandates Better Auth by name |
