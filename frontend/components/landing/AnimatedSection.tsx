"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Reveals its children with the existing `animate-fade-up` utility once
 * scrolled into view. `prefers-reduced-motion` is already handled globally
 * in globals.css (collapses all animation/transition durations to ~0), so
 * no reduced-motion branching is needed here (FR-014).
 */
export function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      className={cn(className, isInView ? "animate-fade-up" : "opacity-0")}
    >
      {children}
    </section>
  );
}
