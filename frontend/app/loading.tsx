import { Spinner } from "@/components/ui/Spinner";

/** Route-level loading UI (FR-009) shown while the task route segment loads. */
export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <Spinner size="lg" className="text-primary" />
      <p className="text-sm text-muted">Loading your tasks…</p>
    </div>
  );
}
