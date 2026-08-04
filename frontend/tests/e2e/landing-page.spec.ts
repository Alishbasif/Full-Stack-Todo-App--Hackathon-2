import { test, expect } from "@playwright/test";

/** US1 - Discover the Product on a Public Landing Page (spec.md Acceptance Scenarios 1-3). */

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("US1 - Discover the Product on a Public Landing Page", () => {
  test("an unauthenticated visitor sees the landing page, not the dashboard", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /organize your life/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /everything you need/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /how it works/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /why people stick with taskflow/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /ready to get organized/i })
    ).toBeVisible();
  });

  test("all sections remain readable on a narrow viewport with no horizontal scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /organize your life/i })
    ).toBeVisible();

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });
});
