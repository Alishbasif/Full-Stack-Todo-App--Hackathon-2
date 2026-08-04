import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Two routing rules (specs/004-saas-landing-page):
 *  - `/dashboard`: redirects unauthenticated (or expired-session) requests
 *    to `/sign-in` (US3 Scenario 3) — unchanged behavior, just retargeted
 *    from the dashboard's old URL (`/`) to its new one.
 *  - `/`: the public landing page. An already-authenticated visitor is
 *    redirected straight to `/dashboard` instead of seeing marketing
 *    content (US2 Scenario 5); an unauthenticated visitor passes through
 *    to the landing page.
 * This is a UX-level redirect only, not the security boundary — the
 * already-built backend's own JWT verification (specs/backendspecs/) is
 * what actually enforces authentication and per-user isolation on every
 * task operation.
 */
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard") {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  // pathname === "/"
  if (sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
