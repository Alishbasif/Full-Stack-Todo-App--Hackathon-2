import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskList } from "@/components/tasks/TaskList";
import type { Task } from "@/types/task";

const tasks: Task[] = [
  {
    id: 1,
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    completed: false,
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Finish report",
    description: null,
    completed: true,
    createdAt: "2026-08-02T10:00:00Z",
    updatedAt: "2026-08-02T10:00:00Z",
  },
];

const noop = {
  onRetry: vi.fn(),
  onToggleComplete: vi.fn().mockResolvedValue(undefined),
  onUpdate: vi.fn().mockResolvedValue(tasks[0]),
  onDelete: vi.fn().mockResolvedValue(undefined),
};

describe("TaskList — US2 populated + empty states", () => {
  it("renders every task's title, status, and created date", () => {
    render(<TaskList tasks={tasks} status="ready" error={null} {...noop} />);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Finish report")).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/created/i).length).toBe(2);
  });

  it("shows a distinct empty state when there are no tasks (FR-008)", () => {
    render(<TaskList tasks={[]} status="empty" error={null} {...noop} />);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
