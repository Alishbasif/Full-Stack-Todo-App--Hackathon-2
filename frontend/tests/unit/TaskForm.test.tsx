import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "@/components/tasks/TaskForm";

describe("TaskForm (create mode) — US1 validation", () => {
  it("rejects an empty title and does not call onSubmit", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm mode="create" onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts a title at exactly the 200-character boundary", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm mode="create" onSubmit={onSubmit} />);

    const title = "a".repeat(200);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: title } });
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title, description: undefined }));
    expect(screen.queryByText(/200 characters or fewer/i)).not.toBeInTheDocument();
  });

  it("accepts a description at exactly the 1000-character boundary", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm mode="create" onSubmit={onSubmit} />);

    const description = "b".repeat(1000);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Buy groceries" } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: description } });
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ title: "Buy groceries", description })
    );
  });

  it("rejects a title over 200 characters", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm mode="create" onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "a".repeat(201) } });
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/200 characters or fewer/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows success feedback after a successful submission", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm mode="create" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title/i), "Walk the dog");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/task added/i)).toBeInTheDocument();
  });
});
