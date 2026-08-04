"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/** Route-level error boundary + retry (FR-009). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="glass-panel max-w-md p-8">
        <h1 className="text-lg font-semibold text-slate-50">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted">
          We couldn&apos;t load your tasks. Please check your connection and
          try again.
        </p>
        <Button variant="primary" className="mt-6" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
