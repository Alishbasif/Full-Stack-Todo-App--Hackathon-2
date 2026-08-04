"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

export interface CompleteToggleProps {
  completed: boolean;
  taskTitle: string;
  onToggle: () => Promise<void>;
}

/**
 * Completion toggle control (US3, FR-006). A checkbox is the correct
 * semantic element for a binary complete/incomplete state and is natively
 * keyboard-operable (Space to toggle) with a visible focus ring.
 */
export function CompleteToggle({ completed, taskTitle, onToggle }: CompleteToggleProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange() {
    setError(null);
    setPending(true);
    try {
      await onToggle();
    } catch {
      setError("Couldn't update. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={completed}
          disabled={pending}
          onChange={handleChange}
          className="peer sr-only"
          aria-label={completed ? `Mark "${taskTitle}" incomplete` : `Mark "${taskTitle}" complete`}
        />
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all duration-200",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-accent-cyan peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            completed
              ? "border-accent-emerald bg-accent-emerald text-background shadow-glow-emerald"
              : "border-white/20 bg-white/5 hover:border-accent-cyan/60"
          )}
        >
          {pending ? (
            <Spinner size="sm" className="h-3.5 w-3.5" />
          ) : completed ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                d="M3 8.5L6.5 12L13 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </label>
      {error && (
        <span role="alert" className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
