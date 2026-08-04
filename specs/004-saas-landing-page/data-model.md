# Phase 1 Data Model: SaaS-Style Landing Page & Frontend Redesign

This feature introduces no persisted entities, no new database tables, and
no changes to the `Task` or `Account`/session models already owned by the
Frontend, Backend, and Database & Authentication features (FR-016). There
is nothing to add to `types/task.ts` or the backend schema.

## Non-persisted view/routing state

| State | Type | Where it lives | Notes |
|---|---|---|---|
| `hasSession` | boolean | Computed server-side per request (`app/page.tsx`, `middleware.ts`) via the existing `auth.api.getSession()` read | Not stored; re-derived from the Better Auth session cookie on every request. Drives landing-vs-redirect (FR-002) and dashboard-vs-sign-in (FR-010) routing decisions. |
| `isMobileNavOpen` | boolean | Local component state inside `Navbar.tsx` (Client Component) | Purely presentational; not persisted across reloads or shared with any other component. |
| `isInView` | boolean (per section) | Local state inside the scroll/entrance-animation wrapper, driven by `IntersectionObserver` | Purely presentational; drives whether the `fade-up`/`fade-in` Tailwind animation classes are applied (FR-014). |

## Content data

The Hero/Features/HowItWorks/Benefits/CTA copy (headlines, feature
descriptions, step text) is static, hardcoded content owned by each
section's own component — not fetched, not stored, not user-editable. No
CMS or data-fetching layer is introduced.
