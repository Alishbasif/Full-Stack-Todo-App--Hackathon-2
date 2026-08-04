import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/landing/Navbar";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "TaskFlow — Organize your life, one task at a time",
  description:
    "A fast, secure, and beautifully simple way to plan your day and track what matters.",
};

/**
 * Public landing page at the application's root route (FR-001).
 * An already-authenticated visitor is sent straight to the dashboard
 * instead of seeing marketing content (FR-002, US2 Scenario 5) — mirrored
 * at the edge by middleware.ts for every request, this check is the same
 * server-side session read `components/layout/Header.tsx` already makes.
 */
export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <LandingPage />
    </>
  );
}
