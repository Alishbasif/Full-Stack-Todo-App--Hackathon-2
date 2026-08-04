"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth React client (Constitution II; specs/Database&Auth/plan.md).
 * No `baseURL` needed — the app serves its own `/api/auth/*` routes on the
 * same origin (frontend/app/api/auth/[...all]/route.ts).
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * Retrieve the current session's JWT (contracts/auth-endpoints.md's "JWT
 * issuance" section) via Better Auth's jwt plugin `GET /token` endpoint.
 * Returns `null` when there is no active session.
 */
export async function getSessionToken(): Promise<string | null> {
  const { data } = await authClient.$fetch<{ token: string }>("/token");
  return data?.token ?? null;
}
