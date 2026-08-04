# Phase 0 Research: Todo Task Management REST API

No `[NEEDS CLARIFICATION]` markers were left in the Technical Context — the
Phase II hackathon specification and this project's constitution already fix
the framework, ORM, database, and JWT-based auth-verification choices. This
document records the rationale for the decisions that were still this
feature's to make (layering pattern, JWT verification mechanics, migration
tooling, test-database strategy, deployment target) so they aren't
re-litigated during implementation.

## Decision: Layering — routes → services → repositories

- **Decision**: Every endpoint is a thin FastAPI route handler that calls a
  service function; services own validation and ownership-enforcement logic
  and call a repository; repositories are the only layer that touches
  SQLModel/the database session, always scoped by `user_id`.
- **Rationale**: Constitution III mandates this layering explicitly
  ("Business logic MUST be separated from route handlers (routes → services
  → repositories)"). It also makes per-user scoping mechanically impossible
  to skip — every repository function requires `user_id` as a parameter, so
  there's no code path that queries tasks without it.
- **Alternatives considered**: Fat route handlers with inline SQLModel
  queries (rejected — violates Constitution III directly and makes user-
  isolation enforcement easy to accidentally omit on a new endpoint).

## Decision: JWT verification — PyJWT, HS256, shared-secret symmetric verification

- **Decision**: Verify the `Authorization: Bearer <jwt>` header using PyJWT
  with the HS256 algorithm and the `BETTER_AUTH_SECRET` environment
  variable as the verification key, via a single `get_current_user_id`
  FastAPI dependency used by every task route. The dependency decodes the
  token, extracts the user identity claim, and returns it; it raises `401`
  for a missing, malformed, expired, or signature-invalid token.
- **Rationale**: The hackathon brief and Constitution IV specify a single
  shared secret used symmetrically by Better Auth (issuer) and FastAPI
  (verifier) — this is HS256 by definition (no public/private keypair is
  described). PyJWT is the lightest-weight, most widely used library for
  exactly this symmetric-verification case in FastAPI projects.
- **Alternatives considered**: `python-jose` (rejected — heavier dependency
  surface, offers asymmetric/JWK features this project doesn't need);
  hand-rolled signature verification (rejected — reinventing a security-
  critical primitive is never justified when a maintained library exists).

## Decision: `{user_id}` path parameter vs. token identity — mismatch returns 404, not 403

- **Decision**: When the `{user_id}` in the URL path does not match the
  identity decoded from the JWT, the API responds `404 Not Found` (the same
  response used for a genuinely nonexistent task), not `403 Forbidden`.
- **Rationale**: spec.md FR-003 and FR-011 require that a cross-user request
  "not reveal whether data exists for that other identifier." A `403` would
  confirm the target user_id is valid/exists; a uniform `404` for "doesn't
  exist" and "isn't yours" (spec.md Edge Cases) leaks nothing. This mirrors
  how the "task not found" behavior already works for a bad task ID.
- **Alternatives considered**: `403 Forbidden` (rejected — leaks existence
  information the spec explicitly says must not be revealed).

## Decision: Migrations — Alembic

- **Decision**: Use Alembic (SQLAlchemy's/SQLModel's standard migration
  tool) to create and evolve the `tasks` table.
- **Rationale**: SQLModel is built directly on SQLAlchemy Core/ORM, and
  Alembic is its de facto migration tool with first-class SQLModel/
  SQLAlchemy metadata autodetection. Constitution IV requires every schema
  change to ship as a small, deterministic migration that preserves
  existing data — Alembic's versioned migration files satisfy this
  directly.
- **Alternatives considered**: Hand-written SQL migration scripts (rejected
  — no autodetection from SQLModel metadata, more error-prone); relying on
  SQLModel's `create_all()` only (rejected — works for initial schema
  creation but has no upgrade/rollback story for later schema changes).

## Decision: Test database — dedicated test database, real Postgres for contract/integration tests

- **Decision**: Contract and integration tests run against a real
  PostgreSQL instance (a separate Neon branch or a local Postgres container
  reserved for tests), reset between runs. Unit tests for service-layer
  logic that doesn't need real persistence use an in-memory SQLite engine
  via SQLModel for speed.
- **Rationale**: Constitution IV requires all persistent data to live in
  Neon PostgreSQL — testing exclusively against SQLite would risk masking
  Postgres-specific behavior (e.g., timestamp defaults, unique/foreign-key
  constraint errors) that the real system depends on. Reserving real
  Postgres for contract/integration tests (where correctness of persisted
  behavior matters) while keeping fast SQLite-backed unit tests for pure
  service logic balances fidelity with speed.
- **Alternatives considered**: SQLite everywhere (rejected — risks
  Postgres-specific bugs going undetected); testing directly against the
  development Neon database (rejected — risks test data polluting/
  colliding with manual development/demo data).

## Decision: Deployment target — no specific platform mandated

- **Decision**: Document the backend as deployable to any HTTPS-reachable
  ASGI host (e.g., Railway, Render, Fly.io) rather than committing to one.
- **Rationale**: Unlike the frontend (where the hackathon submission form
  explicitly requires a "Published App Link for Vercel"), the Phase II
  brief does not name a required backend host. Keeping this open avoids
  inventing a hard requirement the spec/constitution never stated.
- **Alternatives considered**: Naming a single platform now (rejected — no
  source document mandates one; premature to lock in before Phase IV's
  containerized deployment work).
