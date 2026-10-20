import { expect, test } from "@playwright/test";
import { MOCK_ADDRESS, mockFreighter } from "./helpers";

/**
 * Wallet-connect flow across Chromium, Firefox and WebKit (issue #313).
 *
 * The Freighter extension is mocked via `window.freighter` so the flow under
 * test is the app's own connect/disconnect logic — identical on every engine.
 * Real extension loading is Chromium-only and is tracked with the full voting
 * flow in #24; see e2e/README.md for the engine-skip policy.
 */
test.describe("wallet connect", () => {
  test("offers Connect Wallet when no extension is connected", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Connect Wallet" })).toBeVisible();
  });

  test("connects and shows the shortened address", async ({ page }) => {
    await mockFreighter(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Connect Wallet" }).click();
    const disconnect = page.getByRole("button", {
      name: `Disconnect wallet ${MOCK_ADDRESS}`,
    });
    await expect(disconnect).toBeVisible();
    await expect(disconnect).toContainText("…");
  });

  test("disconnect returns to the Connect Wallet state", async ({ page }) => {
    await mockFreighter(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Connect Wallet" }).click();
    await page.getByRole("button", { name: `Disconnect wallet ${MOCK_ADDRESS}` }).click();
    await expect(page.getByRole("button", { name: "Connect Wallet" })).toBeVisible();
  });

  test("surfaces an actionable error when no wallet extension exists", async ({ page }) => {
    // No mock: this engine has no Freighter installed.
    await page.goto("/");
    await page.getByRole("button", { name: "Connect Wallet" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "No Stellar wallet extension found. Install Freighter to connect.",
    );
  });
});
