"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the returned ref's element has scrolled into the viewport.
 * Stays true afterward (one-shot reveal) — re-scrolling out and back in
 * should not replay the entrance animation.
 *
 * Always starts `false`, on both the server and the client's first render.
 * `IntersectionObserver` is a browser-only API — it is always `undefined`
 * during SSR — so branching the *initial* value on its availability made
 * the server and the client disagree on the very first paint, which is
 * exactly what a Next.js hydration error is. Any environment-dependent
 * adjustment (including the "unsupported browser" fallback below) happens
 * inside the effect instead, which only ever runs client-side, after
 * hydration has already reconciled — safe to diverge from the server
 * markup at that point.
 */
export function useInView<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  isInView: boolean;
} {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isInView) return;

    // Environments without IntersectionObserver (older browsers, some test
    // runners) degrade to "already visible" rather than staying hidden.
    // Post-hydration only — see the note above. Feature detection is only
    // possible client-side, so synchronizing with it here (rather than
    // during render) is unavoidable.
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isInView]);

  return { ref, isInView };
}
