# Phase 1 Data Model: Todo Task Management REST API

This is the authoritative schema for this feature's persisted data — unlike
the frontend's `data-model.md` (which is a consumer-side TypeScript view),
this file defines the actual `tasks` table via SQLModel, exactly per
Constitution IV. The `users` table is referenced but not owned here; it is
managed by Better Auth and defined by the forthcoming Database &
Authentication feature.

## Entity: Task

Source: spec.md → Key Entities → Task; Constitution IV.

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `id` | integer | yes (server-assigned) | primary key, auto-increment | FR-006 |
| `user_id` | string | yes | foreign key → `users.id`, indexed | Owner; every query MUST filter on this (FR-002) |
| `title` | string | yes | 1–200 characters, not null | FR-006, FR-007 |
| `description` | text | no | 0–1000 characters, nullable | FR-006, FR-007 |
| `completed` | boolean | yes | default `false`, indexed | FR-006, FR-009 |
| `created_at` | timestamp | yes (server-assigned) | set once on creation | FR-006 |
| `updated_at` | timestamp | yes (server-assigned) | updated on every write | FR-008, FR-013 |

### Indexes

- `tasks.user_id` — every list/get/update/delete/toggle operation filters by
  this column (Constitution IV, FR-002).
- `tasks.completed` — supports status filtering if/when the frontend's
  `status` query parameter is exercised.

### Validation rules (enforced server-side — the single source of truth; the frontend's client-side checks are a convenience copy, not authoritative)

- `title` MUST be non-empty after trimming and MUST NOT exceed 200
  characters on create and update (FR-006, FR-007, US1 Scenario 3, US5
  Scenario 3).
- `description`, if provided, MUST NOT exceed 1000 characters (FR-007).
- `completed` is never set directly by a create/update request body — it
  defaults to `false` on creation and is only ever changed via the
  dedicated toggle operation (FR-009, US4).
- `user_id` is never accepted from a request body — it is always derived
  from the verified JWT identity (FR-002), never from client input.

### State transitions

```text
[not created] --create (US1)--> incomplete, created_at set
incomplete --toggle (US4)--> completed, updated_at refreshed
completed --toggle (US4)--> incomplete, updated_at refreshed
incomplete|completed --update title/description (US5)--> same status, updated_at refreshed
incomplete|completed --delete (US6)--> [removed permanently]
```

### Consistency guarantee

Every write (create/update/delete/toggle) MUST be immediately visible to a
subsequent read (list or get) against the same `user_id` — FR-013
(read-after-write consistency). No caching layer sits between the API and
the database for this feature.

## Entity: User (referenced only — not owned by this feature)

- Managed by Better Auth; schema defined by the Database & Authentication
  feature: `id` (string, PK), `email` (string, unique), `name` (string),
  `created_at` (timestamp) — per Constitution IV.
- This feature only consumes a `user_id` string extracted from a verified
  JWT's identity claim. It does not create, update, or delete users, and it
  does not define or migrate the `users` table.
