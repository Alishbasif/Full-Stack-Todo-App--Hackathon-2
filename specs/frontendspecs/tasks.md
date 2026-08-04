---
description: "Task list for Responsive Todo Task Management Interface (frontend)"
---

# Tasks: Responsive Todo Task Management Interface

**Input**: Design documents from `specs/frontendspecs/` (plan.md, spec.md, data-model.md, contracts/tasks-api.md, research.md, quickstart.md)
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Note**: This feature's docs live in `specs/frontendspecs/` rather than
`specs/001-todo-frontend/` (renamed per user request after `/sp.specify`).
The git branch remains `001-todo-frontend`.

**Tests**: `plan.md`'s Project Structure and `research.md` explicitly commit to
Vitest + React Testing Library and Playwright as this feature's testing
stack, so test tasks are included per story below.

**Organization**: Tasks are grouped by user story (from spec.md, P1 → P3) to
enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Every task includes an exact file path under `frontend/`

## Path Conventions

All paths are relative to the repository root and match `plan.md`'s Project
Structure: `frontend/app/`, `frontend/components/tasks/`, `frontend/hooks/`,
`frontend/lib/`, `frontend/types/`, `frontend/tests/unit/`,
`frontend/tests/e2e/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js frontend project per plan.md's Technical Context

- [ ] T001 Initialize Next.js 16 (App Router) + TypeScript project in `frontend/` (`package.json`, `tsconfig.json`, `next.config.ts`)
- [ ] T002 [P] Configure Tailwind CSS in `frontend/` (`tailwind.config.ts`, `frontend/app/globals.css`)
- [ ] T003 [P] Configure ESLint/Prettier and add `dev`/`build`/`test`/`test:e2e` npm scripts in `frontend/package.json`
- [ ] T004 [P] Install and configure Vitest + React Testing Library in `frontend/` (`vitest.config.ts`, `frontend/tests/unit/setup.ts`) per research.md
- [ ] T005 [P] Install and configure Playwright in `frontend/` (`playwright.config.ts`, `frontend/tests/e2e/`) per research.md
- [ ] T006 [P] Create `frontend/.env.local.example` documenting `NEXT_PUBLIC_API_URL` and `BETTER_AUTH_SECRET` per quickstart.md

**Checkpoint**: Frontend project scaffolded, buildable, and testable (empty test suites pass)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create `Task` TypeScript type in `frontend/types/task.ts` per data-model.md (id, title, description, completed, createdAt, updatedAt)
- [ ] T008 Implement centralized API client base (`fetch` wrapper, base URL from `NEXT_PUBLIC_API_URL`, attaches `Authorization: Bearer <token>` from the Better Auth session) in `frontend/lib/api.ts` per Constitution II and contracts/tasks-api.md
- [ ] T009 Implement response error-handling mapping (401 → redirect to sign-in, 400 → validation message, 404 → "not found" + remove from local state, network/5xx → error state with retry) in `frontend/lib/api.ts` per contracts/tasks-api.md's error-handling table (depends on T008)
- [ ] T010 [P] Create root layout (`frontend/app/layout.tsx`) with page shell/navigation
- [ ] T011 [P] Create `frontend/app/loading.tsx` and `frontend/app/error.tsx` for the task route (FR-009)
- [ ] T012 [P] Create shared UI primitives (Button, Input, Dialog) in `frontend/components/ui/`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Add a New Task (Priority: P1) 🎯 MVP

**Goal**: A signed-in user can create a new task with a required title (1–200 chars) and optional description (≤1000 chars)

**Independent Test**: Open the task screen, submit a task with a title only, confirm it appears in the list with incomplete status (spec.md US1)

### Tests for User Story 1

- [ ] T013 [P] [US1] Component test for `TaskForm` validation (empty title rejected, 200/1000-char boundaries accepted) in `frontend/tests/unit/TaskForm.test.tsx`
- [ ] T014 [P] [US1] Playwright e2e test covering US1 Acceptance Scenarios 1–3 in `frontend/tests/e2e/add-task.spec.ts`

### Implementation for User Story 1

- [ ] T015 [US1] Add `createTask(title, description?)` to `frontend/lib/api.ts` (`POST /api/{user_id}/tasks`) per contracts/tasks-api.md (depends on T008, T009)
- [ ] T016 [US1] Implement `TaskForm` component (create mode) with client-side validation matching data-model.md's validation rules in `frontend/components/tasks/TaskForm.tsx` (depends on T007, T012)
- [ ] T017 [US1] Implement create-task mutation in `frontend/hooks/useTasks.ts`, wired to `createTask` (depends on T015, T016)
- [ ] T018 [US1] Add "Add Task" entry point wiring `TaskForm` into `frontend/app/(tasks)/page.tsx` (depends on T016, T017)
- [ ] T019 [US1] Add success/failure feedback for the create action (FR-010, SC-004) in `frontend/components/tasks/TaskForm.tsx` (depends on T016)

**Checkpoint**: User Story 1 is implemented; full end-to-end verification of "appears in the list" depends on Phase 4 (US2) also being done — see Phase 4 checkpoint

---

## Phase 4: User Story 2 - View All My Tasks (Priority: P1)

**Goal**: A signed-in user sees all their tasks with title, completion status, and created date, plus correct empty/loading/error states

**Independent Test**: Load the task screen with a pre-existing set of tasks and confirm every task's title, status, and created date are visible (spec.md US2)

### Tests for User Story 2

- [ ] T020 [P] [US2] Component test for `TaskList` rendering (populated list + empty state) in `frontend/tests/unit/TaskList.test.tsx`
- [ ] T021 [P] [US2] Component test for loading and error states in `frontend/tests/unit/TaskListStates.test.tsx`
- [ ] T022 [P] [US2] Playwright e2e test covering US2 Acceptance Scenarios 1–3 in `frontend/tests/e2e/view-tasks.spec.ts`

### Implementation for User Story 2

- [ ] T023 [US2] Add `listTasks(status?, sort?)` to `frontend/lib/api.ts` (`GET /api/{user_id}/tasks`) per contracts/tasks-api.md (depends on T008, T009)
- [ ] T024 [US2] Implement fetch logic and `TaskListStatus` (`loading`/`error`/`empty`/`ready`) in `frontend/hooks/useTasks.ts` per data-model.md derived view state (depends on T023)
- [ ] T025 [US2] Implement `TaskList` component (title, status, created date, empty state) in `frontend/components/tasks/TaskList.tsx` (FR-001, FR-008) (depends on T007, T024)
- [ ] T026 [US2] Implement `TaskItem` component in `frontend/components/tasks/TaskItem.tsx` (depends on T007)
- [ ] T027 [US2] Wire `TaskList`, loading, and error UI into `frontend/app/(tasks)/page.tsx` as the primary render path (depends on T025, T010, T011)
- [ ] T028 [US2] Compose `TaskForm` (US1) and `TaskList` (US2) on `frontend/app/(tasks)/page.tsx` so newly created tasks are immediately visible (depends on T018, T027)

**Checkpoint**: User Stories 1 AND 2 together are fully functional and independently testable — this is the MVP

---

## Phase 5: User Story 3 - Mark a Task Complete or Incomplete (Priority: P2)

**Goal**: A signed-in user can toggle a task between complete and incomplete

**Independent Test**: Toggle an existing task's completion control and confirm its status visibly flips (spec.md US3)

### Tests for User Story 3

- [ ] T029 [P] [US3] Component test for `CompleteToggle` in `frontend/tests/unit/CompleteToggle.test.tsx`
- [ ] T030 [P] [US3] Playwright e2e test covering US3 Acceptance Scenarios 1–2 in `frontend/tests/e2e/toggle-complete.spec.ts`

### Implementation for User Story 3

- [ ] T031 [US3] Add `toggleTaskComplete(taskId)` to `frontend/lib/api.ts` (`PATCH /api/{user_id}/tasks/{id}/complete`) per contracts/tasks-api.md (depends on T008, T009)
- [ ] T032 [US3] Implement `CompleteToggle` component in `frontend/components/tasks/CompleteToggle.tsx` (depends on T007)
- [ ] T033 [US3] Implement optimistic toggle mutation in `frontend/hooks/useTasks.ts` (depends on T031, T024)
- [ ] T034 [US3] Integrate `CompleteToggle` into `frontend/components/tasks/TaskItem.tsx` (depends on T026, T032, T033)

**Checkpoint**: User Stories 1–3 all work independently and together

---

## Phase 6: User Story 4 - Update Task Details (Priority: P2)

**Goal**: A signed-in user can edit an existing task's title and/or description

**Independent Test**: Edit an existing task's title, save, and confirm the list reflects the new title (spec.md US4)

### Tests for User Story 4

- [ ] T035 [P] [US4] Component test for `TaskForm` edit mode + validation reuse in `frontend/tests/unit/TaskFormEdit.test.tsx`
- [ ] T036 [P] [US4] Playwright e2e test covering US4 Acceptance Scenarios 1–3 in `frontend/tests/e2e/update-task.spec.ts`

### Implementation for User Story 4

- [ ] T037 [US4] Add `updateTask(taskId, { title?, description? })` to `frontend/lib/api.ts` (`PUT /api/{user_id}/tasks/{id}`) per contracts/tasks-api.md (depends on T008, T009)
- [ ] T038 [US4] Extend `TaskForm` to support edit mode (pre-filled values, same validation as US1) in `frontend/components/tasks/TaskForm.tsx` (depends on T016)
- [ ] T039 [US4] Add "Edit" entry point on `TaskItem` opening `TaskForm` in edit mode in `frontend/components/tasks/TaskItem.tsx` (depends on T026, T038)
- [ ] T040 [US4] Implement update mutation in `frontend/hooks/useTasks.ts` (depends on T037, T024)

**Checkpoint**: User Stories 1–4 all work independently and together

---

## Phase 7: User Story 5 - Delete a Task (Priority: P3)

**Goal**: A signed-in user can remove a task they no longer need, with confirmation

**Independent Test**: Delete an existing task and confirm it no longer appears in the list (spec.md US5)

### Tests for User Story 5

- [ ] T041 [P] [US5] Component test for `DeleteTaskDialog` confirm/cancel behavior in `frontend/tests/unit/DeleteTaskDialog.test.tsx`
- [ ] T042 [P] [US5] Playwright e2e test covering US5 Acceptance Scenarios 1–2 in `frontend/tests/e2e/delete-task.spec.ts`

### Implementation for User Story 5

- [ ] T043 [US5] Add `deleteTask(taskId)` to `frontend/lib/api.ts` (`DELETE /api/{user_id}/tasks/{id}`) per contracts/tasks-api.md (depends on T008, T009)
- [ ] T044 [US5] Implement `DeleteTaskDialog` component (confirm/cancel) in `frontend/components/tasks/DeleteTaskDialog.tsx` (depends on T012)
- [ ] T045 [US5] Add "Delete" entry point on `TaskItem` opening `DeleteTaskDialog` in `frontend/components/tasks/TaskItem.tsx` (depends on T026, T044)
- [ ] T046 [US5] Implement delete mutation in `frontend/hooks/useTasks.ts` (depends on T043, T024)

**Checkpoint**: All five user stories are independently functional and work together

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T047 [P] Verify keyboard operability and visible focus states across all components in `frontend/components/tasks/` and `frontend/components/ui/` (FR-011)
- [ ] T048 [P] Verify responsive layout with no horizontal scrolling at a 320px viewport for `frontend/app/(tasks)/page.tsx` (FR-007, SC-003)
- [ ] T049 [P] Verify consistent empty/loading/error visual states and success/error feedback timing across all task actions (FR-009, FR-010, SC-004)
- [ ] T050 Run the quickstart.md 8-step manual golden-path validation end-to-end
- [ ] T051 [P] Verify 401 handling redirects to sign-in per contracts/tasks-api.md's error mapping in `frontend/lib/api.ts`
- [ ] T052 Code cleanup: remove dead code and unused exports across `frontend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational completion
  - US1 (Phase 3) and US2 (Phase 4) are both P1; implement sequentially in that order since US1's Independent Test ("appears in the list") relies on US2's list rendering to observe the result, even though their code is otherwise independent
  - US3, US4, US5 (Phases 5–7) can proceed in any order after Phase 4, in parallel if staffed
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational (Phase 2)
- **US2 (P1)**: Depends only on Foundational (Phase 2); pair with US1 to demo the MVP
- **US3 (P2)**: Depends only on Foundational (Phase 2) and `TaskItem` existing (T026 from US2)
- **US4 (P2)**: Depends only on Foundational (Phase 2), `TaskForm` (T016 from US1), and `TaskItem` (T026 from US2)
- **US5 (P3)**: Depends only on Foundational (Phase 2) and `TaskItem` (T026 from US2)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- API client method before hook mutation
- Hook mutation before component wiring
- Story complete before moving to the next priority (or run in parallel once Foundational + T026 exist)

