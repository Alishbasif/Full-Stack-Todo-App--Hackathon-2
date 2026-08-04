<!--
Sync Impact Report
==================
Version change: [TEMPLATE UNSET] → 1.0.0 (initial ratification)

Modified principles: n/a (first concrete version; template placeholders replaced)

Added sections:
- I. Spec-Driven Development (NON-NEGOTIABLE)
- II. Frontend: Responsive Next.js App Router UI
- III. Backend: FastAPI REST API with Enforced User Isolation
- IV. Database & Authentication: Neon PostgreSQL via SQLModel + Better Auth/JWT
- Technology Stack (Phase II)
- Development Workflow & Quality Gates
- Governance

Removed sections:
- Generic placeholder Principle 5 / Principle 6 slots (not needed — this phase's
  scope is fully covered by 4 declarative principles; re-add a 5th principle via
  a MINOR amendment if a new cross-cutting concern emerges, e.g. observability).

Templates requiring updates:
- ✅ .specify/templates/plan-template.md — "Constitution Check" gate reads this
  file dynamically; no hardcoded principle names to update, no edit needed.
- ✅ .specify/templates/spec-template.md — generic, technology-agnostic; no
  hardcoded principle names to update, no edit needed.
- ✅ .specify/templates/tasks-template.md — generic, technology-agnostic; no
  hardcoded principle names to update, no edit needed.
- ✅ CLAUDE.md (root) — already generic re: SDD/PHR/ADR workflow, consistent
  with Principle I; no edit needed.
- ⚠ specs/<feature>/plan.md files (none exist yet) — future plans MUST run the
  Constitution Check gate against this file.

Follow-up TODOs:
- TODO(RATIFICATION_DATE): Confirmed as the date this constitution was first
  authored for Phase II (2026-08-03) — no earlier ratified version existed.
-->

# Todo App — Phase II Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

Every Phase II feature MUST be defined by a Markdown specification under
`specs/<feature-name>/spec.md` — including user stories and acceptance
criteria — before any implementation work begins. Claude Code, guided by
Spec-Kit Plus, MUST generate the implementation from that specification;
application code MUST NOT be hand-written. When generated output is
incorrect or incomplete, the specification MUST be refined and regenerated
rather than manually patched. Every prompt that drives planning or
implementation MUST result in a Prompt History Record (PHR) under
`history/prompts/`, and every architecturally significant decision MUST be
offered to the user as an ADR suggestion — an ADR MUST NOT be created without
explicit user consent.

Rationale: This is the explicit, non-negotiable premise of the hackathon —
the deliverable is mastery of spec-driven development with Claude Code and
Spec-Kit Plus, not hand-authored application code.

### II. Frontend: Responsive Next.js App Router UI

The frontend MUST be built with Next.js 16+ using the App Router and
TypeScript. It MUST implement all 5 Basic Level features — Add Task, Delete
Task, Update Task, View Task List, Mark as Complete — as a responsive UI that
works on mobile, tablet, and desktop breakpoints. All backend calls MUST be
routed through a single centralized API client (equivalent to `/lib/api.ts`);
components and pages MUST NOT call `fetch`/`axios` directly. Server
Components MUST be the default; Client Components are permitted only where
interactivity requires them (forms, toggles, dialogs). Styling MUST use
Tailwind CSS utility classes — inline styles and unnecessary custom CSS are
prohibited. The frontend MUST integrate Better Auth for user signup/signin
and MUST attach the Better Auth–issued JWT as an `Authorization: Bearer
<token>` header on every API request.

Rationale: Matches the Phase II specification's frontend requirements
verbatim and aligns with this repository's `frontend-agent` and
`Frontend-skills` conventions.

### III. Backend: FastAPI REST API with Enforced User Isolation

The backend MUST be built with Python FastAPI and MUST expose exactly the
following REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

Every endpoint MUST require a valid JWT in the `Authorization: Bearer
<token>` header, verified against the shared `BETTER_AUTH_SECRET`. Requests
without a valid token MUST receive `401 Unauthorized`. The backend MUST
decode the token to obtain the authenticated user's identity and MUST reject
or refuse to serve any request where the `{user_id}` path parameter does not
match that identity — every database query MUST be scoped to the
authenticated user's own data. Business logic MUST be separated from route
handlers (routes → services → repositories), and errors MUST be surfaced via
`HTTPException` with consistent, non-leaking error responses.

