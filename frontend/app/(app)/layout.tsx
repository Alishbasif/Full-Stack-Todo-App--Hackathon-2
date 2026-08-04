import { Header } from "@/components/layout/Header";

/**
 * Shared shell for every authenticated/auth-flow route (dashboard,
 * sign-in, sign-up) — renders the existing, unmodified Header. The public
 * landing page (app/page.tsx) is a sibling outside this group and renders
 * its own Navbar instead (specs/004-saas-landing-page).
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
