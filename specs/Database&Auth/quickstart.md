# Quickstart: Account Creation and Authenticated Sessions

## Prerequisites

- Node.js 20 LTS or later (same as the Frontend feature)
- The same Neon `DATABASE_URL` the Backend feature already uses
- The same `BETTER_AUTH_SECRET` value already generated and sitting in
  `backend/.env` — copy it, do not generate a new one

## Environment variables

Add to `frontend/.env.local` (never commit this file):

```env
BETTER_AUTH_SECRET=<the exact same value from backend/.env>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=<the same Neon connection string backend/.env uses>
```

`BETTER_AUTH_SECRET` MUST be byte-for-byte identical to the backend's value
(Constitution IV) — if it isn't, sign-in will appear to succeed but every
subsequent backend request will fail with `401`.

## Install & generate schema

```bash
cd frontend
npm install better-auth
npx @better-auth/cli generate   # creates Better Auth's user/session/account/verification schema
npx @better-auth/cli migrate    # applies it to DATABASE_URL (the same Neon database)
```

## Run

```bash
cd frontend
npm run dev
```

The app serves at `http://localhost:3000`; sign-up is at `/sign-up`,
sign-in is at `/sign-in`.

## Running tests

```bash
cd frontend
npm run test        # Vitest + React Testing Library (sign-up/sign-in form validation)
npm run test:e2e    # Playwright (one spec per user story in spec.md)
```

## Verifying the golden path manually

1. Go to `/sign-up`, create an account with a new email and a valid
   password → confirm you land signed in (US1).
2. Reload the page → confirm you remain signed in without re-entering
   credentials (US3 Scenario 1).
3. Open the task screen (`/`, from the Frontend feature) and add a task →
   confirm it succeeds, proving the issued credential is accepted by the
   already-built backend (US3 Scenario 2; cross-check against
   `specs/backendspecs/quickstart.md`).
4. Sign out → confirm the task screen now redirects to `/sign-in` and a
   direct call to the task API with the old credential is refused (US4,
   FR-009).
5. Go to `/sign-in`, sign back in with the same account → confirm you see
   the exact same task you created in step 3 (spec.md Edge Cases: identity
   is unchanged across sign-out/sign-in).
6. Attempt to sign up again with the same email from step 1 → confirm it is
   rejected with a clear message and no duplicate account is created (US1
   Scenario 3).
7. Attempt to sign in with the correct email but a wrong password →
   confirm a single generic rejection message, not one that reveals which
   field was wrong (US2 Scenario 2).
