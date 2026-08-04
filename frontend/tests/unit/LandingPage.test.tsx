import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingPage } from "@/components/landing/LandingPage";

describe("LandingPage — US1 section order (FR-003)", () => {
  it("renders Hero, Features, How It Works, Benefits, and CTA in order", () => {
    render(<LandingPage />);

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((el) => el.textContent);

    expect(headings).toEqual([
      "Everything you need, nothing you don't",
      "How it works",
      "Why people stick with TaskFlow",
      "Ready to get organized?",
    ]);
    expect(
      screen.getByRole("heading", { level: 1, name: /organize your life/i })
    ).toBeInTheDocument();
  });
});
