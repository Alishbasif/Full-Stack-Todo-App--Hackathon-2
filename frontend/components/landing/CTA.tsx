import Link from "next/link";
import { AnimatedSection } from "@/components/landing/AnimatedSection";

const primaryLinkClasses =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-glow-primary active:scale-[0.97] btn-focus";

/** Doubles as the Navbar's "Contact" destination (id="contact") — see tasks.md's anchor-mapping note. */
export function CTA() {
  return (
    <AnimatedSection
      id="contact"
      className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="glass-panel relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent p-10 text-center sm:p-16">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          Ready to get organized?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-muted">
          Create your free account and add your first task in under a minute.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/sign-up" className={primaryLinkClasses}>
            Get Started Free
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted">
          Questions? Reach us anytime at{" "}
          <a href="mailto:support@taskflow.app" className="text-accent-cyan hover:underline">
            support@taskflow.app
          </a>
        </p>
      </div>
    </AnimatedSection>
  );
}
