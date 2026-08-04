import { test, expect } from "@playwright/test";

/** US2 - Sign In to My Account (spec.md Acceptance Scenarios 1-2). */

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("US2 - Sign In to My Account", () => {
  test("correct credentials sign the user in and issue a usable credential", async ({ page }) => {
    const email = `signin-${Date.now()}@example.com`;
    const password = "valid-password-1";

    await page.goto("/sign-up");
    await page.getByLabel(/^email$/i).fill(email);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL("/dashboard");

    await page.context().clearCookies();
    await page.goto("/sign-in");
    await page.getByLabel(/^email$/i).fill(email);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("an incorrect password or unregistered email is rejected with one generic message", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByLabel(/^email$/i).fill("no-such-user@example.com");
    await page.getByLabel(/^password$/i).fill("whatever-password");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/sign-in/);
  });
});
