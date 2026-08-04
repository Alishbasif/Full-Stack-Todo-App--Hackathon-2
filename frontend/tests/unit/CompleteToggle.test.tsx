import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompleteToggle } from "@/components/tasks/CompleteToggle";

describe("CompleteToggle — US3", () => {
  it("calls onToggle when an incomplete task is marked complete", async () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<CompleteToggle completed={false} taskTitle="Buy milk" onToggle={onToggle} />);

    const checkbox = screen.getByRole("checkbox", { name: /mark "buy milk" complete/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    await waitFor(() => expect(onToggle).toHaveBeenCalledTimes(1));
  });

  it("reflects the completed state and offers to mark incomplete again", () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    render(<CompleteToggle completed taskTitle="Buy milk" onToggle={onToggle} />);

    const checkbox = screen.getByRole("checkbox", { name: /mark "buy milk" incomplete/i });
    expect(checkbox).toBeChecked();
  });

  it("shows an inline error if the toggle fails", async () => {
    const onToggle = vi.fn().mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<CompleteToggle completed={false} taskTitle="Buy milk" onToggle={onToggle} />);

    await user.click(screen.getByRole("checkbox"));
    expect(await screen.findByRole("alert")).toHaveTextContent(/try again/i);
  });
});
