"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export interface DeleteTaskDialogProps {
  open: boolean;
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/** Explicit delete confirmation step (US5, FR-005). */
export function DeleteTaskDialog({
  open,
  taskTitle,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setDeleting(true);
    try {
      await onConfirm();
    } catch {
      setError("Couldn't delete this task. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title="Delete task?"
      description={`"${taskTitle}" will be permanently removed. This can't be undone.`}
    >
      <div className="flex flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            isLoading={deleting}
          >
            Delete task
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
