import Link from "next/link";
import { AnimatedSection } from "@/components/landing/AnimatedSection";

const primaryLinkClasses =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-glow-primary active:scale-[0.97] btn-focus";

const ghostLinkClasses =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-base font-medium text-slate-100 transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.97] btn-focus";

/** Also serves as the Navbar's "Home" destination (id="home") — see tasks.md's anchor-mapping note. */
export function Hero() {
  return (
    <AnimatedSection
      id="home"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8"
    >
      <span className="glass-surface rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-accent-cyan">
        Your tasks, finally under control
      </span>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
        Organize your life, <span className="text-gradient">one task at a time</span>
      </h1>
      <p className="max-w-xl text-base text-muted sm:text-lg">
        TaskFlow is a fast, secure, and beautifully simple way to plan your
        day, track what matters, and never lose sight of what&apos;s next.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link href="/sign-up" className={primaryLinkClasses}>
          Get Started Free
        </Link>
        <Link href="#how-it-works" className={ghostLinkClasses}>
          See how it works
        </Link>
      </div>
    </AnimatedSection>
  );
}
