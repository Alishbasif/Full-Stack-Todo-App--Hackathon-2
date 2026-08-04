# Quickstart: SaaS-Style Landing Page & Frontend Redesign

## Prerequisites

Same as the existing Frontend and Database & Authentication features — this
feature adds no new environment variables or services.

- Node.js 20 LTS or later
- `frontend/.env.local` already configured (`NEXT_PUBLIC_API_URL`,
  `BETTER_AUTH_SECRET`, `DATABASE_URL`, `BETTER_AUTH_URL`)
- Backend running locally at `http://localhost:8000` (only needed once
  you're inside the dashboard — the landing page itself makes no backend
  calls)

## Install & run

```bash
cd frontend
npm install
npm run dev
```

The app serves at `http://localhost:3000`.

## Running tests

```bash
cd frontend
npm run test        # Vitest + React Testing Library (unit/component)
npm run test:e2e    # Playwright
```

## Verifying the golden path manually

1. Open `http://localhost:3000` in a private/incognito window (no session)
   → confirm the landing page renders: Navbar (logo, Home, Features, About,
   Contact, Login, Get Started), then Hero, Features, How It Works,
   Benefits, and CTA sections in order (US1).
2. Click each of Home / Features / About / Contact in the navbar → confirm
   the page scrolls to the matching section (US2 Scenario 6).
3. Click "Get Started" → confirm you land on `/sign-up`.
4. Go back to `/`, click "Login" → confirm you land on `/sign-in`.
5. Sign up (or sign in) with a test account → confirm you land on
   `/dashboard` and see the exact same Todo Dashboard as before this
   feature (US2 Scenario 4, US3).
6. While still signed in, navigate directly to `http://localhost:3000/` →
   confirm you are redirected straight to `/dashboard`, not shown the
   landing page (US2 Scenario 5).
7. Sign out, then try to open `http://localhost:3000/dashboard` directly →
   confirm you are redirected to `/sign-in`, exactly as before this feature
   (US3 Scenario 2).
8. Resize the browser to a 375px-wide viewport on the landing page →
   confirm the navbar collapses into a mobile menu and no section produces
   horizontal scrolling (FR-012, FR-013, SC-003).
9. Check the footer on the landing page, `/sign-in`, `/sign-up`, and
   `/dashboard` → confirm all four show the same "Todo App © All Rights
   Reserved 2026" footer (US4).
10. Enable "reduce motion" in your OS accessibility settings, reload the
    landing page → confirm entrance animations are minimal/instant rather
    than sliding/fading in (FR-014).
11. Run `npm run test` and `npm run test:e2e` → confirm 100% of the
    existing (now URL-updated) dashboard/auth suites still pass (SC-004).
