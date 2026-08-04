# Phase 1 Data Model: Account Creation and Authenticated Sessions

Source: spec.md → Key Entities; Constitution IV. These tables are created
and managed by Better Auth's own migration tooling (see research.md's
schema-ownership decision), not SQLModel — this document fixes the shape
this feature's code (and the already-built backend) depends on.

## Entity: Account (`user` table, Better Auth-managed)

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `id` | string | yes (server-assigned) | primary key | FR-014; this is the value the JWT's `sub` claim carries and what `backend/app/core/security.py` already extracts as `user_id` |
| `email` | string | yes | unique, well-formed | FR-001, FR-004 |
| `name` | string \| null | no | — | FR-001 |
| `password` | — | — | never exposed | Stored as a Better Auth-managed hash in its own internal table, never returned in any response (FR-010); not a field this feature's own code ever reads |
| `created_at` | timestamp | yes (server-assigned) | — | FR-011 |

### Validation rules

- `email` MUST be well-formed and MUST be unique across all accounts
  (FR-002, FR-004, US1 Scenarios 3–4).
- A password MUST meet a minimum strength rule (at minimum, a reasonable
  minimum length) before an account is created (FR-003, US1 Scenario 4).
- `password` is never included in any API response, ever (FR-010).

## Entity: Session/Credential (Better Auth-managed: `session` table + issued JWT)

| Field | Type | Required | Notes |
|---|---|---|---|
| Owning account id | string | yes | Matches `Account.id`; this is the JWT's `sub` claim (FR-007, FR-012) |
| Issued at | timestamp | yes | Set on successful sign-up or sign-in |
| Expires at | timestamp | yes | Issued-at + 7 days (FR-008, SC-006, research.md) |

### State transitions

```text
[no account] --sign up (US1)--> account created + signed in (session issued)
[account, signed out] --sign in (US2)--> signed in (session issued)
signed in --time passes, < 7 days--> still signed in (US3)
signed in --7 days elapse--> session expired --any authenticated action--> refused, must sign in again (US3 Scenario 3)
signed in --sign out (US4)--> signed out (session/credential no longer honored by this client)
```

### Consistency guarantee

A credential issued by this feature MUST be verifiable, without contacting
this feature again, by any other part of the application that holds the
shared secret — concretely, the already-implemented
`backend/app/core/security.py::get_current_user_id` dependency, which
decodes the JWT and trusts its `sub` claim as the account id (FR-012,
SC-007). This feature does not need to expose a "verify token" endpoint of
its own; verification is self-contained in the JWT's signature.

## Relationship to the `tasks` table (Backend feature, unchanged)

`tasks.user_id` (see `specs/backendspecs/data-model.md`) is a plain string
column, not a database-level foreign key into Better Auth's `user` table —
the two tables are managed by two different migration systems on the same
database (research.md). Referential integrity between a task's `user_id`
and a real account is enforced at the application layer: the backend only
ever writes a `user_id` it extracted from a JWT this feature issued, and
this feature only ever issues a JWT whose `sub` is a real account's `id`.
