import { test, expect } from "@playwright/test";

/** US4 - Update Task Details (spec.md Acceptance Scenarios 1-3). */

test.describe("US4 - Update Task Details", () => {
  test("editing a task's title updates it in the list", async ({ page }) => {
    await page.goto("/dashboard");
    const originalTitle = `Draft newsletter ${Date.now()}`;
    const newTitle = `Send newsletter ${Date.now()}`;

    await page.getByLabel("Title").fill(originalTitle);
    await page.getByRole("button", { name: /add task/i }).click();

    const item = page.getByRole("listitem").filter({ hasText: originalTitle });
    await item.getByRole("button", { name: /edit/i }).click();

    const dialog = page.getByRole("dialog", { name: /edit task/i });
    await dialog.getByLabel("Title").fill(newTitle);
    await dialog.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByText(newTitle)).toBeVisible();
    await expect(page.getByText(originalTitle)).not.toBeVisible();
  });

  test("editing a task's description persists the update", async ({ page }) => {
    await page.goto("/dashboard");
    const title = `Prepare slides ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    const item = page.getByRole("listitem").filter({ hasText: title });
    await item.getByRole("button", { name: /edit/i }).click();

    const dialog = page.getByRole("dialog", { name: /edit task/i });
    await dialog.getByLabel(/description/i).fill("Include Q3 metrics");
    await dialog.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByText("Include Q3 metrics")).toBeVisible();
  });

  test("clearing the title entirely shows a validation message and does not save", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    const title = `Keep this title ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    const item = page.getByRole("listitem").filter({ hasText: title });
    await item.getByRole("button", { name: /edit/i }).click();

    const dialog = page.getByRole("dialog", { name: /edit task/i });
    await dialog.getByLabel("Title").fill("");
    await dialog.getByRole("button", { name: /save changes/i }).click();

    await expect(dialog.getByText(/title is required/i)).toBeVisible();
    await dialog.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByText(title)).toBeVisible();
  });
});
