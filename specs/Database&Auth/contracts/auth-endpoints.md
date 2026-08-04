# Owned Contract: Authentication Endpoints

**Status**: Owned by this feature. Better Auth mounts its own route handler
at `frontend/app/api/auth/[...all]/route.ts`, which serves a fixed set of
endpoints under `/api/auth/*`. This document fixes the shapes this
feature's own UI code (`SignUpForm`, `SignInForm`, `SignOutButton`,
`lib/api.ts`) is written against — it is not a REST API this project
designed from scratch, but pinning the request/response shapes here keeps
`lib/auth-client.ts` and its callers traceable to a spec, per Constitution I.

## `POST /api/auth/sign-up/email`

Create a new account (US1).

- **Request body**: `{ "email": string, "password": string, "name"?: string }`
- **Response `200`**: Account created, session/credential issued immediately
  (US1 Scenario 1) — response includes the account's `id`, `email`, `name`
- **Response `422`/`400`**: Validation failure — malformed email, password
  below minimum strength (FR-003, FR-004, US1 Scenario 4)
- **Response `409`** (or equivalent): Email already registered — no account
  created or altered (FR-002, US1 Scenario 3)

## `POST /api/auth/sign-in/email`

Sign in to an existing account (US2).

- **Request body**: `{ "email": string, "password": string }`
- **Response `200`**: Session/credential issued (US2 Scenario 1)
- **Response `401`** (or equivalent): Incorrect email or password — one
  generic message, never indicating which field was wrong (FR-006, US2
  Scenario 2)

## `GET /api/auth/get-session`

Retrieve the current session, if any (US3).

- **Response `200`**: The current account's session, if a valid credential
  is present; otherwise a null/empty session — this is what
  `frontend/middleware.ts` and `lib/api.ts` check to decide whether a
  request is authenticated client-side
- Used to keep a signed-in user recognized across page reloads without
  re-entering credentials (FR-013, US3 Scenario 1)

## `POST /api/auth/sign-out`

End the current session (US4).

- **Response `200`**: Session ended; further authenticated actions from
  this client are refused until signing in again (FR-009, US4 Scenario 1)

## JWT issuance (integration point with the Backend feature)

Better Auth's JWT plugin issues a signed JWT alongside the session so that
other services (the task-management API) can verify identity without
calling back into this feature (FR-007, FR-012, US3 Scenario 2). The exact
retrieval mechanism (a dedicated token endpoint vs. a response header,
depending on the installed Better Auth version) is an open implementation
detail that MUST be confirmed and documented here during
`/sp.implement` — but whichever it is, the resulting token MUST satisfy the
shape the backend already expects (see
`specs/backendspecs/contracts/tasks-api.md`):

```json
{
  "alg": "HS256",
  "sub": "<account id, matches Account.id in data-model.md>"
}
```

`frontend/lib/api.ts`'s existing `getAuthToken()`/`getCurrentUserId()`
stubs (currently reading dev placeholders from `localStorage`) MUST be
replaced with real values sourced from this JWT — every other line in
`lib/api.ts` (the `Authorization: Bearer <token>` attachment, the
`{user_id}` path construction) already assumes this shape and needs no
further change (Constitution II, FR-012).

## Error shape

Better Auth's default error responses are used as-is; this feature does not
wrap them in a custom shape, since no other part of the application parses
auth-endpoint error bodies directly — `lib/auth-client.ts`'s callers only
branch on success/failure and a human-readable message.
