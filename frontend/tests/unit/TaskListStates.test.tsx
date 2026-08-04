import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "@/components/tasks/TaskList";

const noop = {
  onToggleComplete: vi.fn().mockResolvedValue(undefined),
  onUpdate: vi.fn(),
  onDelete: vi.fn(),
};

describe("TaskList — US2 loading/error states (FR-009)", () => {
  it("shows a loading indicator while data has not arrived", () => {
    render(<TaskList tasks={[]} status="loading" error={null} onRetry={vi.fn()} {...noop} />);

    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    expect(screen.getByText(/loading your tasks/i)).toBeInTheDocument();
  });

  it("shows an error state with a retry option when fetching fails", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <TaskList
        tasks={[]}
        status="error"
        error="Unable to reach the server."
        onRetry={onRetry}
        {...noop}
      />
    );

    expect(screen.getByText(/unable to reach the server/i)).toBeInTheDocument();
    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
