import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "@/components/tasks/TaskForm";

describe("TaskForm (edit mode) — US4", () => {
  it("pre-fills the existing title and description", () => {
    render(
      <TaskForm
        mode="edit"
        initialValues={{ title: "Old title", description: "Old description" }}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue("Old title");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Old description");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("saves an updated title", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <TaskForm
        mode="edit"
        initialValues={{ title: "Old title", description: "" }}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: "New title" } });
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ title: "New title", description: undefined })
    );
  });

  it("rejects clearing the title entirely and does not save", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <TaskForm
        mode="edit"
        initialValues={{ title: "Old title", description: "" }}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "" } });
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onCancel when the cancel button is pressed", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <TaskForm
        mode="edit"
        initialValues={{ title: "Old title", description: "" }}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
