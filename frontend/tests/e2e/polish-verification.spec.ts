import { test, expect } from "@playwright/test";

/**
 * Phase 7 Polish verification: FR-014 (reduced motion) and SC-003
 * (responsive at multiple breakpoints), beyond landing-page.spec.ts's
 * 375px check.
 */

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Polish - reduced motion (FR-014)", () => {
  test("entrance animation duration collapses under prefers-reduced-motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const heroSection = page.locator("#home");
    const duration = await heroSection.evaluate(
      (el) => getComputedStyle(el).animationDuration
    );
    // globals.css collapses every animation-duration to 0.001ms under
    // prefers-reduced-motion — assert it is effectively instantaneous.
    const ms = parseFloat(duration);
    expect(ms).toBeLessThan(1);
  });
});

test.describe("Polish - responsive layout (SC-003)", () => {
  for (const { name, width, height } of [
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    test(`no horizontal scroll on the landing page at ${name} (${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await expect(
        page.getByRole("heading", { level: 1, name: /organize your life/i })
      ).toBeVisible();

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    });
  }
});
