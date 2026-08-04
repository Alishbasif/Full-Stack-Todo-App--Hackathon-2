import { test, expect } from "@playwright/test";

/**
 * US3 - Keep the Existing Dashboard Untouched and Protected (spec.md
 * Acceptance Scenario 2). Explicit regression guard for the auth gate at
 * the dashboard's new location, beyond the existing (now URL-updated)
 * specs that exercise it incidentally.
 */

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("US3 - Dashboard auth guard", () => {
  test("an unauthenticated request to /dashboard redirects to /sign-in", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});
