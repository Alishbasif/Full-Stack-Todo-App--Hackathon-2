import { test, expect } from "@playwright/test";

/** US1 - Create an Account (spec.md Acceptance Scenarios 1-4). */

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("US1 - Create an Account", () => {
  test("a new email and valid password creates an account and signs in immediately", async ({
    page,
  }) => {
    const email = `signup-${Date.now()}@example.com`;

    await page.goto("/sign-up");
    await page.getByLabel(/^email$/i).fill(email);
    await page.getByLabel(/^password$/i).fill("valid-password-1");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("signing up with a name stores and does not error", async ({ page }) => {
    const email = `signup-named-${Date.now()}@example.com`;

    await page.goto("/sign-up");
    await page.getByLabel(/name/i).fill("Alex Rivera");
    await page.getByLabel(/^email$/i).fill(email);
    await page.getByLabel(/^password$/i).fill("valid-password-1");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("signing up twice with the same email is rejected with a clear message", async ({
    page,
  }) => {
    const email = `signup-dup-${Date.now()}@example.com`;

    await page.goto("/sign-up");
    await page.getByLabel(/^email$/i).fill(email);
    await page.getByLabel(/^password$/i).fill("valid-password-1");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL("/dashboard");

    await page.context().clearCookies();
    await page.goto("/sign-up");
    await page.getByLabel(/^email$/i).fill(email);
    await page.getByLabel(/^password$/i).fill("another-password-2");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/already exists/i)).toBeVisible();
    await expect(page).toHaveURL(/sign-up/);
  });

  test("a malformed email or too-short password is rejected without creating an account", async ({
    page,
  }) => {
    await page.goto("/sign-up");
    await page.getByLabel(/^email$/i).fill("not-an-email");
    await page.getByLabel(/^password$/i).fill("short");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/valid email/i)).toBeVisible();
    await expect(page).toHaveURL(/sign-up/);
  });
});
