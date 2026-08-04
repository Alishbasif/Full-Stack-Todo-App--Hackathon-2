---
id: 2
title: Frontend Implementation Plan
stage: plan
date: 2026-08-03
surface: agent
model: claude-sonnet-5
feature: 001-todo-frontend
branch: 001-todo-frontend
user: Alishba Asif
command: /sp.plan
labels: ["plan", "frontend", "nextjs", "phase-2"]
links:
  spec: specs/frontendspecs/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/frontendspecs/plan.md
 - specs/frontendspecs/research.md
 - specs/frontendspecs/data-model.md
 - specs/frontendspecs/contracts/tasks-api.md
 - specs/frontendspecs/quickstart.md
tests:
 - none
---

## Prompt

create a detail plan.md file you already read the "Hackathon_II_Todo_Spec_Driven_Development.md file"

## Response snapshot

`setup-plan.ps1` couldn't be used as-is: it resolves the feature directory from the git branch name (`001-todo-frontend`) via `Get-FeatureDir`, but the spec folder was renamed to `specs/frontendspecs/` in the previous turn at the user's request, and `Test-FeatureBranch` also rejects any `$env:SPECIFY_FEATURE` override that doesn't match the `^[0-9]{3}-` pattern (so `frontendspecs` can't be substituted in either). Handled this by writing `specs/frontendspecs/plan.md` directly from `.specify/templates/plan-template.md`, keeping the git branch as `001-todo-frontend` for git operations while the docs directory stays `frontendspecs/`.

Filled the plan from the Phase II hackathon document (already read) plus `specs/frontendspecs/spec.md` and the ratified constitution:
- **Technical Context**: Next.js 16 App Router + TypeScript + Tailwind + Better Auth client SDK, Vitest/RTL + Playwright for testing, Vercel deployment target, all constraints traced back to specific FR/SC IDs.
- **Constitution Check**: table against all 4 principles — I and II PASS directly; III and IV marked PASS (N/A) with rationale, since this plan produces no backend/database code but the consumed API contract is written to match Principle III's endpoint table exactly. Re-checked after Phase 1 with no changes.
- **Project Structure**: concrete `frontend/` tree (app/, components/tasks/, hooks/, lib/api.ts, types/, tests/) with each file annotated to the user story it serves.

Phase 0 (`research.md`): documented rationale/alternatives for the 4 decisions this feature actually had to make itself (Vitest+RTL+Playwright over Jest/Cypress; Server Components + a thin `useTasks` hook over Redux/TanStack Query; Vercel per hackathon submission requirement; Core Web Vitals as a default page-load target since spec.md's Success Criteria don't cover initial load).

Phase 1: `data-model.md` (Task entity + validation rules + state transitions, sourced from spec.md's Key Entities, marked as frontend-side type only — backend owns persistence); `contracts/tasks-api.md` (all 6 REST endpoints transcribed from the hackathon document's API Endpoints/Securing-the-REST-API sections, marked "consumed, not owned," plus a frontend error-handling mapping table for 401/400/404/5xx); `quickstart.md` (env vars, install/run/test commands, and an 8-step manual golden-path verification script covering every user story and the 320px responsive check).

Deliberately skipped running `update-agent-context.ps1 -AgentType claude` against the root `CLAUDE.md`: that file is this project's hand-authored SDD rules document and has no `## Active Technologies`/`## Recent Changes` markers the script depends on, so running it would only resave the file with a UTF-8 BOM (PowerShell 5.1's `Set-Content -Encoding utf8` default) for zero informational benefit — flagged to the user rather than silently run or silently skipped.

## Outcome

- ✅ Impact: Frontend feature now has a complete Phase 0/1 plan ready for `/sp.tasks`; API contract is pinned down precisely enough that the Backend feature's plan can be written to match it exactly.
- 🧪 Tests: none (planning stage; test *strategy* was decided, no test code yet)
- 📁 Files: `specs/frontendspecs/plan.md`, `research.md`, `data-model.md`, `contracts/tasks-api.md`, `quickstart.md` (all new)
- 🔁 Next prompts: `/sp.tasks` for this feature, then repeat specify → plan → tasks for Backend and Database & Authentication.
- 🧠 Reflection: Chose to hand-write `plan.md` and skip `setup-plan.ps1` rather than reverting the `frontendspecs` rename or fighting the branch-naming gate, since the user already explicitly accepted "I'd need to pass the feature dir explicitly in future commands" when choosing that rename option last turn.

## Evaluation notes (flywheel)

- Failure modes observed: `setup-plan.ps1`'s `Test-FeatureBranch` gate rejects non-numeric-prefixed `$env:SPECIFY_FEATURE` overrides, so it cannot target a renamed spec folder at all (unlike `update-agent-context.ps1`, which has no such gate) — worked around by writing plan.md directly instead of patching the script further.
- Graders run and results (PASS/FAIL): Constitution Check gate — PASS (4/4 principles, 2 marked N/A with documented rationale), re-checked post-Phase-1 with no change.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