### Parallel Opportunities

- All Setup tasks marked [P] (T002–T006) can run in parallel after T001
- All Foundational tasks marked [P] (T010–T012) can run in parallel after T007–T009
- All test tasks marked [P] within a story can run in parallel with each other
- Once Phase 4 (US2) completes, US3, US4, and US5 can be worked on in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Launch both tests for User Story 1 together:
Task: "Component test for TaskForm validation in frontend/tests/unit/TaskForm.test.tsx"
Task: "Playwright e2e test for Add a New Task in frontend/tests/e2e/add-task.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Add)
4. Complete Phase 4: User Story 2 (View)
5. **STOP and VALIDATE**: Run quickstart.md steps 1–4 to confirm Add + View work end-to-end
6. Deploy/demo if ready — this is the MVP

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add US1 + US2 → test together → deploy/demo (MVP!)
3. Add US3 (Mark Complete) → test independently → deploy/demo
4. Add US4 (Update) → test independently → deploy/demo
5. Add US5 (Delete) → test independently → deploy/demo
6. Phase 8: Polish → final verification against all FR/SC IDs

### Parallel Team Strategy

With multiple developers, once Phase 4 (US2) is done:

- Developer A: US3 (Mark Complete)
- Developer B: US4 (Update)
- Developer C: US5 (Delete)

All three integrate independently against the same `TaskItem`/`useTasks` foundation.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps each task to its spec.md user story for traceability
- Every task maps to a specific FR-/SC-/US- ID from spec.md, plan.md, or contracts/tasks-api.md — no task was invented without a traceable source
- Verify tests fail before implementing (if TDD is followed)
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- This tasks.md covers the frontend feature (`specs/frontendspecs/`) only — Backend and Database & Authentication features will get their own tasks.md once their spec/plan are written
