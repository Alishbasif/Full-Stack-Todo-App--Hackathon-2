---
id: 2
title: SaaS landing page implementation plan
stage: plan
date: 2026-08-04
surface: agent
model: claude-sonnet-5
feature: 004-saas-landing-page
branch: 004-saas-landing-page
user: Alishba Asif
command: /sp.plan
labels: [frontend, landing-page, redesign, phase-2, routing, nextjs]
links:
  spec: specs/004-saas-landing-page/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/004-saas-landing-page/plan.md
 - specs/004-saas-landing-page/research.md
 - specs/004-saas-landing-page/data-model.md
 - specs/004-saas-landing-page/quickstart.md
tests:
 - none (plan-only stage; no code produced)
---

## Prompt

Create the implementation plan for specs/004-saas-landing-page/spec.md. Frontend stack is already Next.js 16 (App Router), TypeScript, Tailwind CSS, Better Auth — reuse existing patterns (lib/api.ts, components/layout/AuroraBackground.tsx, components/layout/Header.tsx, the (tasks) route group, middleware.ts) rather than introducing new libraries or architecture. This is a presentation/routing-only change: no backend, database, or auth-logic changes.

## Response snapshot

Read the existing frontend source (`Header.tsx`, `AuroraBackground.tsx`,
`middleware.ts`, `app/(tasks)/page.tsx`, `tailwind.config.ts`,
`globals.css`, `components/ui/Button.tsx`) and the ratified constitution
before writing the plan, to ground every decision in what already exists
rather than inventing new patterns. Key design: a new `app/(app)/layout.tsx`
route group renders the existing, byte-for-byte-unchanged `<Header />` and
wraps a relocated `dashboard/` route (moved from `app/(tasks)/page.tsx`)
and the relocated `(auth)/` group; the new landing page (`app/page.tsx`) is
a sibling outside that group so it gets its own new `Navbar` instead.
`middleware.ts`'s matcher grows from `["/"]` to `["/", "/dashboard"]`, with
`/` redirecting an authenticated session straight to `/dashboard` (mirroring
the page-level `auth.api.getSession()` check `Header.tsx` already makes)
and `/dashboard` keeping its exact current unauthenticated→`/sign-in`
behavior, just retargeted. Confirmed the existing Tailwind config already
defines every requested visual element (dark theme, `.glass-surface`/
`.glass-panel`, aurora gradients, primary blue/secondary purple/cyan
accents, `fade-up`/`fade-in` keyframes, global `prefers-reduced-motion`
handling) — zero new design tokens or npm dependencies needed. Documented
three necessary one-line edits inside otherwise-untouched dashboard files
(`Header.tsx`'s logo `href`, `SignInForm.tsx`/`SignUpForm.tsx`'s
post-auth redirect target) as explicitly justified exceptions to "don't
touch the dashboard," since they're link-target retargets required by the
routing move, not redesigns. Constitution Check: PASS, no violations, no
Complexity Tracking entries needed. Wrote research.md (6 decisions with
alternatives-considered), data-model.md (no persisted entities — documents
the 3 pieces of ephemeral view/routing state instead), and quickstart.md
(11-step manual golden-path walkthrough covering both the new landing flow
and regression-checking the untouched dashboard/auth flow). Ran
`update-agent-context.ps1 -AgentType claude`; it only added a stray BOM
to `CLAUDE.md` with no actual content change (this custom CLAUDE.md has no
auto-generated marker block for the script to target), so that no-op change
was reverted to keep the diff clean.

## Outcome

- ✅ Impact: Feature now has a complete, constitution-checked plan; ready for `/sp.tasks`.
- 🧪 Tests: none (plan-only stage)
- 📁 Files: specs/004-saas-landing-page/{plan.md,research.md,data-model.md,quickstart.md}
- 🔁 Next prompts: /sp.tasks for 004-saas-landing-page
- 🧠 Reflection: Explicitly listing the three necessary one-line "touch the dashboard" exceptions up front in the plan (rather than letting them surface as surprises mid-implementation) should keep US3's "dashboard must be provably unchanged" promise honest — implementation can point back to exactly these three lines as the full extent of the change.

## Evaluation notes (flywheel)

- Failure modes observed: `update-agent-context.ps1` must be run from the repo root (PowerShell tool's cwd had drifted into `frontend/` from earlier commands) — re-ran after `Set-Location` to the repo root. The script also doesn't detect this project's custom (non-marker-based) `CLAUDE.md` format, so it silently no-ops on content while still rewriting the file with a BOM; reverted that cosmetic diff.
- Graders run and results (PASS/FAIL): Constitution Check — PASS (4/4 principles, 2 N/A)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
