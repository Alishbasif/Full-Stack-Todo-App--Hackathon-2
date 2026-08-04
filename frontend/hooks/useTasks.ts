"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateTaskInput,
  Task,
  TaskListStatus,
  UpdateTaskInput,
} from "@/types/task";
import {
  ApiError,
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  listTasks,
  toggleTaskComplete as apiToggleTaskComplete,
  updateTask as apiUpdateTask,
} from "@/lib/api";

export interface UseTasksResult {
  tasks: Task[];
  status: TaskListStatus;
  error: string | null;
  refresh: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<Task>;
  editTask: (id: number, input: UpdateTaskInput) => Promise<Task>;
  removeTask: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
}

function messageFor(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

/**
 * Central data-fetching + mutation hook for the task list, backed by
 * lib/api.ts (no components call the API client directly).
 * Drives TaskListStatus per data-model.md's derived view state.
 */
export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskListStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await listTasks();
      setTasks(data);
      setStatus(data.length === 0 ? "empty" : "ready");
    } catch (err) {
      setStatus("error");
      setError(messageFor(err, "Failed to load tasks. Please try again."));
    }
  }, []);

  useEffect(() => {
    // Initial fetch-on-mount: load() sets loading/error/tasks state as the
    // network request resolves. This is the standard data-fetching-on-mount
    // pattern (no external subscription to synchronize), so the state
    // updates below are intentionally triggered from this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const addTask = useCallback(async (input: CreateTaskInput) => {
    const created = await apiCreateTask(input);
    setTasks((prev) => [created, ...prev]);
    setStatus("ready");
    return created;
  }, []);

  const editTask = useCallback(async (id: number, input: UpdateTaskInput) => {
    try {
      const updated = await apiUpdateTask(id, input);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      return updated;
    } catch (err) {
      if (err instanceof ApiError && err.kind === "not_found") {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
      throw err;
    }
  }, []);

  const removeTask = useCallback(async (id: number) => {
    try {
      await apiDeleteTask(id);
    } catch (err) {
      // A 404 here means the task is already gone elsewhere (stale task
      // edge case) — treat as success and still remove it locally.
      if (!(err instanceof ApiError && err.kind === "not_found")) {
        throw err;
      }
    }
    setTasks((prev) => {
      const next = prev.filter((task) => task.id !== id);
      setStatus(next.length === 0 ? "empty" : "ready");
      return next;
    });
  }, []);

  const toggleComplete = useCallback(async (id: number) => {
    let previous: Task[] = [];
    setTasks((prev) => {
      previous = prev;
      return prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
    });
    try {
      const updated = await apiToggleTaskComplete(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      if (err instanceof ApiError && err.kind === "not_found") {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        setTasks(previous);
      }
      throw err;
    }
  }, []);

  return {
    tasks,
    status,
    error,
    refresh: load,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
  };
}
