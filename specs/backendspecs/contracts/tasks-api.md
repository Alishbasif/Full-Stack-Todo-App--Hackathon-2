# Owned Contract: Tasks REST API

**Status**: Owned by this feature — this is the authoritative definition of
the endpoints `backend/app/routes/tasks.py` implements. It is derived from
the Phase II hackathon specification's "API Endpoints" and "Securing the
REST API" sections and from Constitution III/IV.

`specs/frontendspecs/contracts/tasks-api.md` is a **consumed copy** written
against this same contract. The two files MUST describe identical shapes; if
they ever diverge, this file wins, and the frontend copy MUST be updated to
match in the same change.

## Authentication

Every request MUST include:

```http
Authorization: Bearer <jwt>
```

The token is verified using HS256 against the `BETTER_AUTH_SECRET`
environment variable (shared with the Better Auth issuer — Constitution IV).
A missing, malformed, expired, or signature-invalid token returns `401
Unauthorized` before any task data is read or modified (FR-001).

## Base path

All endpoints are scoped under a user: `/api/{user_id}/tasks`. `{user_id}`
MUST match the identity decoded from the verified JWT. A mismatch returns
`404 Not Found` — not `403` — so the response never reveals whether data
exists for the mismatched identifier (FR-003, FR-011; see research.md's
"404, not 403" decision).

## Task shape (response body)

```json
{
  "id": 5,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-08-04T10:00:00Z",
  "updated_at": "2026-08-04T10:00:00Z"
}
```

## Error shape (all non-2xx responses)

```json
{
  "detail": "Human-readable, non-leaking message"
}
```

No stack traces, internal exception text, or raw database errors are ever
included in a response body (FR-012).

## Endpoints

### `GET /api/{user_id}/tasks`

List all tasks for the authenticated user (US2).

- **Query parameters**: `status` (`all` | `pending` | `completed`, optional,
  default `all`); `sort` (`created` | `title`, optional, default `created`)
- **Response `200`**: `Task[]` (empty array if the user has no tasks — US2
  Scenario 2)
- **Response `401`**: no/invalid token

### `POST /api/{user_id}/tasks`

Create a new task (US1).

- **Request body**: `{ "title": string, "description"?: string }`
- **Response `201`**: `Task`, `completed: false`, `created_at`/`updated_at`
  set to the same timestamp
- **Response `400`**: validation error (title empty or >200 chars,
  description >1000 chars) — FR-007
- **Response `401`**: no/invalid token

### `GET /api/{user_id}/tasks/{id}`

Get a single task's details (US2).

- **Response `200`**: `Task`
- **Response `404`**: task not found, or exists but not owned by this user
  (FR-011)
- **Response `401`**: no/invalid token

### `PUT /api/{user_id}/tasks/{id}`

Update a task's title and/or description (US5).

- **Request body**: `{ "title"?: string, "description"?: string }`
- **Response `200`**: updated `Task`, `updated_at` refreshed
- **Response `400`**: validation error
- **Response `404`**: task not found or not owned by this user
- **Response `401`**: no/invalid token

### `DELETE /api/{user_id}/tasks/{id}`

Delete a task (US6).

- **Response `204`**: no content
- **Response `404`**: task not found or not owned by this user
- **Response `401`**: no/invalid token

### `PATCH /api/{user_id}/tasks/{id}/complete`

Toggle a task's completion status (US4).

- **Request body**: none
- **Response `200`**: updated `Task` with `completed` flipped and
  `updated_at` refreshed
- **Response `404`**: task not found or not owned by this user
- **Response `401`**: no/invalid token

## Backend responsibility summary (this feature)

| Failure mode | Response |
|---|---|
| Missing/invalid/expired token | `401`, no task data touched (US3, FR-001) |
| `{user_id}` path ≠ token identity | `404`, indistinguishable from a nonexistent task (US3, FR-003, FR-011) |
| Task ID doesn't exist, or belongs to another user | `404`, identical response either way (FR-011, Edge Cases) |
| Title empty or >200 chars; description >1000 chars | `400`, field-specific message (FR-007) |
| Malformed request body / wrong field types | `400`, validation error, no partial write (Edge Cases) |
| Any unhandled internal error | `500` with a generic, non-leaking message — never raw exception text (FR-012) |
