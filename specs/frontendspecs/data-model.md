# Phase 1 Data Model: Responsive Todo Task Management Interface

This is the frontend's TypeScript-facing view of the data it renders and
mutates. The frontend does not own persistence — the authoritative schema
lives in the Database & Authentication feature (Neon PostgreSQL `tasks`
table, per Constitution IV). This model exists so `types/task.ts` and
`lib/api.ts` have a single, spec-derived source of truth to code against.

## Entity: Task

Source: spec.md → Key Entities → Task.

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `id` | number | yes (server-assigned) | — | Not present on create requests |
| `title` | string | yes | 1–200 characters | FR-002, FR-003 |
| `description` | string \| null | no | 0–1000 characters | FR-002 |
| `completed` | boolean | yes | defaults to `false` on create | FR-006 |
| `createdAt` | string (ISO 8601) | yes (server-assigned) | — | Displayed per US2 |
| `updatedAt` | string (ISO 8601) | yes (server-assigned) | — | Not displayed in UI; used for cache/sort |

### Validation rules (enforced client-side before calling the API, mirrored server-side)

- `title` MUST be non-empty after trimming and MUST NOT exceed 200
  characters (FR-003, US1 Scenario 3, US4 Scenario 3).
- `description`, if provided, MUST NOT exceed 1000 characters.
- `completed` MUST only be toggled via the dedicated complete/incomplete
  action (US3) — it is never a free-text field.

### State transitions

```text
[not created] --create (US1)--> incomplete
incomplete --toggle complete (US3)--> completed
completed --toggle incomplete (US3)--> incomplete
incomplete|completed --update (US4)--> same status, new title/description
incomplete|completed --delete (US5)--> [removed]
```

### Derived view state (not persisted, computed in the frontend only)

- `TaskListStatus`: `"loading" | "error" | "empty" | "ready"` — drives which
  of FR-008/FR-009's UI states is rendered.
- `TaskFormErrors`: per-field validation messages surfaced before a
  create/update request is even sent, to satisfy SC-004 (feedback within 1s)
  for the common validation-failure case without a round trip.
