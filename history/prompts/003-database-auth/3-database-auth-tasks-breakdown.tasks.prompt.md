---
id: 3
title: Database and auth tasks breakdown
stage: tasks
date: 2026-08-04
surface: agent
model: claude-sonnet-5
feature: 003-database-auth
branch: 003-database-auth
user: Alishba Asif
command: /sp.tasks
labels: [database, auth, tasks, phase-2, better-auth, jwt]
links:
  spec: specs/Database&Auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/Database&Auth/tasks.md
tests:
 - none (task-breakdown-only stage; no code produced)
---

## Prompt

Create the tasks.md file for database and auth. Use plan.md if needed

## Response snapshot

Ran `check-prerequisites.ps1 -Json` with `SPECIFY_FEATURE=Database&Auth`
set inline (same folder-name-vs-branch-name workaround needed for the two
prior features) — confirmed plan.md, spec.md, plus all optional docs
(research.md, data-model.md, contracts/, quickstart.md) are present.
Generated `tasks.md` with 35 tasks across 7 phases: Setup (T001-005 —
install better-auth, configure the reused `BETTER_AUTH_SECRET`, generate
and apply Better Auth's own schema migration to the shared Neon database),
Foundational (T006-009 — the Better Auth server instance, React client,
route handler, and `(auth)` route-group shell, since literally every story
needs these), US1 Sign Up (T010-014), US2 Sign In (T015-019), US3 Stay
Authenticated (T020-025 — deliberately the most detailed phase, since this
is where `lib/api.ts`'s existing dev-only `getAuthToken()`/
`getCurrentUserId()` stubs get replaced with real values, where the one
open contract detail from `contracts/auth-endpoints.md` — the exact JWT
retrieval mechanism — gets confirmed and documented, and where
`middleware.ts` gets built), US4 Sign Out (T026-030), and Polish (T031-035,
including the cross-feature quickstart validation against the already-built
backend). Test tasks were included per story since plan.md's Technical
Context explicitly commits to reusing the Frontend feature's existing
Vitest/RTL/Playwright stack. Sequenced US1 → US2 → US3 → US4 (documented in
a Dependencies section) since US2's Independent Test needs an account from
US1, US3 needs a signed-in session from either to observe persistence
against, and US4 needs both a session to sign out of and US3's middleware
to verify sign-out actually revokes access. Mirrored the Frontend/Backend
tasks.md files' structure (Dependencies & Execution Order, Parallel
Example, Implementation Strategy) for consistency across all three Phase II
features.

## Outcome

- ✅ Impact: Third and final Phase II feature now has a complete, dependency-ordered task breakdown; completing it finishes the entire Phase II application (Frontend + Backend + Database & Auth) end-to-end.
- 🧪 Tests: none (task-breakdown-only stage)
- 📁 Files: specs/Database&Auth/tasks.md
- 🔁 Next prompts: /sp.implement for 003-database-auth (or /sp.analyze first for cross-artifact consistency across all three features)
- 🧠 Reflection: Making US3 (Stay Authenticated) the most heavily-detailed phase — rather than a thin wrapper — reflects that it's genuinely where this feature's real risk lives: getting the JWT shape wrong here would silently break the already-tested, already-passing backend, so the tasks explicitly call out confirming the contract detail and replacing the exact two stub functions the rest of lib/api.ts already depends on.

## Evaluation notes (flywheel)

- Failure modes observed: none (the SPECIFY_FEATURE workaround and repo-root Set-Location are now an established, repeatable pattern for this repo's renamed-specs-folder convention)
- Graders run and results (PASS/FAIL): n/a (no automated grader for tasks.md structure)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
