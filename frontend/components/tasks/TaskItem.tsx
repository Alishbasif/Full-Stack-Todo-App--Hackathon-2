"use client";

import { useState } from "react";
import type { Task } from "@/types/task";
import type { TaskFormValues } from "@/components/tasks/TaskForm";
import { TaskForm } from "@/components/tasks/TaskForm";
import { CompleteToggle } from "@/components/tasks/CompleteToggle";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => Promise<void>;
  onUpdate: (id: number, values: TaskFormValues) => Promise<Task>;
  onDelete: (id: number) => Promise<void>;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function TaskItem({ task, onToggleComplete, onUpdate, onDelete }: TaskItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <li
      className={cn(
        "glass-surface group flex flex-col gap-3 p-5 transition-all duration-200",
        "hover:border-white/20 hover:shadow-glow-primary/10",
        task.completed && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        <CompleteToggle
          completed={task.completed}
          taskTitle={task.title}
          onToggle={() => onToggleComplete(task.id)}
        />
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "break-words text-base font-semibold text-slate-50",
              task.completed && "text-muted line-through"
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 break-words text-sm text-muted">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={task.completed ? "complete" : "pending"}>
              {task.completed ? "Completed" : "Pending"}
            </Badge>
            <span className="text-xs text-muted">
              Created {dateFormatter.format(new Date(task.createdAt))}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          aria-label={`Edit "${task.title}"`}
          className="btn-focus rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          aria-label={`Delete "${task.title}"`}
          className="btn-focus rounded-lg px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Edit task">
        <TaskForm
          mode="edit"
          initialValues={{ title: task.title, description: task.description ?? "" }}
          onCancel={() => setEditOpen(false)}
          onSubmit={async (values) => {
            await onUpdate(task.id, values);
            setEditOpen(false);
          }}
        />
      </Dialog>

      <DeleteTaskDialog
        open={deleteOpen}
        taskTitle={task.title}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await onDelete(task.id);
          setDeleteOpen(false);
        }}
      />
    </li>
  );
}
