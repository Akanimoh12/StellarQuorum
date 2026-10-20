import { expect, test } from "@playwright/test";
import { mockFreighter } from "./helpers";

/**
 * Vote flow across Chromium, Firefox and WebKit (issue #313).
 *
 * Renders the fixture-backed proposal detail page and exercises the vote CTA.
 * On-chain submission still routes through the connect prompt (tracked with
 * the wallet wiring in #24), so the assertion here is the prompt itself —
 * the same user-visible behaviour on every engine.
 */
test.describe("vote flow", () => {
  test("reaches an active proposal and offers the vote choices", async ({ page }) => {
    await page.goto("/proposals");
    await page.getByRole("link", { name: "Increase Protocol Fee to 0.05%" }).click();

    await expect(page.getByRole("heading", { name: "Cast Your Vote" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Vote For proposal" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Vote Against" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Abstain" })).toBeVisible();
  });

  test("tells a disconnected voter how to connect before voting", async ({ page }) => {
    await page.goto("/proposals/QIP-001");
    await expect(page.getByText("Connect your wallet to see the weight")).toBeVisible();
    await expect(page.getByText("Connect your Freighter wallet to vote")).toBeVisible();
  });

  test("prompts to connect when a vote is cast without a wallet", async ({ page }) => {
    await page.goto("/proposals/QIP-001");
    const dialog = page.waitForEvent("dialog");
    await page.getByRole("button", { name: "Vote For proposal" }).click();
    expect((await dialog).message()).toBe(
      "Connect your Freighter wallet to vote — testnet integration in progress.",
    );
  });

  test("shows the voting-power preview for a connected wallet", async ({ page }) => {
    await mockFreighter(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Connect Wallet" }).click();
    await page.goto("/proposals/QIP-001");
    // Connected: the preview leaves the "connect your wallet" state and
    // resolves the snapshot read. The mock address holds nothing at the
    // snapshot (fixture mode), so the preview explains the zero weight.
    await expect(page.getByText("Connect your wallet to see the weight")).toHaveCount(0);
    await expect(page.getByText("No voting power on this proposal")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cast Your Vote" })).toBeVisible();
  });
});
