import { test, expect } from "@playwright/test";

/** US5 - Delete a Task (spec.md Acceptance Scenarios 1-2). */

test.describe("US5 - Delete a Task", () => {
  test("confirming deletion removes the task from the list", async ({ page }) => {
    await page.goto("/dashboard");
    const title = `Cancel subscription ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    const item = page.getByRole("listitem").filter({ hasText: title });
    await item.getByRole("button", { name: /delete/i }).click();

    const dialog = page.getByRole("dialog", { name: /delete task/i });
    await dialog.getByRole("button", { name: /delete task/i }).click();

    await expect(page.getByText(title)).not.toBeVisible();
  });

  test("cancelling the delete confirmation leaves the task unchanged", async ({ page }) => {
    await page.goto("/dashboard");
    const title = `Renew passport ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    const item = page.getByRole("listitem").filter({ hasText: title });
    await item.getByRole("button", { name: /delete/i }).click();

    const dialog = page.getByRole("dialog", { name: /delete task/i });
    await dialog.getByRole("button", { name: /cancel/i }).click();

    await expect(page.getByText(title)).toBeVisible();
  });
});
