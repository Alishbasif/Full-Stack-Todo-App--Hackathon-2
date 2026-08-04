import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

describe("Footer — US4 (FR-011)", () => {
  it('renders "Todo App © All Rights Reserved 2026"', () => {
    render(<Footer />);
    expect(screen.getByText("Todo App © All Rights Reserved 2026")).toBeInTheDocument();
  });
});
