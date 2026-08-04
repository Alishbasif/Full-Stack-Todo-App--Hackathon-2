import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

export async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg text-lg font-semibold tracking-tight text-slate-50 btn-focus"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold shadow-glow-primary"
            aria-hidden="true"
          >
            T
          </span>
          <span>
            Task<span className="text-gradient">Flow</span>
          </span>
        </Link>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">
              Your personal task workspace
            </span>
            <SignOutButton />
          </div>
        ) : (
          <span className="hidden text-sm text-muted sm:inline">
            Your personal task workspace
          </span>
        )}
      </div>
    </header>
  );
}
