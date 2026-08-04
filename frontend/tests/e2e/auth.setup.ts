import { test as setup, expect } from "@playwright/test";

/**
 * Playwright auth setup (US3): signs up one test account via the real UI and
 * saves the resulting session so every other e2e spec (including the
 * pre-existing task specs from the Frontend feature, which now require
 * authentication per middleware.ts) runs already signed in by default.
 * Specs that must start signed OUT (sign-up.spec.ts, sign-in.spec.ts) opt
 * out via `test.use({ storageState: { cookies: [], origins: [] } })`.
 */

const authFile = "tests/e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = `e2e-setup-${Date.now()}@example.com`;
  const password = "e2e-test-password";

  await page.goto("/sign-up");
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /create account/i }).click();

  await expect(page).toHaveURL("/dashboard");
  await page.context().storageState({ path: authFile });
});
