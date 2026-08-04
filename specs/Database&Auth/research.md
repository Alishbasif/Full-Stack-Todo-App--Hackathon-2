# Phase 0 Research: Account Creation and Authenticated Sessions

No `[NEEDS CLARIFICATION]` markers were left in the Technical Context — the
Phase II hackathon specification and this project's constitution already
fix the library (Better Auth), the database (Neon PostgreSQL), and the
token mechanism (JWT, shared-secret HS256). This document records the
rationale for the decisions that were still this feature's to make, and
resolves the one real tension in the constitution's wording (schema
ownership).

## Decision: `users`/session schema ownership — Better Auth's own tooling, not SQLModel

- **Decision**: Let Better Auth generate and manage its own `user`,
  `session`, `account`, and `verification` tables (via `npx @better-auth/cli
  generate`/`migrate`) against the same Neon `DATABASE_URL` the Backend
  feature already uses, configuring its schema to match Constitution IV's
  `users` shape (`id` string PK, `email` unique, `name`, `created_at`).
  SQLModel is not used to define or migrate these tables.
- **Rationale**: Constitution IV says all data is "accessed exclusively
  through SQLModel," but it also says the `users` table is "managed by
  Better Auth" — Better Auth is a Node/TypeScript library with no Python
  runtime, so literally routing its reads/writes through SQLModel would
  mean reimplementing Better Auth from scratch, contradicting both the
  hackathon's explicit mandate to use Better Auth and this project's
  "smallest viable diff" rule. The more coherent reading is that SQLModel
  governs every table this project's own Python code owns and queries
  (i.e., `tasks`, already true via the Backend feature) — since the backend
  never queries the `users` table directly (it only decodes a JWT's `sub`
  claim; see `specs/backendspecs/`), no Python code ever needs to touch
  this table at all, so no SQLModel access path is actually required for it
  to exist.
- **Alternatives considered**: Hand-define a `User` SQLModel model and an
  Alembic migration, then configure Better Auth's database adapter to point
  at that pre-existing table (rejected — Better Auth's internal schema
  includes `session`/`account`/`verification` tables with no constitution-
  specified shape, and letting two separate migration tools both claim
  authorship over the same schema risks silent drift as Better Auth
  versions evolve); building a custom Python email/password auth system
  instead of Better Auth (rejected outright — Constitution IV names Better
  Auth specifically, and this is a hackathon requirement, not a free
  technical choice).

## Decision: Password hashing — delegated entirely to Better Auth's built-in implementation

- **Decision**: Do not write any password-hashing code. Better Auth hashes
  passwords internally (scrypt-based by default) before they ever reach
  storage.
- **Rationale**: FR-010 requires passwords are never stored or returned in
  plain text, using "a secure, industry-standard hashing method." Better
  Auth's default implementation already satisfies this and is maintained by
  people whose job is to get this right — the same "don't reinvent a
  security-critical primitive" principle already applied to JWT
  verification in `specs/backendspecs/research.md`.
- **Alternatives considered**: Implementing bcrypt/argon2 hashing directly
  (rejected — unnecessary; Better Auth already does this, and duplicating
  it would be dead code at best and a security regression at worst if done
  incorrectly).

## Decision: JWT plugin configuration — reuse the backend's existing `BETTER_AUTH_SECRET` verbatim, HS256, 7-day expiry

- **Decision**: Enable Better Auth's JWT plugin with algorithm `HS256` and
  the exact `BETTER_AUTH_SECRET` value already present in `backend/.env`
  (generated during the Backend feature's implementation) — copied into
  `frontend/.env.local`, not regenerated. Session/JWT expiry is configured
  to 7 days.
- **Rationale**: `backend/app/core/security.py` already decodes tokens with
  `jwt.decode(token, settings.better_auth_secret, algorithms=["HS256"])`
  and expects a `sub` claim equal to the user's id (see
  `specs/backendspecs/data-model.md` and its contract). Any mismatch here —
  a different secret, a different algorithm, or a different claim name —
  would make every backend request fail with `401` even though sign-in
  itself appears to succeed. FR-008/SC-006 fix the 7-day expiry, matching
  the hackathon brief's own stated example.
- **Alternatives considered**: Generating a fresh secret for this feature
  (rejected — would silently break every already-implemented and already-
  tested backend endpoint, since the backend has no way to know a new
  secret exists); asymmetric (RS256) signing (rejected — Constitution IV
  describes one shared secret used symmetrically by both services, which is
  HS256 by definition, and the backend is already built expecting HS256).

## Decision: Testing strategy — reuse the Frontend feature's existing Vitest + RTL + Playwright stack

- **Decision**: No new testing framework. Sign-up/sign-in form validation
  is covered by Vitest + React Testing Library component tests; each user
  story gets one Playwright end-to-end spec, following the exact pattern
  `specs/frontendspecs/tasks.md` already established for the task UI.
- **Rationale**: The Frontend feature already installed and configured this
  stack; introducing a second testing tool for the same `frontend/` project
  would violate "smallest viable diff" for no benefit.
- **Alternatives considered**: None seriously considered — this is a
  direct continuation of already-adopted tooling in the same codebase.

## Decision: Sign-up/sign-in UI placement — new `(auth)` route group, mirroring the existing `(tasks)` group

- **Decision**: Add `frontend/app/(auth)/sign-up/page.tsx` and
  `frontend/app/(auth)/sign-in/page.tsx` as a sibling route group to the
  Frontend feature's existing `frontend/app/(tasks)/page.tsx`, and add
  `frontend/middleware.ts` to redirect an unauthenticated request for the
  `(tasks)` group to `/sign-in` (US3).
- **Rationale**: Matches this codebase's established Next.js App Router
  route-group convention exactly (Constitution II: Server Components by
  default, Client Components only where interactivity requires them — the
  forms themselves are Client Components, the page shells are not).
- **Alternatives considered**: A single combined `/auth` page with a mode
  toggle (rejected — two distinct routes match Better Auth's own
  client-method split (`signUp.email` / `signIn.email`) and keep each
  page's Playwright spec independently targetable, consistent with how
  `specs/frontendspecs/tasks.md` scoped one e2e spec per user story).
