# Quickstart: Frontend (Todo Task Management Interface)

## Prerequisites

- Node.js 20 LTS or later
- npm (or pnpm/yarn — examples below use npm)
- The Backend feature running locally (or its `NEXT_PUBLIC_API_URL` reachable)
  for the API client to call

## Environment variables

Create `frontend/.env.local` (never commit this file):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=<shared secret — same value the backend uses>
```

`BETTER_AUTH_SECRET` MUST be identical to the value configured on the
backend (Constitution IV) — Better Auth and the FastAPI JWT verification
middleware both sign/verify with this value.

## Install & run

```bash
cd frontend
npm install
npm run dev
```

The app serves at `http://localhost:3000`.

## Running tests

```bash
cd frontend
npm run test        # Vitest + React Testing Library (unit/component)
npm run test:e2e    # Playwright (one spec per user story in spec.md)
```

## Verifying the golden path manually

1. Sign in (Database & Authentication feature must be running).
2. Add a task with a title only → confirm it appears in the list
   incomplete (US1).
3. Add a task with a title and description → confirm both are visible.
4. Reload the page → confirm the task list still shows both tasks (US2).
5. Mark a task complete, then incomplete again → confirm the status flips
   immediately both times (US3).
6. Edit a task's title → confirm the list reflects the change (US4).
7. Delete a task, confirming the prompt → confirm it disappears (US5).
8. Resize the browser to a 320px-wide viewport → confirm every control
   above remains usable without horizontal scrolling (FR-007/SC-003).
