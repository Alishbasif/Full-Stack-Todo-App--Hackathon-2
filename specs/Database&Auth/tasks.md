---
description: "Task list for Account Creation and Authenticated Sessions (database + auth)"
---

# Tasks: Account Creation and Authenticated Sessions

**Input**: Design documents from `specs/Database&Auth/` (plan.md, spec.md, data-model.md, contracts/auth-endpoints.md, research.md, quickstart.md)
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Note**: This feature's docs live in `specs/Database&Auth/` rather than
`specs/003-database-auth/` (named this way per explicit user request when
`/sp.specify` ran, matching the `frontendspecs`/`backendspecs` convention).
The git branch remains `003-database-auth`.

**Tests**: `plan.md`'s Technical Context explicitly commits to reusing the
Frontend feature's already-installed Vitest + React Testing Library and
Playwright stack for this feature, so test tasks are included per story
below.

**Organization**: Tasks are grouped by user story (from spec.md, P1 → P2) to
enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Every task includes an exact file path under `frontend/`

## Path Conventions

All paths are relative to the repository root and match `plan.md`'s Project
Structure: `frontend/lib/`, `frontend/app/api/auth/`,
`frontend/app/(auth)/`, `frontend/components/auth/`, `frontend/middleware.ts`,
`frontend/tests/unit/`, `frontend/tests/e2e/`. This feature makes **zero**
changes to `backend/` (already implemented and unchanged).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install Better Auth and provision its schema on the shared Neon database, per plan.md's Technical Context

- [ ] T001 Install the `better-auth` npm dependency in `frontend/package.json`
- [ ] T002 [P] Configure `frontend/.env.local` with `BETTER_AUTH_SECRET` (copied verbatim from `backend/.env` — never regenerated), `BETTER_AUTH_URL`, and `DATABASE_URL` per quickstart.md
- [ ] T003 Generate Better Auth's `user`/`session`/`account`/`verification` schema via `npx @better-auth/cli generate` in `frontend/` (depends on T001)
- [ ] T004 Apply the generated schema to the shared Neon database via `npx @better-auth/cli migrate` (depends on T002, T003)
- [ ] T005 [P] Verify the Frontend feature's existing Vitest/Playwright configuration picks up new `frontend/tests/unit/` and `frontend/tests/e2e/` auth test files with no additional config changes

**Checkpoint**: Better Auth installed, schema applied to Neon, environment configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Implement the Better Auth server instance in `frontend/lib/auth.ts` — email/password provider, JWT plugin (HS256, `BETTER_AUTH_SECRET`, 7-day expiry per FR-008/SC-006), Postgres adapter pointed at `DATABASE_URL` — per research.md (depends on T004)
- [ ] T007 Implement the Better Auth React client (`signUp`, `signIn`, `signOut`, `useSession`) in `frontend/lib/auth-client.ts` (depends on T006)
- [ ] T008 Mount Better Auth's catch-all route handler in `frontend/app/api/auth/[...all]/route.ts` (depends on T006)
- [ ] T009 [P] Create the `frontend/app/(auth)/` route group layout (shell only, no auth logic yet), mirroring the existing `(tasks)` route group's pattern

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Create an Account (Sign Up) (Priority: P1) 🎯 MVP

**Goal**: A new visitor can create an account with an email and password (and optional name) and is signed in immediately afterward

**Independent Test**: Submit a new email and a valid password and confirm an account is created and the visitor is signed in immediately afterward (spec.md US1)

### Tests for User Story 1

- [ ] T010 [P] [US1] Component test for `SignUpForm` validation (malformed email rejected, weak password rejected, valid submission calls `authClient.signUp.email`) in `frontend/tests/unit/SignUpForm.test.tsx`
- [ ] T011 [P] [US1] Playwright e2e test covering US1 Acceptance Scenarios 1–4 in `frontend/tests/e2e/sign-up.spec.ts`

### Implementation for User Story 1

