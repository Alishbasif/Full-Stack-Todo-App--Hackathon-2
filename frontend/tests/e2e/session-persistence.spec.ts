import { test, expect } from "@playwright/test";

/**
 * US3 - Stay Authenticated Across Requests (spec.md Acceptance Scenarios 1-3).
 * Uses the default authenticated storageState from tests/e2e/auth.setup.ts.
 */

test.describe("US3 - Stay Authenticated Across Requests", () => {
  test("a signed-in user remains recognized after a page reload (Scenario 1)", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/dashboard");

    await page.reload();

    await expect(page).toHaveURL("/dashboard");
  });

  test("the issued credential is accepted by the already-built task API (Scenario 2)", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    const title = `Session check ${Date.now()}`;

    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    await expect(page.getByText(title)).toBeVisible();
  });

  test("without a valid credential, a further authenticated action is refused (Scenario 3)", async ({
    page,
    context,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/dashboard");

    await context.clearCookies();
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/sign-in/);
  });
});
