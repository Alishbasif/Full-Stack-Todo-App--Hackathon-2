"use client";

import { useTasks } from "@/hooks/useTasks";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";

/**
 * Client-side dashboard composing the add-task form (US1) and task list
 * (US2-US5). Kept out of app/(tasks)/page.tsx so the page itself stays a
 * lightweight Server Component (Frontend-skills: "keep pages lightweight,
 * delegate logic to components").
 */
export function TaskDashboard() {
  const { tasks, status, error, refresh, addTask, editTask, removeTask, toggleComplete } =
    useTasks();

  const pendingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - pendingCount;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
          Your <span className="text-gradient">Tasks</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          {tasks.length > 0
            ? `${pendingCount} pending · ${completedCount} completed`
            : "Stay on top of what matters."}
        </p>
      </section>

      <section
        className="glass-panel animate-fade-up p-5 sm:p-6"
        aria-labelledby="add-task-heading"
      >
        <h2
          id="add-task-heading"
          className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Add a task
        </h2>
        <TaskForm
          mode="create"
          onSubmit={async (values) => {
            await addTask(values);
          }}
        />
      </section>

      <section aria-labelledby="task-list-heading" className="animate-fade-up">
        <h2 id="task-list-heading" className="sr-only">
          Task list
        </h2>
        <TaskList
          tasks={tasks}
          status={status}
          error={error}
          onRetry={refresh}
          onToggleComplete={toggleComplete}
          onUpdate={editTask}
          onDelete={removeTask}
        />
      </section>
    </div>
  );
}
