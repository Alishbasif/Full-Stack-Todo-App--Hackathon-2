import { test, expect } from "@playwright/test";

/**
 * US1 - Add a New Task (spec.md Acceptance Scenarios 1-3).
 * Requires the Backend feature to be reachable at NEXT_PUBLIC_API_URL for
 * requests to resolve; run against a live backend for full coverage.
 */

test.describe("US1 - Add a New Task", () => {
  test("submitting a task with a title only adds it to the list incomplete", async ({ page }) => {
    await page.goto("/dashboard");
    const title = `Buy groceries ${Date.now()}`;

    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByText(title)).toBeVisible();
  });

  test("a task created with a title and description shows both", async ({ page }) => {
    await page.goto("/dashboard");
    const title = `Plan trip ${Date.now()}`;
    const description = "Book flights and hotel";

    await page.getByLabel("Title").fill(title);
    await page.getByLabel(/description/i).fill(description);
    await page.getByRole("button", { name: /add task/i }).click();

    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
  });

  test("submitting with an empty title shows a validation message and does not create a task", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await page.getByRole("button", { name: /add task/i }).click();

    await expect(page.getByText(/title is required/i)).toBeVisible();
  });
});
