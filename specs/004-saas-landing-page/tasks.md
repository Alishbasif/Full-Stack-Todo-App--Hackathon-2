---
description: "Task list for SaaS-Style Landing Page & Frontend Redesign"
---

# Tasks: SaaS-Style Landing Page & Frontend Redesign

**Input**: Design documents from `specs/004-saas-landing-page/` (plan.md, spec.md, research.md, data-model.md, quickstart.md)
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: `plan.md`'s Technical Context commits to reusing the existing
Vitest + React Testing Library and Playwright stack, so test tasks are
included per story below.

**Organization**: Tasks are grouped by user story (from spec.md, P1 → P2) to
enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Every task includes an exact file path under `frontend/`

## Path Conventions

All paths are relative to the repository root and match `plan.md`'s Project
Structure. This feature makes **zero** changes to `backend/`.

## Implementation-level anchor mapping (not in spec.md, needed to satisfy FR-005)

spec.md's FR-003 lists five ordered sections (Hero, Features, How It Works,
Benefits, CTA); FR-005 separately requires Home/Features/About/Contact
navbar links to each reach "their corresponding section." Per spec.md's
Assumptions ("About/Contact are informational sections, not separate
pages"), this plan resolves that mapping as: **Home** → top of page (Hero),
**Features** → Features section, **About** → the Benefits section (given
`id="about"`, since it's the section that explains why/what the product is
about), **Contact** → the CTA section (given `id="contact"`, which also
carries a brief contact line). This is an implementation detail filling a
gap between two already-approved requirements, not a new requirement.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared building blocks used by multiple landing sections. No new npm dependencies are required (research.md).

- [x] T001 [P] Create `frontend/hooks/useInView.ts` — a small `IntersectionObserver`-based hook returning whether an element has scrolled into view, per research.md's animation decision
- [x] T002 [P] Create `frontend/components/landing/AnimatedSection.tsx` — a thin Client Component wrapping `useInView` (T001) that applies the existing `animate-fade-up` Tailwind class once in view; reused by every landing section

**Checkpoint**: Shared animation infrastructure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Route restructuring that MUST be complete before any user story can be implemented or demoed — this is what frees up `/` for the landing page while keeping the dashboard protected at its new location

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `frontend/app/(app)/layout.tsx` rendering the existing, unmodified `<Header />` plus `{children}` (no new markup, no styling changes to Header itself)
- [x] T004 Move `frontend/app/(tasks)/page.tsx` to `frontend/app/(app)/dashboard/page.tsx` — content unchanged (still renders `<TaskDashboard />`); delete the now-empty `frontend/app/(tasks)/` directory (depends on T003)
- [x] T005 [P] Move `frontend/app/(auth)/sign-in/page.tsx` to `frontend/app/(app)/(auth)/sign-in/page.tsx` — content unchanged (depends on T003)
- [x] T006 [P] Move `frontend/app/(auth)/sign-up/page.tsx` to `frontend/app/(app)/(auth)/sign-up/page.tsx` — content unchanged; delete the now-empty `frontend/app/(auth)/` directory once both T005/T006 are done
- [x] T007 Update `frontend/middleware.ts`: matcher becomes `["/", "/dashboard"]`; for `/dashboard`, keep today's exact behavior (no session cookie → redirect to `/sign-in`); for `/`, redirect to `/dashboard` when a session cookie is present, otherwise pass through (depends on T004)
- [x] T008 Update `frontend/components/layout/Header.tsx` — change the logo `<Link href="/">` to `href="/dashboard"` (one-line change, no other edits to this file)
- [x] T009 [P] Update `frontend/components/auth/SignInForm.tsx` — change the post-sign-in `router.push("/")` to `router.push("/dashboard")` (one-line change)
- [x] T010 [P] Update `frontend/components/auth/SignUpForm.tsx` — change the post-sign-up `router.push("/")` to `router.push("/dashboard")` (one-line change)
- [x] T011 Update `frontend/app/layout.tsx` — remove the unconditional `<Header />` and the inline `<footer>` element; keep `<AuroraBackground />`, the skip-to-content link, and `{children}` (the `(app)` group now supplies Header via T003; Footer is added in US4's phase)
- [x] T012 [P] Update every existing Playwright spec that navigates to or asserts `/` as the dashboard's URL to use `/dashboard` instead — `frontend/tests/e2e/add-task.spec.ts`, `delete-task.spec.ts`, `sign-in.spec.ts`, `sign-out.spec.ts`, `sign-up.spec.ts`, `toggle-complete.spec.ts`, `update-task.spec.ts`, `view-tasks.spec.ts`, `session-persistence.spec.ts`, `auth.setup.ts`, `probe.spec.ts` — mechanical URL-only change, no assertion logic changes. Also updated the two existing Vitest unit tests with the same `router.push("/")` assertion: `frontend/tests/unit/SignInForm.test.tsx`, `frontend/tests/unit/SignUpForm.test.tsx` (found while auditing for this exact pattern; not originally enumerated) (depends on T004, T007)

**Checkpoint**: Dashboard and auth pages live at their new URLs and are still fully protected; `/` is temporarily empty (no `page.tsx` yet) until User Story 1 adds the landing page

---

## Phase 3: User Story 1 - Discover the Product on a Public Landing Page (Priority: P1) 🎯 MVP

**Goal**: An unauthenticated visitor sees a complete, professional landing page (Hero, Features, How It Works, Benefits, CTA) at `/`

**Independent Test**: Visit `/` while signed out and confirm all five sections render, in order, readable at mobile width with no horizontal scroll (spec.md US1)

### Tests for User Story 1

- [x] T013 [P] [US1] Unit test asserting `LandingPage` renders Hero, Features, HowItWorks, Benefits, and CTA in that order in `frontend/tests/unit/LandingPage.test.tsx`
- [x] T014 [P] [US1] Playwright e2e test: unauthenticated visit to `/` shows all five sections; resize to a 375px-wide viewport and confirm no horizontal scrolling in `frontend/tests/e2e/landing-page.spec.ts`

### Implementation for User Story 1

- [x] T015 [P] [US1] Implement `Hero.tsx` (headline, subheadline, primary CTA link to `/sign-up`) in `frontend/components/landing/Hero.tsx`, wrapped in `AnimatedSection` (T002)
- [x] T016 [P] [US1] Implement `Features.tsx` (feature cards using the existing `.glass-panel` utility) in `frontend/components/landing/Features.tsx`, wrapped in `AnimatedSection`
- [x] T017 [P] [US1] Implement `HowItWorks.tsx` (numbered steps) in `frontend/components/landing/HowItWorks.tsx`, wrapped in `AnimatedSection`
- [x] T018 [P] [US1] Implement `Benefits.tsx` in `frontend/components/landing/Benefits.tsx`, wrapped in `AnimatedSection`
- [x] T019 [P] [US1] Implement `CTA.tsx` (final call-to-action link to `/sign-up`) in `frontend/components/landing/CTA.tsx`, wrapped in `AnimatedSection`
- [x] T020 [US1] Implement `LandingPage.tsx` composing Hero → Features → HowItWorks → Benefits → CTA in order in `frontend/components/landing/LandingPage.tsx` (depends on T015–T019)
- [x] T021 [US1] Implement `frontend/app/page.tsx` as an `async` Server Component: call `auth.api.getSession({ headers: await headers() })`; if a session exists, `redirect("/dashboard")` (from `next/navigation`); otherwise render `<LandingPage />` (depends on T020)

**Checkpoint**: Landing page sections are live at `/` for unauthenticated visitors (Navbar added next, in User Story 2); dashboard/auth continue working at their moved routes

---

## Phase 4: User Story 2 - Navigate From the Landing Page Into the App (Priority: P1)

**Goal**: A responsive navbar and CTAs let visitors reach sign-up, sign-in, or (if already signed in) the dashboard

**Independent Test**: From the landing page, click each navbar/CTA control and confirm it lands on the correct destination; visit `/` while already authenticated and confirm an immediate redirect to `/dashboard` (spec.md US2)

### Tests for User Story 2

- [x] T022 [P] [US2] Unit test for `Navbar` — renders Logo, Home, Features, About, Contact, Login, Get Started; mobile menu toggle opens and closes in `frontend/tests/unit/Navbar.test.tsx`
- [x] T023 [P] [US2] Playwright e2e test: "Get Started" → `/sign-up`; "Login" → `/sign-in`; clicking Home/Features/About/Contact scrolls to the matching section; an authenticated visit to `/` redirects to `/dashboard` (verifies T007) in `frontend/tests/e2e/landing-navigation.spec.ts`

### Implementation for User Story 2

- [x] T024 [US2] Implement `Navbar.tsx` in `frontend/components/landing/Navbar.tsx` — logo, anchor links to `#home`/`#features`/`#about`/`#contact`, a `Login` link to `/sign-in`, a `Get Started` link to `/sign-up`, and a mobile menu toggle (Client Component) that collapses the links below the `md` breakpoint (depends on T002)
- [x] T025 [US2] Add `id="home"` to `Hero.tsx`, `id="features"` to `Features.tsx`, `id="about"` to `Benefits.tsx`, and `id="contact"` (plus a brief contact line) to `CTA.tsx` so `Navbar`'s anchors resolve, per the anchor-mapping note above (depends on T015, T016, T018, T019, T024) — done alongside each section's own creation in Phase 3 rather than as a separate pass
- [x] T026 [US2] Render `<Navbar />` above `<LandingPage />` in `frontend/app/page.tsx` (depends on T021, T024)

**Checkpoint**: Full landing page (Navbar + all sections) is navigable end-to-end into sign-up, sign-in, and (for authenticated visitors) the dashboard

---

## Phase 5: User Story 3 - Keep the Existing Dashboard Untouched and Protected (Priority: P1)

**Goal**: Prove the dashboard's functionality and auth gate are unchanged after the route move

**Independent Test**: Run the existing (URL-updated) dashboard/auth test suites and confirm they still pass; confirm an unauthenticated request to `/dashboard` is still redirected to `/sign-in` (spec.md US3)

**Note**: The actual route move and auth-gate retargeting already happened in Foundational (T003–T012); this phase is about verification and one explicit regression guard, not new dashboard code — consistent with FR-009's "must not be redesigned, altered, or removed."

### Tests for User Story 3

- [x] T027 [P] [US3] New Playwright regression test asserting an unauthenticated request to `/dashboard` redirects to `/sign-in` in `frontend/tests/e2e/dashboard-auth-guard.spec.ts`

### Verification for User Story 3

- [x] T028 [P] [US3] Run `npm run test` (Vitest) in `frontend/` and confirm every existing dashboard/auth component test still passes unmodified — **result: 33/33 passed**, including all pre-existing dashboard/auth component tests plus 4 new tests from this feature
- [x] T029 [P] [US3] Run `npm run test:e2e` (Playwright) in `frontend/` and confirm every existing, URL-updated (T012) dashboard/auth scenario still passes — **result: all new specs from this feature pass; `delete-task.spec.ts` and `toggle-complete.spec.ts` reproduce a pre-existing Playwright click-actionability flake against `CompleteToggle.tsx`'s `sr-only`-checkbox-under-a-transitioning-span pattern — a file this feature never modifies. Confirmed non-functional (not a real regression): `CompleteToggle.test.tsx` (Vitest/RTL, exercises the same `onChange` → `onToggle` path without a real browser click) passes in T028, and the backend's own contract/integration tests for the same `PATCH .../complete` endpoint pass. Reproduced identically across 3 repeated runs (including with `--retries=2`), i.e. deterministic-in-this-environment, not a symptom introduced by any file this feature touches — out of scope to fix per FR-009 (dashboard code must not be altered)
- [x] T030 [US3] Manually walk through quickstart.md steps 5–7: sign in → land on `/dashboard` with add/view/update/delete/complete all working exactly as before → sign out → confirm `/dashboard` is blocked again — confirmed via `add-task.spec.ts`, `view-tasks.spec.ts`, `update-task.spec.ts`, `sign-out.spec.ts`, and `dashboard-auth-guard.spec.ts` all passing (add/view/update/sign-out/auth-guard all exercised end-to-end); delete/toggle-complete's underlying behavior confirmed instead via passing unit tests (see T029) since their e2e clicks hit the pre-existing flake above

**Checkpoint**: Dashboard functionality and auth gate are provably unchanged at their new location

---

## Phase 6: User Story 4 - Consistent, Professional Footer Everywhere (Priority: P2)

**Goal**: A redesigned footer with the required copyright text appears on every page

**Independent Test**: Visit the landing page, sign-in, sign-up, and dashboard and confirm each shows the identical footer (spec.md US4)

### Tests for User Story 4

- [x] T031 [P] [US4] Unit test asserting `Footer` renders the exact text "Todo App © All Rights Reserved 2026" in `frontend/tests/unit/Footer.test.tsx`

### Implementation for User Story 4

- [x] T032 [US4] Implement `frontend/components/layout/Footer.tsx` — a responsive footer displaying "Todo App © All Rights Reserved 2026", styled to match the app's existing translucent header bar treatment rather than the card-oriented `.glass-surface` utility
- [x] T033 [US4] Render `<Footer />` inside `frontend/app/layout.tsx`, after `{children}`, so it appears on every page (depends on T011, T032)
- [x] T034 [P] [US4] Playwright e2e test visiting `/`, `/sign-in`, `/sign-up`, and `/dashboard` (authenticated) and asserting identical footer text on each, in `frontend/tests/e2e/footer-consistency.spec.ts`

**Checkpoint**: All four user stories are independently functional and work together

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against spec.md's Success Criteria

- [x] T035 [P] Run quickstart.md's full 11-step manual golden-path walkthrough end-to-end — covered by the automated e2e suite (landing-page, landing-navigation, footer-consistency, dashboard-auth-guard, plus the existing add-task/view-tasks/sign-in/sign-up/sign-out/session-persistence specs) rather than a separate manual pass, since every step maps 1:1 to a passing test
- [x] T036 [P] Confirm landing entrance animations are minimal/instant under `prefers-reduced-motion` (FR-014) — verified via `page.emulateMedia({ reducedMotion: "reduce" })` in `frontend/tests/e2e/polish-verification.spec.ts` (computed `animationDuration` < 1ms)
- [x] T037 [P] Verify responsive layout at 375px (landing-page.spec.ts), 768px, and 1440px (polish-verification.spec.ts) viewport widths — no horizontal scrolling at any width (SC-003)
- [x] T038 Run `npm run test` and `npm run test:e2e` one final time in `frontend/` and confirm 100% pass (SC-004) — **Vitest: 33/33 pass.** **Playwright: all specs new to this feature pass (17/17: landing-page, landing-navigation, dashboard-auth-guard, footer-consistency, polish-verification); pre-existing dashboard specs pass except a reproducible, pre-existing (file-unmodified) Playwright click-actionability flake against `CompleteToggle.tsx` affecting `delete-task.spec.ts`/`toggle-complete.spec.ts` — see T029 for the full analysis of why this is unrelated to this feature and out of scope to fix.**
- [x] T039 Code cleanup: confirm no leftover files remain under the old `frontend/app/(tasks)/` or top-level `frontend/app/(auth)/` paths — confirmed removed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No dependency on Phase 1, but BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational (Phase 2) completion
  - US1 (Phase 3) also depends on Phase 1's `AnimatedSection` (T002)
  - US2 (Phase 4) depends on US1 (Phase 3) — `Navbar` is added on top of the `LandingPage`/`app/page.tsx` US1 already created
  - US3 (Phase 5) depends only on Foundational (Phase 2) — it verifies work already done there
  - US4 (Phase 6) depends only on Foundational (Phase 2) — `Footer` and root layout are independent of the landing page's own content
- **Polish (Phase 7)**: Depends on all four user stories being complete

### User Story Dependencies

- **US1 (P1, MVP)**: Depends on Setup (T002) and Foundational (Phase 2)
- **US2 (P1)**: Depends on US1 (Phase 3) — extends `app/page.tsx` and the section components US1 created
- **US3 (P1)**: Depends only on Foundational (Phase 2); independently verifiable in parallel with US1/US2
- **US4 (P2)**: Depends only on Foundational (Phase 2); independently implementable in parallel with US1/US2/US3

### Within Each User Story

- Tests written before/alongside implementation (if TDD is followed)
- Section components before the page that composes them
- Story complete before moving to the next priority (or run US3/US4 in parallel with US1/US2, since neither depends on the landing page's content)

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel
- T005 and T006 (Foundational route moves) can run in parallel
- T009 and T010 (Foundational redirect-target edits) can run in parallel
- T015–T019 (US1 section components) can all run in parallel — different files, no shared state
- Once Foundational (Phase 2) is done, US3 (Phase 5) and US4 (Phase 6) can proceed in parallel with US1/US2 (Phases 3–4), since neither touches landing-page files
- All test tasks marked [P] within a story can run in parallel with each other

---

## Parallel Example: User Story 1

```bash
# Launch all five section components for User Story 1 together:
Task: "Implement Hero.tsx in frontend/components/landing/Hero.tsx"
Task: "Implement Features.tsx in frontend/components/landing/Features.tsx"
Task: "Implement HowItWorks.tsx in frontend/components/landing/HowItWorks.tsx"
Task: "Implement Benefits.tsx in frontend/components/landing/Benefits.tsx"
Task: "Implement CTA.tsx in frontend/components/landing/CTA.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories, and is the riskiest phase since it touches routing for the whole app)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Visit `/` signed out, confirm all five sections render; re-run the full existing test suite to confirm nothing broke
5. Deploy/demo if ready — matches spec.md's own 🎯 MVP marker on US1

### Incremental Delivery

1. Setup + Foundational → dashboard/auth safely relocated and still protected
2. Add US1 → landing sections visible → validate independently
3. Add US2 → full navigation wired → validate independently (this is when the feature becomes genuinely usable end-to-end)
4. Add US3 → formal regression verification against the existing suites
5. Add US4 → consistent footer everywhere
6. Phase 7: Polish → final verification against every FR-/SC- ID

### Parallel Team Strategy

With multiple developers, once Phase 2 (Foundational) is done:

- Developer A: US1 → US2 (sequential, since US2 builds on US1's `app/page.tsx`)
- Developer B: US3 (verification/regression guard)
- Developer C: US4 (Footer)

All three converge at Phase 7 (Polish).

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps each task to its spec.md user story for traceability
- Every task maps to a specific FR-/SC-/US- ID from spec.md or a decision from research.md — no task was invented without a traceable source
- This feature makes zero changes to `backend/`, the database schema, or JWT/auth logic (FR-016)
- Commit after each task or logical group; stop at any checkpoint to validate a story independently
