---
id: 3
title: Frontend Tasks Breakdown
stage: tasks
date: 2026-08-03
surface: agent
model: claude-sonnet-5
feature: 001-todo-frontend
branch: 001-todo-frontend
user: Alishba Asif
command: /sp.tasks
labels: ["tasks", "frontend", "nextjs", "phase-2"]
links:
  spec: specs/frontendspecs/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/frontendspecs/tasks.md
tests:
 - none
---

## Prompt

Create a detail task file in which all frontend task from plan.md are included. file must exist in specs\frontendspecs

## Response snapshot

`check-prerequisites.ps1` hits the same `Test-FeatureBranch` gate documented in the previous PHR — it resolves `FEATURE_DIR` from the git branch name (`001-todo-frontend`) and would report "Feature directory not found" against the renamed `specs/frontendspecs/`. Skipped the script and read `plan.md`, `spec.md`, `data-model.md`, `contracts/tasks-api.md`, and `research.md` directly from `specs/frontendspecs/` (all authored in this conversation) to generate tasks.md by hand at the exact path the user requested.

Generated `specs/frontendspecs/tasks.md` with 52 tasks (T001–T052) organized per the required checklist format:
- **Phase 1 (Setup, T001–T006)**: Next.js 16 + TS init, Tailwind, lint/scripts, Vitest+RTL, Playwright, `.env.local.example` — straight from plan.md's Technical Context and research.md's testing decision.
- **Phase 2 (Foundational, T007–T012)**: `Task` type (data-model.md), the centralized `lib/api.ts` client with JWT-attachment and the 401/400/404/5xx error-mapping table (contracts/tasks-api.md), root layout, loading/error routes, shared UI primitives — blocks all stories.
- **Phases 3–7 (T013–T046)**: one phase per spec.md user story (US1 Add → US2 View → US3 Complete-toggle → US4 Update → US5 Delete), each with Tests (Vitest component test + Playwright e2e test, both [P]) then Implementation tasks (API client method → hook mutation → component wiring), every task citing the FR/SC/contract endpoint it implements.
- **Phase 8 (Polish, T047–T052)**: keyboard/focus audit (FR-011), 320px responsive check (FR-007/SC-003), state/feedback consistency (FR-009/010), quickstart.md golden-path run, 401-redirect verification, dead-code cleanup.

Included test tasks (rather than treating them as optional/skipped) because plan.md's Project Structure and research.md already committed to Vitest/RTL + Playwright as this feature's testing stack, and the user's own instruction ("all frontend task from plan.md") implied the test directories plan.md already specifies. Flagged one deliberate deviation from strict story-independence: US1 and US2 are both P1 and sequenced (Phase 3 then Phase 4) rather than fully parallel, since US1's own Independent Test in spec.md ("confirm it now appears in the task list") requires US2's list-rendering to exist to observe the result — documented in the Dependencies section rather than silently reordered.

## Outcome

- ✅ Impact: Frontend feature now has a complete, checklist-format task breakdown ready for `/sp.implement`; MVP scope (US1+US2) and parallel-team strategy (US3/US4/US5 after Phase 4) are explicit.
- 🧪 Tests: none run (task-authoring stage); 10 test tasks were *generated* (2 per user story) for future execution
- 📁 Files: `specs/frontendspecs/tasks.md` (new)
- 🔁 Next prompts: `/sp.implement` for this feature, then specify → plan → tasks for Backend and Database & Authentication.
- 🧠 Reflection: Every task cites its source (FR-/SC-/US- ID, or a contracts/tasks-api.md endpoint) rather than being invented ad hoc — kept traceability tight given this is a hackathon deliverable that must map back to the original Hackathon_II document.

## Evaluation notes (flywheel)

- Failure modes observed: `check-prerequisites.ps1` fails on this renamed-folder setup the same way `setup-plan.ps1` did last turn — consistent, expected, no new bug.
- Graders run and results (PASS/FAIL): manual format check — all 52 tasks follow `- [ ] T### [P?] [Story?] Description with file path` (PASS); Setup/Foundational/Polish phases correctly have no [Story] label (PASS); all Phase 3–7 tasks correctly carry their [US#] label (PASS).
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
