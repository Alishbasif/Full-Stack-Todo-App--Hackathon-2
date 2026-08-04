import { AnimatedSection } from "@/components/landing/AnimatedSection";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up with just an email and password — you're in within seconds.",
  },
  {
    number: "02",
    title: "Add your tasks",
    description: "Capture what's on your plate, with an optional description for the details.",
  },
  {
    number: "03",
    title: "Stay on track",
    description: "Check things off as you go, and pick up right where you left off — anywhere.",
  },
];

export function HowItWorks() {
  return (
    <AnimatedSection
      id="how-it-works"
      className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-base text-muted">Three simple steps to a clearer day.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center gap-3 text-center">
            <span className="text-gradient text-4xl font-semibold">{step.number}</span>
            <h3 className="text-lg font-medium text-slate-50">{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
