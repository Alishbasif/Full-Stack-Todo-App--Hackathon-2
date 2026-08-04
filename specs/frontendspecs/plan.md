# Implementation Plan: Responsive Todo Task Management Interface

**Branch**: `001-todo-frontend` | **Date**: 2026-08-03 | **Spec**: [specs/frontendspecs/spec.md](./spec.md)
**Input**: Feature specification from `specs/frontendspecs/spec.md`

**Note**: The feature directory for this plan is `specs/frontendspecs/` rather than
`specs/001-todo-frontend/` — the spec folder was renamed per user request after
`/sp.specify` ran. The git branch (`001-todo-frontend`) and history/prompts
folder are unaffected and keep their original names.

## Summary

Build the frontend part of Phase II: a responsive Next.js App Router web
interface that lets a signed-in user add, view, update, delete, and toggle
completion on their personal todo tasks (spec.md User Stories 1–5). All data
access goes through a single API client that calls the Backend feature's REST
endpoints and attaches the Better Auth–issued JWT on every request; this plan
covers only the frontend — no backend or database code is produced here.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS (required by Next.js 16)
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS,
Better Auth (client SDK, for session + JWT issuance only — verification is
backend-side)
**Storage**: N/A — the frontend holds no persistent storage of its own; all
task and user data is persisted by the Backend/Database feature via Neon
Serverless PostgreSQL
**Testing**: Vitest + React Testing Library for component/unit tests;
Playwright for end-to-end tests mapped 1:1 to the Acceptance Scenarios in
spec.md
**Target Platform**: Web browser (responsive: mobile, tablet, desktop),
deployed to Vercel (hackathon submission requires a published Vercel app link)
**Project Type**: Web application (monorepo `frontend/` + `backend/`, per
Constitution's Technology Stack table)
**Performance Goals**: SC-001 task creation completes in <10s end-to-end;
SC-002 marking a task complete takes ≤2 interactions; SC-004 action feedback
(success/error) appears within 1s of the action
**Constraints**: FR-007/SC-003 — no horizontal scrolling required down to a
320px viewport; FR-011 — all controls keyboard-operable with visible focus
states; Constitution II — every backend request MUST attach `Authorization:
Bearer <token>`; frontend MUST NOT implement auth/session logic outside
Better Auth
**Scale/Scope**: One personal task list per signed-in user (spec.md
Assumptions); this feature covers the task list screen and the add/edit/
delete interactions only — sign-in/sign-up screens belong to the Database &
Authentication feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design (see below).*

| Principle | Gate | Status |
|---|---|---|
| I. Spec-Driven Development (NON-NEGOTIABLE) | Plan and all downstream code are generated from `specs/frontendspecs/spec.md` via Claude Code; a PHR is recorded for this planning step | PASS |
| II. Frontend: Responsive Next.js App Router UI | Next.js 16 App Router + TypeScript + Tailwind, centralized API client (`lib/api.ts`), Server-Components-by-default, Better Auth JWT attached on every request — all reflected in Technical Context and Project Structure | PASS |
| III. Backend: FastAPI REST API with Enforced User Isolation | N/A to this plan — no backend code is produced here. The frontend's consumed contract (`contracts/tasks-api.md`) mirrors this principle's endpoint table exactly so the future Backend feature has no ambiguity to resolve | PASS (N/A — contract alignment documented) |
| IV. Database & Authentication | N/A to this plan — no schema/auth code is produced here. The frontend integrates Better Auth client-side per Principle II only; token issuance/verification internals belong to the Database & Authentication feature | PASS (N/A — integration point documented) |

**Result**: PASS, no violations. Complexity Tracking table not needed.

**Post-Design Re-check** (after Phase 1 research/data-model/contracts/quickstart):
No new dependency, entity, or integration point introduced during Phase 1
changes this gate — `research.md`'s testing/state-management/deployment
decisions stay inside Next.js + Tailwind + Better Auth (Principle II), and
`contracts/tasks-api.md` only documents the Backend's existing endpoint
contract (Principle III) without implementing it. **Result: PASS, unchanged.**

## Project Structure

### Documentation (this feature)

```text
specs/frontendspecs/
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
frontend/
├── app/
│   ├── (tasks)/
│   │   └── page.tsx              # Task list screen (US2)
│   ├── layout.tsx                # Root layout (nav/shell)
│   ├── loading.tsx                # Loading state (FR-009)
│   └── error.tsx                  # Error state + retry (FR-009)
├── components/
│   ├── tasks/
│   │   ├── TaskList.tsx           # Renders tasks + empty state (US2, FR-008)
│   │   ├── TaskItem.tsx           # Single row: title, status, actions
│   │   ├── TaskForm.tsx           # Add/Edit form (US1, US4)
│   │   ├── CompleteToggle.tsx     # Completion control (US3)
│   │   └── DeleteTaskDialog.tsx   # Delete confirmation (US5)
│   └── ui/                        # Shared buttons, inputs, dialogs
├── hooks/
│   └── useTasks.ts                # Fetch/mutate tasks via lib/api.ts
├── lib/
│   └── api.ts                     # Centralized API client; attaches JWT
├── types/
│   └── task.ts                    # Task type (see data-model.md)
└── tests/
    ├── unit/                      # Vitest + React Testing Library
    └── e2e/                       # Playwright, one spec per user story

# backend/ exists as a sibling directory (monorepo) but is out of scope for
# this plan — see the forthcoming Backend feature.
```

**Structure Decision**: Web application monorepo, Option 2. This plan only
implements `frontend/`; `backend/` is a sibling directory owned by the
separate Backend feature and is not touched here.

## Complexity Tracking

*No Constitution Check violations — this section is intentionally empty.*
