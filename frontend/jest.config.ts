import type { Config } from "jest";
import nextJest from "next/jest";

// Issue #177: `next/jest` is Next.js's own zero-config Jest preset — it
// wires up SWC transforms, CSS/asset mocking, and next.config.ts/env
// loading automatically, so this file doesn't need to hand-roll any of
// that.
const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // e2e/ is the Playwright suite (#313); its *.spec.ts files are run by
  // `npm run test:e2e`, and Jest must not pick them up.
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/e2e/"],
};

export default createJestConfig(config);
