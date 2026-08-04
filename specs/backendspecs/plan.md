# Implementation Plan: Todo Task Management REST API

**Branch**: `002-todo-backend` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/backendspecs/spec.md`

**Note**: The feature directory for this plan is `specs/backendspecs/` rather
than `specs/002-todo-backend/` — the spec folder was renamed per user request
after `/sp.plan` ran, matching the Frontend feature's `specs/frontendspecs/`
convention. The git branch (`002-todo-backend`) and history/prompts folder
are unaffected and keep their original names.

## Summary

Build the backend part of Phase II: a FastAPI REST API that lets an
authenticated client (the Phase II frontend today, other clients such as the
Phase III chatbot later) create, list, retrieve, update, delete, and toggle
completion on a user's personal todo tasks (spec.md User Stories 1–6), with
every operation authenticated via a Better Auth–issued JWT and strictly
scoped to the requesting user's own data. Task data is persisted durably in
Neon Serverless PostgreSQL via SQLModel. This plan covers only the backend —
Better Auth configuration, JWT issuance, and the `users` table belong to the
forthcoming Database & Authentication feature; this backend only verifies
tokens issued elsewhere against a shared secret.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**: FastAPI, SQLModel (ORM over SQLAlchemy), Uvicorn
(ASGI server), PyJWT (JWT verification), Pydantic (request/response
validation, ships with FastAPI), Alembic (schema migrations)
**Storage**: Neon Serverless PostgreSQL, accessed exclusively through
SQLModel (Constitution IV)
**Testing**: pytest + httpx (FastAPI's `TestClient`) for contract and
integration tests mapped 1:1 to spec.md's Acceptance Scenarios; isolated
unit tests for the service/repository layers
**Target Platform**: Linux server, any HTTPS-reachable ASGI host (containerized
in Phase IV); no specific platform is mandated by the hackathon for the
backend the way Vercel is mandated for the frontend
**Project Type**: Web application (monorepo `frontend/` + `backend/`, per
Constitution's Technology Stack table) — this plan implements `backend/` only
**Performance Goals**: SC-003 — a created task is visible in a subsequent
list retrieval in under 1 second; FR-013 — read-after-write consistency on
every mutation
**Constraints**: FR-001/FR-002/FR-003 — every operation MUST be authenticated
and scoped to the caller's own identity, with cross-user access indistinguishable
from "not found" (FR-011); FR-007 — title 1–200 chars, description ≤1000
chars, validated on create and update; FR-012 — structured, non-leaking error
responses; Constitution III — routes → services → repositories layering,
errors surfaced via `HTTPException`
**Scale/Scope**: One personal task list per authenticated user (spec.md
Assumptions); this feature covers exactly the six task operations in
spec.md — no priorities/tags/search/sort (Intermediate/Advanced Level,
out of scope for Phase II) and no sign-up/sign-in endpoints (Database &
Authentication feature)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design (see below).*

| Principle | Gate | Status |
|---|---|---|
| I. Spec-Driven Development (NON-NEGOTIABLE) | Plan and all downstream code are generated from `specs/backendspecs/spec.md` via Claude Code; a PHR is recorded for this planning step | PASS |
| II. Frontend: Responsive Next.js App Router UI | N/A to this plan — no frontend code is produced here. `contracts/tasks-api.md` (this feature's authoritative copy) matches the shape the frontend's consumed contract already expects, so no ambiguity is introduced for the frontend | PASS (N/A — contract alignment documented) |
| III. Backend: FastAPI REST API with Enforced User Isolation | FastAPI, exactly the six endpoints from the Principle's table, every route requires a valid JWT (401 if missing/invalid), `{user_id}` is cross-checked against the token identity, all queries scoped per-user, routes → services → repositories layering, errors via `HTTPException` — all reflected in Technical Context and Project Structure below | PASS |
| IV. Database & Authentication: Neon PostgreSQL via SQLModel + Better Auth/JWT | Partial: this plan implements the `tasks` table/SQLModel model exactly per Principle IV's schema (including the `user_id`/`completed` indexes) and verifies JWTs against `BETTER_AUTH_SECRET`. It does NOT implement Better Auth configuration, JWT issuance, or the `users` table — those belong to the forthcoming Database & Authentication feature. `BETTER_AUTH_SECRET` is read from an environment variable, never hardcoded | PASS (partial — task-side schema owned here, auth-issuance side deferred) |

**Result**: PASS, no violations. Complexity Tracking table not needed.

**Post-Design Re-check** (after Phase 1 research/data-model/contracts/quickstart):
No new dependency, entity, or integration point introduced during Phase 1
changes this gate — `research.md`'s layering, JWT-verification, migration,
and test-database decisions all stay inside FastAPI + SQLModel + Neon
(Principles III/IV), and `contracts/tasks-api.md` defines exactly the six
endpoints Principle III already fixes, with no additions. **Result: PASS,
unchanged.**

## Project Structure

### Documentation (this feature)

```text
specs/backendspecs/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── tasks-api.md
└── checklists/
    └── requirements.md  # Spec quality checklist (from /sp.specify)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py                      # FastAPI app entry point, mounts routers
│   ├── core/
│   │   ├── config.py                 # Env var loading: DATABASE_URL, BETTER_AUTH_SECRET
│   │   └── security.py               # JWT verification + get_current_user_id dependency
│   ├── db/
│   │   ├── session.py                # SQLModel engine/session factory (Neon connection)
│   │   └── models.py                 # Task SQLModel model (Constitution IV schema)
│   ├── schemas/
│   │   └── task.py                   # Pydantic request/response schemas (data-model.md)
│   ├── routes/
│   │   └── tasks.py                  # Thin route handlers — call services only
│   ├── services/
│   │   └── task_service.py           # Validation, ownership enforcement, business rules
│   └── repositories/
│       └── task_repository.py        # SQLModel queries, always scoped by user_id
├── alembic/
│   ├── env.py
│   └── versions/                     # tasks table migration(s)
├── tests/
│   ├── contract/                     # One test per endpoint in contracts/tasks-api.md
│   ├── integration/                  # One test per user story in spec.md
│   └── unit/                         # Service/repository logic, isolated
├── pyproject.toml
└── .env.example

# frontend/ exists as a sibling directory (monorepo) but is out of scope for
# this plan — see specs/frontendspecs/.
```

**Structure Decision**: Web application monorepo, Option 2 (same as the
Frontend feature's plan). This plan only implements `backend/`; `frontend/`
is a sibling directory owned by the Frontend feature and is not touched
here. Routes → services → repositories is the required layering per
Constitution III — route handlers MUST stay thin and delegate all
validation/business logic to `services/`, and all persistence to
`repositories/`.

## Complexity Tracking

*No Constitution Check violations — this section is intentionally empty.*