Rationale: Matches the Phase II specification's "Securing the REST API"
section verbatim and aligns with this repository's `fastapi-backend-agent`
and `auth-agent` conventions.

### IV. Database & Authentication: Neon PostgreSQL via SQLModel + Better Auth/JWT

All persistent data MUST live in Neon Serverless PostgreSQL and MUST be
accessed exclusively through SQLModel. The schema MUST match the Phase II
specification exactly:

- `users` (managed by Better Auth): `id` (string, PK), `email` (string,
  unique), `name` (string), `created_at` (timestamp)
- `tasks`: `id` (integer, PK), `user_id` (string, FK → `users.id`), `title`
  (string, NOT NULL), `description` (text, nullable), `completed` (boolean,
  default `false`), `created_at` (timestamp), `updated_at` (timestamp)

Indexes MUST exist on `tasks.user_id` and `tasks.completed`. Authentication
MUST be implemented with Better Auth on the frontend issuing JWTs, and the
identical `BETTER_AUTH_SECRET` MUST be configured via environment variable in
both the frontend and backend services — it MUST NOT be hardcoded anywhere in
source. Every schema change MUST ship as a migration; migrations MUST be
small, deterministic, MUST preserve existing data, and MUST NOT edit a
previously executed migration.

Rationale: Matches the Phase II specification's "Database Schema" and
"Securing the REST API" sections verbatim and aligns with this repository's
`database-agent` and `Auth-skills` conventions.

## Technology Stack (Phase II)

| Layer | Technology |
|---|---|
| Frontend | Next.js 16+ (App Router), TypeScript, Tailwind CSS |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth (frontend) + JWT verification (backend) |
| Spec-Driven Tooling | Claude Code + Spec-Kit Plus |

This stack is fixed for Phase II. Substituting the framework, ORM, database,
or authentication provider requires a constitution amendment under
Governance below — it MUST NOT be done silently inside a feature spec or plan.

## Development Workflow & Quality Gates

- Every feature MUST progress through `/sp.specify` → `/sp.plan` →
  `/sp.tasks` → `/sp.implement`, in that order, before code is considered
  mergeable.
- Every feature's spec, plan, and tasks files MUST live under
  `specs/<feature-name>/`, and every implementation prompt MUST be recorded
  as a PHR under `history/prompts/<feature-name>/`.
- Every API endpoint's method, path, and request/response shape MUST match
  its governing spec exactly; a deviation MUST first be reflected as a spec
  update, not implemented ad hoc.
- Every user-facing change MUST be exercised against its golden path and
  relevant edge cases before being reported complete; UI changes MUST be
  verified in a running browser session where feasible.
- No hardcoded secrets, API keys, or credentials are permitted anywhere in
  source; all secrets MUST be read from environment variables (`.env`,
  documented in `README.md`).
- Changes MUST use the smallest viable diff — implementation MUST NOT
  refactor or modify code unrelated to the active spec/task.

## Governance

This constitution supersedes all other project conventions for Phase II.
Amending it requires:

1. A documented rationale for the change, recorded in the amendment's PHR
   and, where architecturally significant, an ADR.
2. A version bump following semantic versioning:
   - **MAJOR** — backward-incompatible principle removal or redefinition
     (e.g., dropping Better Auth, replacing FastAPI, changing the REST
     contract shape).
   - **MINOR** — a new principle or materially expanded guidance added
     (e.g., a new cross-cutting principle for observability or testing).
   - **PATCH** — clarifications, wording fixes, or non-semantic refinements.
3. Propagation of the change across `.specify/templates/plan-template.md`,
   `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`,
   and any dependent `CLAUDE.md` or `.claude/agents/*.md` files, verified in
   the same PR/commit as the amendment.

Every spec, plan, and implementation MUST be checked against these
principles before being considered complete. Any deviation from a principle
MUST be explicitly justified in the relevant spec's or plan's Complexity
Tracking section; unjustified deviations MUST be rejected and the work
returned to spec revision.

**Version**: 1.0.0 | **Ratified**: 2026-08-03 | **Last Amended**: 2026-08-03
