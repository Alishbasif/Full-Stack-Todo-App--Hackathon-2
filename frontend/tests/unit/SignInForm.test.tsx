import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "@/components/auth/SignInForm";

const push = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

const signInEmail = vi.fn();
vi.mock("@/lib/auth-client", () => ({
  authClient: { signIn: { email: (...args: unknown[]) => signInEmail(...args) } },
}));

describe("SignInForm — US2", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
    signInEmail.mockReset();
  });

  it("signs in and navigates on success", async () => {
    signInEmail.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(signInEmail).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "correct-password",
      })
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows one generic message for incorrect credentials, never which field was wrong (FR-006)", async () => {
    signInEmail.mockResolvedValue({ error: { message: "Invalid email or password" } });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    const alert = await screen.findByText(/invalid email or password/i);
    expect(alert).toBeInTheDocument();
    expect(screen.queryByText(/email is (wrong|incorrect)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/password is (wrong|incorrect)/i)).not.toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
