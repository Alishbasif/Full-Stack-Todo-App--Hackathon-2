import { AnimatedSection } from "@/components/landing/AnimatedSection";

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "Lightning-fast task creation",
    description:
      "Add a task in seconds with just a title — details are optional, never required.",
  },
  {
    title: "Stay perfectly in sync",
    description:
      "Every change saves instantly, so your list is always up to date across every device.",
  },
  {
    title: "Private by design",
    description:
      "Your tasks are yours alone — secure sign-in keeps every list isolated to its owner.",
  },
  {
    title: "Works everywhere",
    description:
      "A fully responsive interface that feels right at home on phone, tablet, or desktop.",
  },
  {
    title: "Clear task status",
    description:
      "See what's done and what's pending at a glance, with one click to toggle completion.",
  },
  {
    title: "Built to last",
    description:
      "A clean, focused task list without the clutter — just what you need to get things done.",
  },
];

/** Also serves as the Navbar's "Features" destination (id="features") — see tasks.md's anchor-mapping note. */
export function Features() {
  return (
    <AnimatedSection id="features" className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-3 text-base text-muted">
          A focused feature set that helps you plan, track, and finish — without getting in your way.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="glass-panel flex flex-col gap-2 p-6">
            <h3 className="text-lg font-medium text-slate-50">{feature.title}</h3>
            <p className="text-sm text-muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
