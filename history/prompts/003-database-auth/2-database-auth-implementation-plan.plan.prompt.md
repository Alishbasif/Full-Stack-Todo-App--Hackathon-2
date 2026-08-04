---
id: 2
title: Database and auth implementation plan
stage: plan
date: 2026-08-04
surface: agent
model: claude-sonnet-5
feature: 003-database-auth
branch: 003-database-auth
user: Alishba Asif
command: /sp.plan
labels: [database, auth, plan, phase-2, better-auth, jwt, neon]
links:
  spec: specs/Database&Auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/Database&Auth/plan.md
 - specs/Database&Auth/research.md
 - specs/Database&Auth/data-model.md
 - specs/Database&Auth/contracts/auth-endpoints.md
 - specs/Database&Auth/quickstart.md
tests:
 - none (planning-only stage; no code produced)
---

## Prompt

create a plan.md file for database and auth

## Response snapshot

Ran `setup-plan.ps1` with `SPECIFY_FEATURE=Database&Auth` set inline (same
workaround needed for the two prior features, since the folder name no
longer matches the branch name). Filled Technical Context: TypeScript/
Node.js 20 (this feature adds code only to the already-built `frontend/`;
zero backend changes), `better-auth` as the primary dependency, reusing the
frontend's already-installed Vitest/RTL/Playwright stack. Read
`frontend/lib/api.ts` to confirm its existing `getAuthToken()`/
`getCurrentUserId()` dev-only localStorage stubs are exactly what this
feature must replace. Identified and resolved a real tension in
Constitution IV's wording during the Constitution Check: it says all data
is "accessed exclusively through SQLModel" but also says `users` is
"managed by Better Auth" (a Node library with no Python runtime) —
documented the resolution in research.md (SQLModel governs this project's
own Python-owned tables, i.e. `tasks`; Better Auth's own CLI-generated
migration tooling owns its `user`/`session`/`account`/`verification`
tables on the same Neon database, since the backend never queries the
`users` table directly, only decodes a JWT's `sub` claim) and logged it in
plan.md's Complexity Tracking table as a documented Constitution IV
exception. Surfaced the required ADR suggestion per this project's
CLAUDE.md rules (architecturally significant: schema-ownership split, real
alternatives existed, cross-cutting between this feature and the Backend
feature) — offered `/sp.adr schema-ownership-split-sqlmodel-better-auth`,
awaiting user consent, not created. Generated `research.md` (5 decisions:
schema ownership, password hashing delegated to Better Auth, JWT plugin
configured to reuse the backend's exact existing `BETTER_AUTH_SECRET`
verbatim rather than minting a new one, testing-stack reuse, and
`(auth)` route-group placement mirroring the existing `(tasks)` group),
`data-model.md` (Account/Session entities plus an explicit note that
`tasks.user_id` has no DB-level FK into the `user` table — integrity is
enforced at the application layer via the shared JWT contract),
`contracts/auth-endpoints.md` (Better Auth's own sign-up/sign-in/sign-out/
get-session endpoints, with the one genuinely open detail — exact JWT
retrieval mechanism — explicitly flagged for confirmation during
`/sp.implement` rather than invented), and `quickstart.md` (env-var reuse
instructions, install/generate-schema/run commands, a 7-step golden path
that cross-checks against the already-built backend's own quickstart).
Ran `update-agent-context.ps1`; found no injection markers in this
project's custom CLAUDE.md (same no-op as the two prior features) and
reverted the resulting stray BOM byte.

## Outcome

- ✅ Impact: Third and final Phase II feature now has a complete Phase 0/1 planning artifact set, ready for `/sp.tasks`.
- 🧪 Tests: none (planning-only stage)
- 📁 Files: specs/Database&Auth/{plan.md, research.md, data-model.md, contracts/auth-endpoints.md, quickstart.md}
- 🔁 Next prompts: user decision on the ADR suggestion, then /sp.tasks for 003-database-auth
- 🧠 Reflection: Naming the SQLModel-vs-Better-Auth schema tension explicitly, rather than silently picking one reading of the constitution, is exactly the kind of decision this project's own rules require surfacing as an ADR suggestion rather than deciding unilaterally.

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell tool's working directory had drifted to `frontend/` from an earlier venv-activation command in this session — the plan script failed with "command not found" until `Set-Location` back to repo root was added inline; worth always prefixing PowerShell script invocations with an explicit `Set-Location` when the session has touched a subdirectory.
- Graders run and results (PASS/FAIL): Constitution Check — PASS (pre- and post-design, with one documented exception)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
