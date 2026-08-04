import { test, expect } from "@playwright/test";

/** US4 - Sign Out (spec.md Acceptance Scenario 1). */

test.describe("US4 - Sign Out", () => {
  test("signing out ends the session and further authenticated actions are refused", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/dashboard");

    await page.getByRole("button", { name: /sign out/i }).click();

    await expect(page).toHaveURL(/sign-in/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });
});
