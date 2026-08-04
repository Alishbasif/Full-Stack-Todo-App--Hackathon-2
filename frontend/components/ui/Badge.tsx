import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "complete" | "pending";

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  complete: "bg-accent-emerald/15 text-emerald-300 border-accent-emerald/30",
  pending: "bg-accent-cyan/10 text-cyan-300 border-accent-cyan/25",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
