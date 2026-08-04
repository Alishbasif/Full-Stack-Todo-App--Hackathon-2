# Implementation Plan: SaaS-Style Landing Page & Frontend Redesign

**Branch**: `004-saas-landing-page` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/004-saas-landing-page/spec.md`

## Summary

Add a public, marketing-style landing page at the application's root route
(`/`) and move the existing, already-implemented Todo Dashboard to
`/dashboard`, with routing that sends unauthenticated visitors to the
landing page and already-authenticated visitors straight to the dashboard.
This is a presentation-and-routing-only change on top of the already-built
`frontend/` app: no new backend endpoints, no database changes, and no
changes to how Better Auth issues or the backend verifies JWTs. The
dashboard, sign-in, and sign-up screens keep their exact existing
components and behavior — they are relocated in the route tree (and, for
the dashboard's authenticated Header, get one internal link retargeted from
`/` to `/dashboard`), never redesigned.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS (adds/moves files
only inside the existing `frontend/` Next.js 16 App Router project;
`backend/` requires zero changes)
**Primary Dependencies**: None new. Reuses the already-installed Next.js 16
App Router, React 19, Tailwind CSS, and the existing `better-auth` session
check pattern already used by `components/layout/Header.tsx`
(`auth.api.getSession`) — no new npm package is introduced for animation,
icons, or layout.
**Storage**: N/A — no data model changes; this feature reads the existing
session only to decide which page to render, it does not read or write
tasks or accounts.
**Testing**: Vitest + React Testing Library for new landing-section
components; Playwright for the routing/redirect behavior (landing →
dashboard when authenticated, dashboard → sign-in when not) — reusing the
Frontend feature's already-installed testing stack. Existing Playwright
specs that navigate to `/` expecting the dashboard MUST be updated to
navigate to `/dashboard` instead (mechanical URL update only — no assertion
about dashboard behavior changes).
**Target Platform**: Web browser (responsive: mobile, tablet, desktop),
same Vercel deployment as the rest of the frontend.
**Project Type**: Web application (monorepo `frontend/` + `backend/`, per
Constitution's Technology Stack table) — this plan touches `frontend/` only.
**Performance Goals**: SC-001 — a first-time visitor can identify the
product and how to start within 10 seconds of the landing page loading
(no heavy client-side JS required to render the initial view — landing
sections are Server Components; only the mobile-nav toggle and
scroll/entrance animations are Client Components).
**Constraints**: FR-016 — no backend, database, or auth-logic changes;
FR-009/FR-010 — the dashboard's existing functionality and auth gate must
be provably unchanged (existing test suites re-run, not rewritten in
substance); FR-014 — animations must respect `prefers-reduced-motion`,
which `globals.css` already disables globally, so no new reduced-motion
logic is needed, only avoiding animation approaches that would bypass that
global CSS rule (e.g., no raw `requestAnimationFrame` loops).
**Scale/Scope**: One new public route (`/`) and one relocated route
(`/dashboard`); no new user data, no new roles/permissions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design (see below).*

| Principle | Gate | Status |
|---|---|---|
| I. Spec-Driven Development (NON-NEGOTIABLE) | Plan and all downstream code are generated from `specs/004-saas-landing-page/spec.md` via Claude Code; a PHR is recorded for this planning step | PASS |
| II. Frontend: Responsive Next.js App Router UI | New landing sections use Next.js 16 App Router + TypeScript + Tailwind, Server Components by default (Client Components only for the mobile-menu toggle and scroll-triggered animation wrappers); no direct `fetch`/`axios` calls are introduced (the landing page makes no backend calls at all) | PASS |
| III. Backend: FastAPI REST API with Enforced User Isolation | N/A — zero backend code changes; no endpoint added, removed, or modified | PASS (N/A) |
| IV. Database & Authentication: Neon PostgreSQL via SQLModel + Better Auth/JWT | N/A — no schema change; this feature only calls the existing `auth.api.getSession()` read already used by `Header.tsx` to decide landing-vs-dashboard routing. `BETTER_AUTH_SECRET`, JWT issuance, and verification are untouched | PASS (N/A) |

**Result**: PASS, no violations. Complexity Tracking table not needed.

**Post-Design Re-check** (after Phase 1 research/data-model/quickstart):
No new dependency, entity, endpoint, or auth-logic change was introduced
during Phase 1 — `research.md`'s decisions (route restructuring via a new
`(app)` layout group, session-check-and-redirect placement, animation
approach, mobile-nav approach) all stay inside the existing Next.js/
Tailwind/Better-Auth-session-read stack. **Result: PASS, unchanged.**

## Project Structure

### Documentation (this feature)

```text
specs/004-saas-landing-page/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output (no new entities — view-state only)
├── quickstart.md         # Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist (from /sp.specify)

