import { test, expect } from "@playwright/test";

/** US3 - Mark a Task Complete or Incomplete (spec.md Acceptance Scenarios 1-2). */

test.describe("US3 - Mark a Task Complete or Incomplete", () => {
  test("toggling an incomplete task marks it complete without a full reload", async ({ page }) => {
    await page.goto("/dashboard");
    const title = `Water the plants ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    const item = page.getByRole("listitem").filter({ hasText: title });
    await item.getByRole("checkbox").check();

    await expect(item.getByText(/completed/i)).toBeVisible();
  });

  test("toggling a completed task back reverts it to incomplete immediately", async ({ page }) => {
    await page.goto("/dashboard");
    const title = `Water the plants again ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    const item = page.getByRole("listitem").filter({ hasText: title });
    const checkbox = item.getByRole("checkbox");
    await checkbox.check();
    await expect(item.getByText(/completed/i)).toBeVisible();

    await checkbox.uncheck();
    await expect(item.getByText(/pending/i)).toBeVisible();
  });
});
