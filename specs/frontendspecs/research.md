# Phase 0 Research: Responsive Todo Task Management Interface

No `[NEEDS CLARIFICATION]` markers were left in the Technical Context — the
Phase II hackathon specification and this project's constitution already
fix the framework, language, styling, and auth-integration choices. This
document instead records the rationale for the decisions that were still
this feature's to make (testing strategy, data-fetching pattern, deployment
target) so they aren't re-litigated during implementation.

## Decision: Testing strategy — Vitest + React Testing Library, plus Playwright

- **Decision**: Use Vitest + React Testing Library for component/unit tests
  (form validation, empty/loading/error states) and Playwright for
  end-to-end tests, with one Playwright spec per user story in spec.md.
- **Rationale**: The spec's Acceptance Scenarios are already written as
  Given/When/Then user flows, which map directly onto Playwright scenarios;
  Vitest + RTL is the standard pairing for Next.js App Router component
  testing and integrates with the existing TypeScript toolchain with no
  extra config beyond what Next.js ships.
- **Alternatives considered**: Jest + RTL (rejected — Vitest is faster and
  is Next.js's current recommended default over Jest); Cypress for E2E
  (rejected — Playwright has first-class Next.js App Router support and
  better parallelization for CI).

## Decision: Data fetching / state management — Server Components + a thin client hook, no global state library

- **Decision**: Use Server Components for the initial task list render where
  possible, and a single `useTasks` client hook (backed by `lib/api.ts`) for
  client-side mutations (create/update/delete/toggle) and optimistic UI
  updates. No Redux/Zustand/React Query is introduced.
- **Rationale**: Constitution II mandates Server Components by default and
  Client Components only where interactivity requires them; the feature's
  scope (a single task list, no cross-page shared state) doesn't justify a
  global state library — introducing one would violate the "smallest viable
  diff" workflow rule in the constitution.
- **Alternatives considered**: TanStack Query (rejected for now — useful for
  caching/revalidation at larger scale, but adds a dependency not justified
  by this feature's single-list scope; can be reconsidered if a future phase
  adds more concurrent data sources); Redux/Zustand (rejected — no
  cross-cutting client state exists in this feature).

## Decision: Deployment target — Vercel

- **Decision**: Target Vercel for the deployed frontend.
- **Rationale**: The hackathon's Phase II submission form explicitly requires
  a "Published App Link for Vercel," and Vercel is the reference deployment
  platform for Next.js App Router.
- **Alternatives considered**: None — this is a hard submission requirement,
  not an open technical choice.

## Decision: Initial page-load performance target

- **Decision**: Adopt Next.js/Core Web Vitals "good" thresholds (e.g.
  Largest Contentful Paint under 2.5s on a typical broadband connection) as
  a reasonable default for initial task-list load, in addition to the
  explicit spec.md Success Criteria (SC-001–SC-005).
- **Rationale**: spec.md's Success Criteria cover interaction speed
  (creating/completing a task) but not initial page load; Core Web Vitals
  "good" thresholds are the industry-standard default for a Next.js app and
  require no additional infrastructure to hit at this feature's scale.
- **Alternatives considered**: Leaving page-load performance unspecified
  (rejected — the constitution requires the frontend to be production-ready,
  and an unbounded load-time target isn't testable).
