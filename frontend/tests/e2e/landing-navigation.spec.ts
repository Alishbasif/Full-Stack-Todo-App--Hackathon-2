import { test, expect } from "@playwright/test";

/** US2 - Navigate From the Landing Page Into the App (spec.md Acceptance Scenarios 1-6). */

test.describe("US2 - Navigate From the Landing Page Into the App (unauthenticated)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('"Get Started" navigates to sign-up', async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Get Started" }).first().click();
    await expect(page).toHaveURL("/sign-up");
  });

  test('"Login" navigates to sign-in', async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).first().click();
    await expect(page).toHaveURL("/sign-in");
  });

  test("Home/Features/About/Contact links scroll to their matching section", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Features" }).first().click();
    await expect(page).toHaveURL(/#features$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /everything you need/i })
    ).toBeInViewport();

    await page.getByRole("link", { name: "About" }).first().click();
    await expect(page).toHaveURL(/#about$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /why people stick with taskflow/i })
    ).toBeInViewport();

    await page.getByRole("link", { name: "Contact" }).first().click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /ready to get organized/i })
    ).toBeInViewport();

    await page.getByRole("link", { name: "Home" }).first().click();
    await expect(page).toHaveURL(/#home$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /organize your life/i })
    ).toBeInViewport();
  });
});

test.describe("US2 - Navigate From the Landing Page Into the App (authenticated)", () => {
  test("an already-authenticated visit to / redirects straight to /dashboard", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/dashboard");
  });
});
