---
id: 1
title: Phase II Constitution
stage: constitution
date: 2026-08-03
surface: agent
model: claude-sonnet-5
feature: none
branch: master
user: Alishba Asif
command: /sp.constitution
labels: ["constitution", "phase-2", "frontend", "backend", "database", "authentication"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

Create detail constitution file in which the 3 parts which I told u are added from the file u read before

(Full command context: /sp.constitution — "Create detail constitution file in which the 3 parts which I told u are added from the file u read before". Preceding turn established the three parts as Frontend, Backend, and Database & Authentication, derived from Phase II of `Hackathon_II_Todo_Spec_Driven_Development.md`.)

## Response snapshot

Read the existing `.specify/memory/constitution.md` (unfilled template) and the three dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`) to confirm none hardcode principle names — all read the constitution dynamically via the "Constitution Check" gate, so no template edits were required.

Rewrote `.specify/memory/constitution.md` from the Phase II spec content already read in this conversation, with four declarative, testable principles:
- **I. Spec-Driven Development (NON-NEGOTIABLE)** — spec-before-code, Claude Code generates implementation, PHR/ADR discipline (from the hackathon's core "Requirements" constraint).
- **II. Frontend: Responsive Next.js App Router UI** — Next.js 16+ App Router, centralized API client, Server-Component-by-default, Tailwind-only styling, Better Auth + JWT header on every request.
- **III. Backend: FastAPI REST API with Enforced User Isolation** — exact REST endpoint table from the spec, mandatory JWT verification against `BETTER_AUTH_SECRET`, 401 on missing/invalid token, user_id-scoped queries.
- **IV. Database & Authentication: Neon PostgreSQL via SQLModel + Better Auth/JWT** — exact `users`/`tasks` schema from the spec, required indexes, shared-secret JWT config via env vars, migration discipline.

Added a "Technology Stack (Phase II)" table and a "Development Workflow & Quality Gates" section (SDD command order, spec/plan/tasks location, no-hardcoded-secrets, smallest-viable-diff), plus a Governance section with semantic-versioning amendment rules. Prepended a Sync Impact Report HTML comment documenting the version bump (template-unset → 1.0.0), added/removed sections, and template propagation status (all ✅, none required edits since they're generic).

## Outcome

- ✅ Impact: Phase II now has a concrete, ratified constitution (v1.0.0) grounding every future `/sp.specify`/`/sp.plan` for this phase in the exact Frontend/Backend/Database & Auth contracts from the hackathon spec.
- 🧪 Tests: none (governance document only)
- 📁 Files: `.specify/memory/constitution.md` (rewritten from template)
- 🔁 Next prompts: Run `/sp.specify` for the first feature slice (likely `task-crud` and/or `authentication`) to begin Phase II implementation section by section.
- 🧠 Reflection: Chose 4 principles (adding a foundational SDD principle) rather than exactly 3, since the hackathon's "cannot write code manually" constraint is itself a testable, non-negotiable governance rule distinct from the three technology-domain parts the user named — flagged explicitly in the Sync Impact Report rather than silently deviating from "3 parts."

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): manual validation — no unresolved bracket placeholders, version/date lines match Sync Impact Report, ISO dates used (PASS)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
