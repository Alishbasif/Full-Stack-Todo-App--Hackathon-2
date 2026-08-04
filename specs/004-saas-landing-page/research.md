# Phase 0 Research: SaaS-Style Landing Page & Frontend Redesign

No `[NEEDS CLARIFICATION]` markers remained after `/sp.specify` (spec.md's
Assumptions section already resolved every open question), so this phase
focuses on the technical decisions needed to implement those assumptions
inside the existing `frontend/` codebase.

## Decision: Route restructuring via a new `(app)` route group

**Decision**: Introduce `app/(app)/layout.tsx` that renders the existing,
unmodified `<Header />` and wraps a `dashboard/` route (moved from
`app/(tasks)/page.tsx`) and an `(auth)/` route group (moved from
`app/(auth)/`). The root `app/layout.tsx` stops rendering `<Header />`
directly; `app/page.tsx` (new landing page) is a sibling of `(app)`, so it
never receives the authenticated Header — it renders its own `Navbar`.

**Rationale**: Next.js route groups let routes share a layout without
appearing in the URL. This is the smallest-diff way to give the landing
page a different navbar than every authenticated/auth-flow page while
reusing `Header.tsx` completely unchanged (FR-009's "must not be
redesigned" applies to the dashboard's chrome too, not just its task list).
It also means moving files, not rewriting them — sign-in/sign-up/dashboard
page components keep identical content.

**Alternatives considered**:
- *Keep one global layout and conditionally render Header based on
  pathname*: rejected — would require the root layout (a Server Component)
  to branch on `usePathname()`, which isn't available in Server Components,
  or lift a client boundary higher than needed. Route groups solve this
  declaratively with zero new client-side logic.
- *Make the landing page a route group member too and hide Header via a
  prop*: rejected — would touch `Header.tsx`'s rendering logic (risk to
  FR-009) instead of just its one link target.

## Decision: Session-check-and-redirect location

**Decision**: `app/page.tsx` is an `async` Server Component that calls
`auth.api.getSession({ headers: await headers() })` (the exact call
`Header.tsx` already makes) and calls `redirect("/dashboard")` from
`next/navigation` when a session exists; otherwise it renders
`<LandingPage />`. `middleware.ts` is extended (matcher
`["/", "/dashboard"]`) so the same redirect also happens at the edge for
`/`, and `/dashboard` keeps its exact current unauthenticated→`/sign-in`
redirect, just retargeted from matcher `"/"` to `"/dashboard"`.

**Rationale**: Doing the authenticated→dashboard redirect in both
middleware (fast, edge-level, no page render) and defensively in the page
component matches the existing codebase's own comment in `middleware.ts`
("UX-level redirect only, not the security boundary") — middleware is the
primary mechanism, the page-level check is a harmless, cheap belt-and-
braces fallback consistent with how `Header.tsx` already reads session
server-side. No new session-reading utility is introduced.

**Alternatives considered**:
- *Redirect only in middleware, nothing in the page*: sufficient for
  correctness, but the existing codebase's convention (`Header.tsx`) always
  reads session directly in Server Components where a page needs to branch
  on it, so page-level double-checking that costs nothing was already the
  local pattern.
- *Client-side redirect via `useSession()` + `useEffect`*: rejected — would
  flash the landing page before redirecting and add an unnecessary Client
  Component boundary; the existing codebase already uses server-side
  session checks for exactly this kind of decision.

## Decision: New landing components stay Server Components except two small islands

**Decision**: `LandingPage.tsx`, `Hero.tsx`, `Features.tsx`,
`HowItWorks.tsx`, `Benefits.tsx`, `CTA.tsx` are Server Components (no
`"use client"`). Only `Navbar.tsx`'s mobile-menu toggle needs client-side
state (open/closed), and a thin, reusable scroll/entrance-animation wrapper
needs `"use client"` to use an `IntersectionObserver`.

