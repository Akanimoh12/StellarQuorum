import { defineConfig, devices } from "@playwright/test";

/**
 * Cross-browser E2E matrix (issue #313, building on #24).
 *
 * The wallet-connect and vote flows run on Chromium, Firefox and WebKit —
 * Freighter's extension APIs and the app's client components can behave
 * differently per engine, and a Chromium-only suite would miss that. The
 * wallet is injected as a `window.freighter` mock (see e2e/helpers.ts) so the
 * flow itself is identical on every engine; anything that genuinely cannot run
 * on an engine is skipped with a reason in the spec, not dropped here.
 *
 * The suite expects a production build (`npm run build`) to exist; the
 * webServer below serves it with `next start`. Fixture mode is the app's
 * default when no contract ID is set, so no environment is required.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
