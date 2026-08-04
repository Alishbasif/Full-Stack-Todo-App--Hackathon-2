import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { CTA } from "@/components/landing/CTA";

/** Composes the public landing page's sections in spec-required order (FR-003). */
export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <CTA />
    </>
  );
}