**Rationale**: Matches Constitution II ("Server Components MUST be the
default; Client Components are permitted only where interactivity requires
them") and keeps the landing page's initial HTML payload light, supporting
SC-001 (identify the product within 10 seconds).

**Alternatives considered**:
- *A new animation library (e.g., Framer Motion)*: rejected — no new
  dependency is needed; CSS `@keyframes` + Tailwind's `animation` utilities
  already exist in `tailwind.config.ts` (`fade-up`, `fade-in`,
  `aurora-float`) and `globals.css` already globally disables all
  animation/transition durations under `prefers-reduced-motion: reduce`
  (FR-014 is already satisfied by existing global CSS with zero new code).
  A small `useInView`-style hook (IntersectionObserver, toggling a
  `data-in-view` attribute that a Tailwind class reacts to) is enough to
  trigger `fade-up` on scroll without any new package.

## Decision: Visual palette and glassmorphism reuse

**Decision**: No new colors, gradients, or surface treatments are added to
`tailwind.config.ts`/`globals.css`. The landing page reuses: `bg-primary`
(#3B82F6, "electric blue"), `bg-secondary` (#8B5CF6, purple),
`accent-cyan` (#22D3EE, cyan), the `aurora-1`/`aurora-2`/`aurora-3`
background-image gradients and `animate-aurora-float*` keyframes, and the
`.glass-surface`/`.glass-panel` utility classes already defined in
`globals.css` — the same tokens `AuroraBackground.tsx` and the dashboard's
existing cards already use.

**Rationale**: The existing design system already *is* "dark theme,
glassmorphism, aurora gradients, electric blue/cyan/purple" — the spec's
visual requirement describes what's already built, not a new system. Reuse
keeps visual consistency between the new landing page and the untouched
dashboard/auth pages for free, and requires zero new design tokens.

**Alternatives considered**:
- *Define a separate "marketing" color palette*: rejected — would create
  visual inconsistency between the landing page and the rest of the app,
  contradicting the "professional SaaS" goal, and duplicates tokens that
  already exist.

## Decision: Navbar CTAs are `<Link>`-styled elements, not `<Button>`

**Decision**: `Navbar.tsx`'s "Login" and "Get Started" controls (and the
Hero/CTA section's calls-to-action) are Next.js `<Link>` components styled
with the same Tailwind classes `components/ui/Button.tsx` uses internally
(`variants.primary`/`variants.ghost` strings), rather than importing
`Button` itself.

**Rationale**: `Button.tsx` renders a semantic `<button>` for in-page
actions (forms, toggles) and does not accept an `href`; these controls are
navigation, which semantically belongs on an `<a>`/`<Link>` for
accessibility (correct role, works with "open in new tab", etc.). Copying
the small set of class strings avoids a breaking prop-shape change to a
shared component used elsewhere (task dialogs, forms).

**Alternatives considered**:
- *Add an `as="a"`/`href` prop to `Button.tsx`*: rejected as unnecessary
  surface-area growth on a component with existing call sites across the
  dashboard; out of scope for a presentation-only feature per FR-016's
  spirit (minimize risk to already-working screens).

## Decision: Existing Playwright specs get a mechanical URL update, not a rewrite

**Decision**: E2E specs that currently `goto("/")`/assert `toHaveURL("/")`
expecting the dashboard are updated to use `/dashboard` for that
assertion/navigation only; every other line (selectors, assertions about
task behavior) is untouched.

**Rationale**: SC-004 requires the existing test suites to "continue to
pass" after the redesign — since the dashboard's URL is intentionally
moving as part of this feature (documented in spec.md's Assumptions), the
tests' *navigation target* must follow the route, or they would fail for a
reason unrelated to any real regression. This is a mechanical, scoped
update, not a rewrite of test intent or coverage.

**Alternatives considered**:
- *Keep the dashboard at `/` and put the landing page somewhere else (e.g.
  `/welcome`)*: rejected — contradicts the explicit requirement "Create a
  beautiful Landing Page as the default route before authentication."