- [ ] T012 [US1] Implement `SignUpForm` component (email, password, optional name; client-side validation matching data-model.md's rules) in `frontend/components/auth/SignUpForm.tsx` (depends on T007)
- [ ] T013 [US1] Implement `frontend/app/(auth)/sign-up/page.tsx` wiring `SignUpForm` into the `(auth)` route group (depends on T009, T012)
- [ ] T014 [US1] Surface duplicate-email (FR-002, US1 Scenario 3) and validation (FR-003/FR-004, US1 Scenario 4) errors from `contracts/auth-endpoints.md`'s sign-up response in `SignUpForm.tsx` (depends on T012)

**Checkpoint**: User Story 1 is implemented and independently testable — a new visitor can create an account and land signed in

---

## Phase 4: User Story 2 - Sign In to My Account (Priority: P1)

**Goal**: A registered user can sign in with their email and password to access their own tasks

**Independent Test**: Submit the email and password of an existing account and confirm the user is granted access and issued a usable credential (spec.md US2)

### Tests for User Story 2

- [ ] T015 [P] [US2] Component test for `SignInForm` (incorrect credentials show one generic message) in `frontend/tests/unit/SignInForm.test.tsx`
- [ ] T016 [P] [US2] Playwright e2e test covering US2 Acceptance Scenarios 1–2 in `frontend/tests/e2e/sign-in.spec.ts`

### Implementation for User Story 2

- [ ] T017 [US2] Implement `SignInForm` component in `frontend/components/auth/SignInForm.tsx` (depends on T007)
- [ ] T018 [US2] Implement `frontend/app/(auth)/sign-in/page.tsx` wiring `SignInForm` into the `(auth)` route group (depends on T009, T017)
- [ ] T019 [US2] Surface the generic incorrect-credentials error (FR-006, US2 Scenario 2) in `SignInForm.tsx`, never distinguishing which field was wrong (depends on T017)

**Checkpoint**: User Stories 1 AND 2 together are fully functional — a user can create an account and sign back in

---

## Phase 5: User Story 3 - Stay Authenticated Across Requests (Priority: P1)

**Goal**: A signed-in user's identity stays verified across every subsequent action, including requests to the already-built task-management API, without re-entering credentials

**Independent Test**: Sign in once, then make several separate subsequent requests (reload, view/manage tasks) and confirm none require signing in again, while a request with no credential or an expired one is rejected (spec.md US3)

**Note**: This is the load-bearing story — the already-built Backend feature was implemented anticipating exactly this contract (HS256, shared secret, `sub` = account id). `frontend/lib/api.ts`'s existing `getAuthToken()`/`getCurrentUserId()` dev-only `localStorage` stubs are replaced here with real values; every other line in `lib/api.ts` (the `Authorization: Bearer <token>` attachment, `{user_id}` path construction) was already written against this exact shape and needs no further change.

### Tests for User Story 3

- [ ] T020 [P] [US3] Integration test: session persists across a simulated reload (`useSession`/`get-session`) in `frontend/tests/unit/SessionPersistence.test.tsx`
- [ ] T021 [P] [US3] Playwright e2e test covering US3 Acceptance Scenarios 1–3, including a call to the already-built task API with the issued credential, in `frontend/tests/e2e/session-persistence.spec.ts`

### Implementation for User Story 3

- [ ] T022 [US3] Confirm Better Auth's actual JWT-retrieval mechanism for the installed version and update `specs/Database&Auth/contracts/auth-endpoints.md`'s "open implementation detail" note with the real answer (depends on T006)
- [ ] T023 [US3] Replace `getAuthToken()`'s dev-only `localStorage` stub with the real JWT from the session established in T022, in `frontend/lib/api.ts` (depends on T022)
- [ ] T024 [US3] Replace `getCurrentUserId()`'s dev-only `localStorage` stub with the real signed-in account id from the session, in `frontend/lib/api.ts` (depends on T022)
- [ ] T025 [US3] Implement `frontend/middleware.ts` redirecting unauthenticated or expired-session requests for the `(tasks)` route group to `/sign-in` (US3 Scenario 3) (depends on T006)

**Checkpoint**: User Stories 1–3 all work together — a signed-in user stays recognized everywhere, including by the already-built task API

---

## Phase 6: User Story 4 - Sign Out (Priority: P2)

**Goal**: A signed-in user can sign out, ending their session

**Independent Test**: Sign in, then sign out, and confirm further authenticated actions are refused until signing in again (spec.md US4)

### Tests for User Story 4

- [ ] T026 [P] [US4] Component test for `SignOutButton` in `frontend/tests/unit/SignOutButton.test.tsx`
- [ ] T027 [P] [US4] Playwright e2e test covering US4 Acceptance Scenario 1 in `frontend/tests/e2e/sign-out.spec.ts`

### Implementation for User Story 4

- [ ] T028 [US4] Implement `SignOutButton` component calling `authClient.signOut` in `frontend/components/auth/SignOutButton.tsx` (depends on T007)
- [ ] T029 [US4] Wire `SignOutButton` into the existing task-screen header/nav (`frontend/components/layout/Header.tsx`, from the Frontend feature) (depends on T028)
- [ ] T030 [US4] Confirm `middleware.ts` refuses further access to the `(tasks)` route group immediately after sign-out (depends on T025, T028)

**Checkpoint**: All four user stories are independently functional and work together

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T031 [P] Run the quickstart.md 7-step golden-path validation end-to-end, including the cross-check against the already-built Backend feature's own quickstart
- [ ] T032 [P] Verify no response from any auth endpoint ever includes a password field (FR-010) by inspecting `SignUpForm`/`SignInForm` network calls
- [ ] T033 [P] Verify keyboard operability and visible focus states for `SignUpForm`, `SignInForm`, `SignOutButton` per Constitution II
- [ ] T034 Verify responsive layout of the `(auth)` pages at a 320px viewport, matching the Frontend feature's own FR-007 standard
- [ ] T035 Code cleanup: remove the now-fully-replaced dev-only stub comments in `frontend/lib/api.ts`; remove dead code across `frontend/lib/auth*.ts` and `frontend/components/auth/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational completion
  - US1 (Phase 3), US2 (Phase 4), and US3 (Phase 5) are all P1; implement sequentially in that order — US2's Independent Test needs an existing account (naturally produced by US1), and US3's own tests (session persists, task API accepts the credential) need a signed-in session from US1/US2 to observe.
  - US4 (Phase 6) depends on US1/US2 (needs a signed-in session to sign out of) and on US3's `middleware.ts` (T025) to verify sign-out actually revokes access
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational (Phase 2)
- **US2 (P1)**: Depends only on Foundational (Phase 2); pair with US1 to demo account creation + return sign-in
- **US3 (P1)**: Depends on Foundational (Phase 2) and on US1/US2 producing a signed-in session to observe persistence against; also depends on the already-built Backend feature (`specs/backendspecs/`, already implemented) to verify cross-service credential acceptance
- **US4 (P2)**: Depends on Foundational (Phase 2), US1/US2 (a session to sign out of), and US3's `middleware.ts` (T025)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Auth-client wiring before form component
- Form component before page wiring
- Story complete before moving to the next priority (or run in parallel once Foundational is done, for stories without cross-dependencies)

### Parallel Opportunities

- All Setup tasks marked [P] (T002, T005) can run in parallel after T001/T003/T004
- T009 (Foundational) can run in parallel with T006–T008 once T006 exists
- All test tasks marked [P] within a story can run in parallel with each other
- US1 and US2's component/page implementation tasks can be worked on in parallel by different developers once Foundational is done, converging before US3

---

## Parallel Example: User Story 1

```bash
# Launch both tests for User Story 1 together:
Task: "Component test for SignUpForm in frontend/tests/unit/SignUpForm.test.tsx"
Task: "Playwright e2e test for Create an Account in frontend/tests/e2e/sign-up.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 + 3 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Sign Up)
4. Complete Phase 4: User Story 2 (Sign In)
5. Complete Phase 5: User Story 3 (Stay Authenticated) — required before this feature is actually useful, since it's what connects sign-up/sign-in to the rest of the application
6. **STOP and VALIDATE**: Run quickstart.md steps 1–3 and 6–7 to confirm sign-up, persistence, and cross-service credential acceptance work end-to-end
7. Deploy/demo if ready — this is the MVP; the whole Phase II application (frontend + backend + auth) is now fully functional together

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add US1 + US2 + US3 → test together → deploy/demo (MVP — full Phase II app works end-to-end!)
3. Add US4 (Sign Out) → test independently → deploy/demo
4. Phase 7: Polish → final verification against all FR/SC IDs

### Parallel Team Strategy

With multiple developers, once Phase 2 (Foundational) is done:

- Developer A: US1 (Sign Up)
- Developer B: US2 (Sign In)

Both converge before US3 (Stay Authenticated), since US3 needs both flows to exist to verify persistence across them. US4 (Sign Out) can start once US3's `middleware.ts` exists.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps each task to its spec.md user story for traceability
- Every task maps to a specific FR-/SC-/US- ID from spec.md, plan.md, or contracts/auth-endpoints.md — no task was invented without a traceable source
- Verify tests fail before implementing (if TDD is followed)
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- This tasks.md covers the Database & Authentication feature (`specs/Database&Auth/`) only, and completing it finishes all three Phase II features (Frontend, Backend, Database & Authentication)