# No contracts/ folder: this feature introduces no new API endpoints and
# changes no existing ones (FR-016) — there is no contract to document.
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── page.tsx                        # NEW — public landing page (Server Component).
│   │                                     # Checks session via auth.api.getSession(); if
│   │                                     # present, redirect("/dashboard"); else render
│   │                                     # <LandingPage />. (US1, US2 Scenario 5)
│   ├── layout.tsx                       # MODIFIED — remove the unconditional <Header/>
│   │                                     # and inline footer; keep AuroraBackground +
│   │                                     # skip-link; render new <Footer /> (FR-011).
│   │                                     # No longer renders Header directly (moved to
│   │                                     # the new (app) group layout below).
│   ├── (app)/
│   │   ├── layout.tsx                   # NEW — renders the EXISTING, unmodified
│   │   │                                  <Header /> + {children}. Wraps every route
│   │   │                                  that previously got Header via root layout.
│   │   ├── dashboard/
│   │   │   └── page.tsx                 # MOVED from app/(tasks)/page.tsx, content
│   │   │                                  byte-for-byte unchanged (still renders
│   │   │                                  <TaskDashboard />). (US3)
│   │   └── (auth)/
│   │       ├── sign-in/page.tsx         # MOVED from app/(auth)/sign-in/page.tsx,
│   │       │                              unchanged
│   │       └── sign-up/page.tsx         # MOVED from app/(auth)/sign-up/page.tsx,
│   │                                      unchanged
│   ├── error.tsx, loading.tsx, not-found.tsx, globals.css   # unchanged
│   └── api/auth/[...all]/route.ts       # unchanged
├── components/
│   ├── layout/
│   │   ├── Header.tsx                   # ONE-LINE CHANGE — logo `href="/"` →
│   │   │                                  `href="/dashboard"` (US3; the dashboard's own
│   │   │                                  "home" link must point at the dashboard, not
│   │   │                                  the new marketing page). No visual/behavioral
│   │   │                                  change otherwise.
│   │   ├── AuroraBackground.tsx         # unchanged, reused as-is on every page
│   │   └── Footer.tsx                   # NEW — redesigned footer, "Todo App © All
│   │                                       Rights Reserved 2026" (FR-011)
│   ├── auth/
│   │   ├── SignInForm.tsx               # ONE-LINE CHANGE — `router.push("/")` →
│   │   │                                  `router.push("/dashboard")` (US2 Scenario 4)
│   │   └── SignUpForm.tsx               # ONE-LINE CHANGE — same redirect target update
│   └── landing/                         # NEW — all landing-page-only components
│       ├── LandingPage.tsx              # Composes the sections below in order (FR-003)
│       ├── Navbar.tsx                   # Logo, Home/Features/About/Contact anchors,
│       │                                  Login, Get Started; collapses to a mobile
│       │                                  menu below the `sm`/`md` breakpoint (FR-004,
│       │                                  FR-005, FR-013)
│       ├── Hero.tsx                     # FR-003
│       ├── Features.tsx                 # FR-003
│       ├── HowItWorks.tsx               # FR-003
│       ├── Benefits.tsx                 # FR-003
│       └── CTA.tsx                      # FR-003, FR-006
├── middleware.ts                        # MODIFIED — matcher becomes ["/", "/dashboard"];
│                                          `/dashboard` keeps today's exact
│                                          redirect-to-/sign-in-when-unauthenticated
│                                          behavior; `/` redirects to `/dashboard` when a
│                                          session cookie is present, otherwise passes
│                                          through to the landing page (US1 Scenario 1,
│                                          US2 Scenario 5, FR-002)
└── tests/
    ├── unit/                            # NEW: landing section render tests; existing
    │                                      unit tests unchanged
    └── e2e/                             # MODIFIED: every spec currently asserting the
                                           dashboard is at `/` is updated to assert
                                           `/dashboard` instead (mechanical URL fix only);
                                           NEW: landing-page.spec.ts, redirect-when-
                                           authenticated.spec.ts

# backend/ — zero changes.
```

**Structure Decision**: Web application monorepo (same as the other three
Phase II features' plans). This plan only rearranges routes and adds new
presentation components inside the existing `frontend/` directory; it does
not touch `backend/` and introduces no new top-level directory.

## Complexity Tracking

*No Constitution Check violations — this section is intentionally empty.*
