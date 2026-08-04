import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "success" | "error" | "info";

export interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  success:
    "border-accent-emerald/30 bg-accent-emerald/10 text-emerald-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  info: "border-primary/30 bg-primary/10 text-blue-300",
};

/** Success/failure/info feedback banner (FR-010, SC-004). */
export function Alert({ variant, children, className }: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm animate-fade-up",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
