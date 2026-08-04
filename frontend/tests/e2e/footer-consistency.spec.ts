import { test, expect } from "@playwright/test";

/** US4 - Consistent, Professional Footer Everywhere (spec.md Acceptance Scenario 1). */

const FOOTER_TEXT = "Todo App © All Rights Reserved 2026";

test.describe("US4 - Footer consistency (authenticated)", () => {
  test("dashboard shows the required footer", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(FOOTER_TEXT)).toBeVisible();
  });
});

test.describe("US4 - Footer consistency (unauthenticated)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("landing, sign-in, and sign-up all show the required footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(FOOTER_TEXT)).toBeVisible();

    await page.goto("/sign-in");
    await expect(page.getByText(FOOTER_TEXT)).toBeVisible();

    await page.goto("/sign-up");
    await expect(page.getByText(FOOTER_TEXT)).toBeVisible();
  });
});
