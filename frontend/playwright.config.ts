import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Serial, not parallel: all specs share one Neon Postgres database (and,
  // via tests/e2e/.auth/user.json, one authenticated session). Free-tier
  // Neon's connection pooler is flaky under concurrent load from multiple
  // client pools (this app's + the backend's) hitting it simultaneously —
  // see specs/Database&Auth/tasks.md T031. Running serially removes that
  // pressure entirely rather than chasing an intermittent race.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  // Real auth requests (password hashing + a Neon serverless connection,
  // slower still on Next.js dev mode's first on-demand route compile) can
  // comfortably take several seconds — see specs/Database&Auth/tasks.md T031.
  expect: { timeout: 30_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    actionTimeout: 30_000,
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
