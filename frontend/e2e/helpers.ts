import type { Page } from "@playwright/test";

/**
 * A valid-looking Stellar public key used as the mock wallet's address.
 * Only its shape matters to the UI, which shortens it for display.
 */
export const MOCK_ADDRESS =
  "GAQUORUMEBROWSERTESTACCOUNTAAAAAAAAAAAAAAAAAAAAAAAAA";

/**
 * Injects a fake Freighter extension before the page's scripts run.
 *
 * The app's WalletProvider talks to `window.freighter.connect()`, so the
 * wallet-connect flow is fully exercisable without loading a real browser
 * extension — which is also what lets the same suite run on Firefox and
 * WebKit (see e2e/README.md).
 */
export async function mockFreighter(page: Page, address: string = MOCK_ADDRESS) {
  await page.addInitScript((addr: string) => {
    (window as unknown as { freighter: unknown }).freighter = {
      connect: async () => ({ publicKey: addr }),
    };
  }, address);
}
