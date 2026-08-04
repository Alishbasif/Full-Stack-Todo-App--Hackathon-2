import { AnimatedSection } from "@/components/landing/AnimatedSection";

const benefits: string[] = [
  "Spend less time managing your list and more time doing the work",
  "Never lose track of a task — everything is saved the moment you add it",
  "One focused view of what's done and what's still ahead",
  "Free to use, with no setup required beyond creating an account",
];

/** Doubles as the Navbar's "About" destination (id="about") — see tasks.md's anchor-mapping note. */
export function Benefits() {
  return (
    <AnimatedSection id="about" className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="glass-panel flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            Why people stick with TaskFlow
          </h2>
          <p className="mt-3 text-base text-muted">
            TaskFlow is built around one idea: a task manager should get out of your way.
            No clutter, no unnecessary steps — just a fast, reliable place to keep track of
            what matters.
          </p>
        </div>
        <ul className="flex-1 space-y-4">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-emerald/20 text-accent-emerald"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="text-sm text-slate-100">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
}
