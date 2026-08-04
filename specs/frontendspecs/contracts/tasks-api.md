# Consumed Contract: Tasks REST API

**Status**: Consumed, not owned. This is the contract `frontend/lib/api.ts`
is written against. It is transcribed exactly from the Phase II hackathon
specification's "API Endpoints" and "Securing the REST API" sections and
from Constitution III — it is authoritative until the Backend feature's own
`/sp.plan` finalizes it. Any change to these shapes requires updating this
file and `frontend/lib/api.ts` together.

## Authentication

Every request MUST include:

```http
Authorization: Bearer <jwt>
```

A missing or invalid token returns `401 Unauthorized`. The frontend obtains
`<jwt>` from Better Auth's client session (see the Database & Authentication
feature) — this file does not define how the token is issued, only how it is
attached.

## Base path

All endpoints are scoped under the authenticated user:
`/api/{user_id}/tasks`. `{user_id}` MUST match the authenticated user's ID —
`lib/api.ts` MUST always fill this from the current Better Auth session, not
from user-editable input.

## Task shape (response body)

```json
{
  "id": 5,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-08-03T10:00:00Z",
  "updated_at": "2026-08-03T10:00:00Z"
}
```

## Endpoints

### `GET /api/{user_id}/tasks`

List all tasks for the authenticated user.

- **Query parameters**: `status` (`all` | `pending` | `completed`, optional,
  default `all`); `sort` (`created` | `title` | `due_date`, optional,
  default `created`)
- **Response `200`**: `Task[]`
- **Response `401`**: no/invalid token

### `POST /api/{user_id}/tasks`

Create a new task.

- **Request body**: `{ "title": string, "description"?: string }`
- **Response `201`**: `Task`
- **Response `400`**: validation error (title empty or >200 chars,
  description >1000 chars)
- **Response `401`**: no/invalid token

### `GET /api/{user_id}/tasks/{id}`

Get a single task's details.

- **Response `200`**: `Task`
- **Response `404`**: task not found or not owned by this user
- **Response `401`**: no/invalid token

### `PUT /api/{user_id}/tasks/{id}`

Update a task's title and/or description.

- **Request body**: `{ "title"?: string, "description"?: string }`
- **Response `200`**: updated `Task`
- **Response `400`**: validation error
- **Response `404`**: task not found or not owned by this user
- **Response `401`**: no/invalid token

### `DELETE /api/{user_id}/tasks/{id}`

Delete a task.

- **Response `204`**: no content
- **Response `404`**: task not found or not owned by this user
- **Response `401`**: no/invalid token

### `PATCH /api/{user_id}/tasks/{id}/complete`

Toggle a task's completion status.

- **Request body**: none
- **Response `200`**: updated `Task`
- **Response `404`**: task not found or not owned by this user
- **Response `401`**: no/invalid token

## Frontend error-handling mapping (this feature's responsibility)

| Backend response | Frontend behavior |
|---|---|
| `401` | Redirect to sign-in (session expired); do not retry silently |
| `400` | Surface field-level validation message from response body (FR-003) |
| `404` | Show "task not found" message and remove it from local state (edge case: stale task) |
| Network failure / `5xx` | Show error state with retry (FR-009) |
