---
description: "Task list for Todo Task Management REST API (backend)"
---

# Tasks: Todo Task Management REST API

**Input**: Design documents from `specs/backendspecs/` (plan.md, spec.md, data-model.md, contracts/tasks-api.md, research.md, quickstart.md)
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Note**: This feature's docs live in `specs/backendspecs/` rather than
`specs/002-todo-backend/` (renamed per user request after `/sp.plan`, to
match the Frontend feature's `specs/frontendspecs/` convention). The git
branch remains `002-todo-backend`.

**Tests**: `plan.md`'s Project Structure and `research.md` explicitly commit
to pytest + httpx (contract, integration, and unit tests) as this feature's
testing stack, so test tasks are included per story below.

**Organization**: Tasks are grouped by user story (from spec.md, P1 → P3) to
enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6)
- Every task includes an exact file path under `backend/`

## Path Conventions

All paths are relative to the repository root and match `plan.md`'s Project
Structure: `backend/app/routes/`, `backend/app/services/`,
`backend/app/repositories/`, `backend/app/db/`, `backend/app/core/`,
`backend/app/schemas/`, `backend/alembic/`, `backend/tests/contract/`,
`backend/tests/integration/`, `backend/tests/unit/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the FastAPI backend project per plan.md's Technical Context

- [X] T001 Initialize Python 3.12+ project in `backend/` with FastAPI, SQLModel, Uvicorn, PyJWT, Alembic, pytest, and httpx dependencies (`backend/pyproject.toml`)
- [X] T002 [P] Configure the Alembic migration environment in `backend/alembic/env.py` and `backend/alembic.ini`
- [X] T003 [P] Configure pytest and the `backend/tests/{unit,contract,integration}/` directory structure
- [X] T004 [P] Configure linting/formatting for `backend/` per research.md conventions
- [X] T005 [P] Create `backend/.env.example` documenting `DATABASE_URL` and `BETTER_AUTH_SECRET` per quickstart.md

**Checkpoint**: Backend project scaffolded, buildable, and testable (empty test suites pass)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create the `Task` SQLModel model in `backend/app/db/models.py` per data-model.md (`id`, `user_id` FK, `title`, `description`, `completed`, `created_at`, `updated_at`) with indexes on `user_id` and `completed`
- [X] T007 Generate the initial Alembic migration for the `tasks` table in `backend/alembic/versions/` (depends on T006)
- [X] T008 [P] Implement the DB engine/session factory in `backend/app/db/session.py`, reading `DATABASE_URL` from the environment (Constitution IV)
- [X] T009 [P] Implement the environment configuration loader (`DATABASE_URL`, `BETTER_AUTH_SECRET`) in `backend/app/core/config.py`
- [X] T010 Implement the `get_current_user_id` JWT verification dependency (PyJWT, HS256, verifies against `BETTER_AUTH_SECRET`; raises `401` for a missing/invalid/expired token) in `backend/app/core/security.py` per research.md (depends on T009)
- [X] T011 [P] Create `Task` request/response Pydantic schemas (`TaskCreate`, `TaskUpdate`, `TaskRead`) in `backend/app/schemas/task.py` per data-model.md
- [X] T012 [P] Create the FastAPI app entry point in `backend/app/main.py`, mounting the (initially empty) tasks router
- [X] T013 Implement structured, non-leaking error-response handling (`HTTPException` → `{"detail": ...}` shape; FR-012) in `backend/app/main.py` (depends on T012)

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Create a Task (Priority: P1) 🎯 MVP

**Goal**: An authenticated client can create a new task with a required title (1–200 chars) and optional description (≤1000 chars)

**Independent Test**: Submit a task-creation request with a valid title on behalf of an authenticated user and confirm the task is retrievable in a subsequent request, incomplete, with a created timestamp (spec.md US1)

### Tests for User Story 1

- [X] T014 [P] [US1] Contract test for `POST /api/{user_id}/tasks` in `backend/tests/contract/test_create_task.py` per contracts/tasks-api.md
- [X] T015 [P] [US1] Integration test covering US1 Acceptance Scenarios 1–3 in `backend/tests/integration/test_create_task.py`

### Implementation for User Story 1

- [X] T016 [US1] Implement `create` in `backend/app/repositories/task_repository.py` (depends on T006, T008)
- [X] T017 [US1] Implement create validation (title 1–200 chars, description ≤1000 chars, FR-007) in `backend/app/services/task_service.py` (depends on T011, T016)
- [X] T018 [US1] Implement `POST /api/{user_id}/tasks` route using `get_current_user_id` in `backend/app/routes/tasks.py` (depends on T010, T017)
- [X] T019 [US1] Wire the tasks router into `backend/app/main.py` (depends on T018)

**Checkpoint**: User Story 1 is implemented; full end-to-end verification of "retrievable in a subsequent request" depends on Phase 4 (US2) also being done — see Phase 4 checkpoint

---

## Phase 4: User Story 2 - Retrieve Tasks (List and Single) (Priority: P1)

**Goal**: An authenticated client can retrieve the full list of a user's tasks or a single task's details

**Independent Test**: Create one or more tasks, request the full task list and confirm every task is present, then request a single task by ID and confirm its full details are returned (spec.md US2)

### Tests for User Story 2

- [X] T020 [P] [US2] Contract test for `GET /api/{user_id}/tasks` in `backend/tests/contract/test_list_tasks.py`
- [X] T021 [P] [US2] Contract test for `GET /api/{user_id}/tasks/{id}` in `backend/tests/contract/test_get_task.py`
- [X] T022 [P] [US2] Integration test covering US2 Acceptance Scenarios 1–3 (including empty-list and not-found) in `backend/tests/integration/test_retrieve_tasks.py`

### Implementation for User Story 2

- [X] T023 [US2] Implement `list` and `get_by_id` in `backend/app/repositories/task_repository.py`, both scoped by `user_id` (depends on T016)
- [X] T024 [US2] Implement list/get service logic, including empty-list and not-found handling (FR-011), in `backend/app/services/task_service.py` (depends on T023)
- [X] T025 [US2] Implement `GET /api/{user_id}/tasks` and `GET /api/{user_id}/tasks/{id}` routes in `backend/app/routes/tasks.py` (depends on T024)

**Checkpoint**: User Stories 1 AND 2 together are fully functional and independently testable — this is the MVP

---

## Phase 5: User Story 3 - Enforce Per-User Data Isolation and Authenticated Access (Priority: P1)

**Goal**: Every request is authenticated and scoped to the correct user; tasks are never accessible across user boundaries, regardless of what identifier a request references

**Independent Test**: Call every operation built so far (create, list, get) without a credential and confirm each is rejected with `401`; then, using a valid credential for User A, attempt to access or act on data addressed under User B's identifier and confirm it is refused as `404`, never as successful (spec.md US3)

**Note**: The core `get_current_user_id` dependency (401 for missing/invalid token) was already built in Phase 2, since literally every operation requires it from the start. This phase adds the `{user_id}`-path-vs-token-identity mismatch check (404, not 403 — see research.md) and wires it into the routes that exist so far. US4–US6 reuse this same dependency unchanged, so isolation coverage extends automatically as later stories are added.

### Tests for User Story 3

- [X] T026 [P] [US3] Integration test: every existing operation (create, list, get) without a token returns `401` in `backend/tests/integration/test_auth_required.py`
- [X] T027 [P] [US3] Integration test: a valid token for User A cannot list/create/get under User B's `{user_id}`, or access User B's task — refused as `404` — in `backend/tests/integration/test_user_isolation.py`

### Implementation for User Story 3

- [X] T028 [US3] Implement the `verify_path_user_matches_token` dependency (mismatch → `404`, never `403`, per research.md) in `backend/app/core/security.py` (depends on T010)
- [X] T029 [US3] Apply the isolation dependency to the create/list/get routes in `backend/app/routes/tasks.py` (depends on T018, T025, T028)

**Checkpoint**: User Stories 1–3 all work together; every operation built so far is authenticated and isolated

---

## Phase 6: User Story 4 - Toggle Task Completion (Priority: P2)

**Goal**: An authenticated client can flip a task's completion status

**Independent Test**: Create a task (defaults to incomplete), toggle its completion, confirm a subsequent retrieval reflects the new status, then toggle again and confirm it reverts (spec.md US4)

### Tests for User Story 4

- [X] T030 [P] [US4] Contract test for `PATCH /api/{user_id}/tasks/{id}/complete` in `backend/tests/contract/test_toggle_task.py`
- [X] T031 [P] [US4] Integration test covering US4 Acceptance Scenarios 1–3 in `backend/tests/integration/test_toggle_task.py`

### Implementation for User Story 4

- [X] T032 [US4] Implement `toggle_complete` in `backend/app/repositories/task_repository.py`, scoped by `user_id` (depends on T023)
- [X] T033 [US4] Implement toggle service logic, refreshing `updated_at` (FR-008), in `backend/app/services/task_service.py` (depends on T032)
- [X] T034 [US4] Implement `PATCH /api/{user_id}/tasks/{id}/complete` route with the isolation dependency in `backend/app/routes/tasks.py` (depends on T028, T033)

**Checkpoint**: User Stories 1–4 all work independently and together

---

## Phase 7: User Story 5 - Update Task Details (Priority: P2)

**Goal**: An authenticated client can change an existing task's title and/or description

**Independent Test**: Create a task, submit an update with a new title and/or description, and confirm a subsequent retrieval reflects the change along with an updated timestamp (spec.md US5)

### Tests for User Story 5

- [X] T035 [P] [US5] Contract test for `PUT /api/{user_id}/tasks/{id}` in `backend/tests/contract/test_update_task.py`
- [X] T036 [P] [US5] Integration test covering US5 Acceptance Scenarios 1–3 in `backend/tests/integration/test_update_task.py`

### Implementation for User Story 5

- [X] T037 [US5] Implement `update` in `backend/app/repositories/task_repository.py`, scoped by `user_id` (depends on T023)
- [X] T038 [US5] Implement update validation (FR-007) and `updated_at` refresh in `backend/app/services/task_service.py` (depends on T037)
- [X] T039 [US5] Implement `PUT /api/{user_id}/tasks/{id}` route with the isolation dependency in `backend/app/routes/tasks.py` (depends on T028, T038)

**Checkpoint**: User Stories 1–5 all work independently and together

---

## Phase 8: User Story 6 - Delete a Task (Priority: P3)

**Goal**: An authenticated client can permanently remove a task

**Independent Test**: Create a task, request its deletion, and confirm a subsequent list no longer includes it and a direct retrieval returns "not found" (spec.md US6)

### Tests for User Story 6

- [X] T040 [P] [US6] Contract test for `DELETE /api/{user_id}/tasks/{id}` in `backend/tests/contract/test_delete_task.py`
- [X] T041 [P] [US6] Integration test covering US6 Acceptance Scenarios 1–2 in `backend/tests/integration/test_delete_task.py`

### Implementation for User Story 6

- [X] T042 [US6] Implement `delete` in `backend/app/repositories/task_repository.py`, scoped by `user_id` (depends on T023)
- [X] T043 [US6] Implement delete service logic in `backend/app/services/task_service.py` (depends on T042)
- [X] T044 [US6] Implement `DELETE /api/{user_id}/tasks/{id}` route with the isolation dependency in `backend/app/routes/tasks.py` (depends on T028, T043)

**Checkpoint**: All six user stories are independently functional and work together

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T045 [P] Verify read-after-write consistency (FR-013) across all mutation endpoints in `backend/tests/integration/test_consistency.py`
- [X] T046 [P] Verify structured, non-leaking error responses for every failure mode (401/400/404/500, FR-012) across `backend/app/`
- [X] T047 [P] Verify malformed-body/wrong-type request edge cases are rejected with `400` (spec.md Edge Cases) in `backend/tests/integration/test_validation_edge_cases.py`
- [X] T048 Run the quickstart.md 7-step curl-based golden-path validation end-to-end
- [X] T049 [P] Verify the concurrent-modification edge case (toggle + update on the same task from two sessions) behaves safely per spec.md Edge Cases
- [X] T050 Code cleanup: remove dead code and unused imports across `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–8)**: All depend on Foundational completion
  - US1 (Phase 3), US2 (Phase 4), and US3 (Phase 5) are all P1; implement sequentially in that order — US3's Independent Test ("attempting every operation... refused") requires US1's create and US2's list/get to already exist to have something to call. The core authentication check (401 for missing/invalid token) is built in Foundational since every operation needs it from the start; US3 specifically adds the `{user_id}`-vs-token-identity mismatch check (404) and its dedicated isolation tests.
  - US4, US5, US6 (Phases 6–8) can proceed in any order after Phase 5, in parallel if staffed — each reuses the isolation dependency from T028 unchanged
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational (Phase 2)
- **US2 (P1)**: Depends only on Foundational (Phase 2); pair with US1 to demo the MVP
- **US3 (P1)**: Depends on Foundational (Phase 2) and on US1's create route (T018) and US2's list/get routes (T025) existing to apply the isolation check to
- **US4 (P2)**: Depends only on Foundational (Phase 2), `task_repository`/`task_service` (T023 from US2), and the isolation dependency (T028 from US3)
- **US5 (P2)**: Depends only on Foundational (Phase 2), `task_repository`/`task_service` (T023 from US2), and the isolation dependency (T028 from US3)
- **US6 (P3)**: Depends only on Foundational (Phase 2), `task_repository`/`task_service` (T023 from US2), and the isolation dependency (T028 from US3)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Repository method before service logic
- Service logic before route wiring
- Story complete before moving to the next priority (or run in parallel once Foundational + T023 + T028 exist)

