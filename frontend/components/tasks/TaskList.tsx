"use client";

import type { Task, TaskListStatus } from "@/types/task";
import type { TaskFormValues } from "@/components/tasks/TaskForm";
import { TaskItem } from "@/components/tasks/TaskItem";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export interface TaskListProps {
  tasks: Task[];
  status: TaskListStatus;
  error: string | null;
  onRetry: () => void;
  onToggleComplete: (id: number) => Promise<void>;
  onUpdate: (id: number, values: TaskFormValues) => Promise<Task>;
  onDelete: (id: number) => Promise<void>;
}

/** Renders the task grid plus loading/error/empty states (FR-001, FR-008, FR-009). */
export function TaskList({
  tasks,
  status,
  error,
  onRetry,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (status === "loading") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <Spinner size="lg" className="text-primary" />
        <p className="text-sm text-muted">Loading your tasks…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <Alert variant="error">{error ?? "Something went wrong while loading tasks."}</Alert>
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="glass-surface mx-auto flex max-w-md flex-col items-center gap-2 px-6 py-16 text-center animate-fade-up">
        <div
          className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2 className="text-base font-semibold text-slate-50">No tasks yet</h2>
        <p className="text-sm text-muted">
          Add your first task above to start tracking what you need to do.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Task list"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
