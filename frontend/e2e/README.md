# E2E tests (Playwright)

Cross-browser E2E suite for the wallet-connect and vote flows (issue #313,
building on the base voting-flow suite in #24). Configured by
`../playwright.config.ts`.

## Engine matrix

CI runs every spec on all three Playwright engines:

| Project | Engine | Why it is here |
| --- | --- | --- |
| `chromium` | Chromium | Reference engine; Freighter is a Chromium-family extension |
| `firefox` | Gecko | Layout, dialog, and storage APIs diverge enough to hide real bugs |
| `webkit` | WebKit | Same — Safari's engine is the usual third-engine surprise |

## How the wallet is mocked

`helpers.ts` injects a `window.freighter` stub before any page script runs.
The app's `WalletProvider` only calls `freighter.connect()`, so the whole
connect → display-address → disconnect flow — and the vote CTA's connect
prompt — run identically on every engine without loading a real extension.

## Engine-specific skips

**Policy:** a spec that cannot run on an engine is skipped *inside the spec*
with `test.skip(condition, "reason")` so the reason is code-reviewed and
shows up in the test output. Nothing is dropped per-engine in
`playwright.config.ts`.

Known engine-specific limitations:

- **Real Freighter extension loading** (pending with the on-chain vote wiring
  in #24) is Chromium-only: Playwright can load MV3 extensions into
  Chromium contexts, but not into Firefox or WebKit automation sessions.
  When #24 lands, the extension-backed variant should be
  `test.skip(browserName !== "chromium", "Freighter is an MV3 extension; Playwright only loads extensions in Chromium")`
  while the mocked-wallet specs here keep running on all three engines.

## Running locally

```bash
cd frontend
npm ci
npm run build                 # the webServer serves the production build
npm run test:e2e:install      # one-time: chromium, firefox, webkit binaries
npm run test:e2e
```

Use `npx playwright test --project=chromium` while iterating.