### Parallel Opportunities

- All Setup tasks marked [P] (T002–T005) can run in parallel after T001
- All Foundational tasks marked [P] (T008, T009, T011, T012) can run in parallel after T006/T007
- All test tasks marked [P] within a story can run in parallel with each other
- Once Phase 5 (US3) completes, US4, US5, and US6 can be worked on in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Launch both tests for User Story 1 together:
Task: "Contract test for POST /api/{user_id}/tasks in backend/tests/contract/test_create_task.py"
Task: "Integration test for Create a Task in backend/tests/integration/test_create_task.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 + 3 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Create)
4. Complete Phase 4: User Story 2 (Retrieve)
5. Complete Phase 5: User Story 3 (Isolation) — required before exposing this API to any real client
6. **STOP and VALIDATE**: Run quickstart.md steps 1–3 and 6–7 to confirm Create + Retrieve + isolation work end-to-end
7. Deploy/demo if ready — this is the MVP

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add US1 + US2 + US3 → test together → deploy/demo (MVP!)
3. Add US4 (Toggle Completion) → test independently → deploy/demo
4. Add US5 (Update) → test independently → deploy/demo
5. Add US6 (Delete) → test independently → deploy/demo
6. Phase 9: Polish → final verification against all FR/SC IDs

### Parallel Team Strategy

With multiple developers, once Phase 5 (US3) is done:

- Developer A: US4 (Toggle Completion)
- Developer B: US5 (Update)
- Developer C: US6 (Delete)

All three integrate independently against the same `task_repository`/
`task_service`/isolation-dependency foundation.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps each task to its spec.md user story for traceability
- Every task maps to a specific FR-/SC-/US- ID from spec.md, plan.md, or contracts/tasks-api.md — no task was invented without a traceable source
- Verify tests fail before implementing (if TDD is followed)
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- This tasks.md covers the backend feature (`specs/backendspecs/`) only — Frontend and Database & Authentication features have (or will have) their own tasks.md
