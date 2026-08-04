import { test, expect } from "@playwright/test";

test.describe("US1 - Add a New Task (probe)", () => {
  test("submitting a task with a title only adds it to the list incomplete", async ({ page }) => {
    const sessionCheck = await page.request.get("http://localhost:3000/api/auth/get-session");
    console.log("PRE_NAV_SESSION:", sessionCheck.status(), await sessionCheck.text());

    await page.goto("/dashboard");
    console.log("URL_AFTER_GOTO:", page.url());

    const sessionCheck2 = await page.request.get("http://localhost:3000/api/auth/get-session");
    console.log("POST_NAV_SESSION:", sessionCheck2.status(), await sessionCheck2.text());

    const title = `Buy groceries ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: /add task/i }).click();

    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
  });
});
