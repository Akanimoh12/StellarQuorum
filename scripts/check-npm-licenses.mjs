#!/usr/bin/env node
/**
 * Dependency license allowlist check for npm packages (issue #336).
 *
 * Reads the JSON produced by `license-checker --json` and fails if any
 * package's SPDX expression cannot be satisfied by the allowlist below.
 * The npm tree carries a few content/data licenses (e.g. CC-BY-4.0 on
 * caniuse-lite) that never appear in the Rust tree, so this list is a
 * slightly wider superset of contracts/deny.toml. Both are documented in
 * docs/dependency-licenses.md — keep the three in sync.
 *
 * Usage (from a package directory with node_modules installed):
 *   npx --yes license-checker@25.0.1 --json --out licenses.json
 *   node ../scripts/check-npm-licenses.mjs licenses.json
 */

import { readFileSync } from "node:fs";

/**
 * SPDX identifiers that may appear in a dependency's license expression.
 * Anything not listed here — including missing data, "UNLICENSED", and
 * copyleft licenses other than the weak MPL-2.0 below — fails the check.
 * Documented in docs/dependency-licenses.md; keep the two in sync.
 */
const ALLOWED = new Set([
  "MIT",
  "Apache-2.0",
  "MIT-0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "0BSD",
  "ISC",
  "Zlib",
  "BSL-1.0",
  "CC0-1.0",
  "Unlicense",
  "BlueOak-1.0.0",
  "Python-2.0",
  "CC-BY-4.0",
  "CC-BY-2.0",
  "CC-BY-3.0",
  "Unicode-DFS-2016",
  "Unicode-3.0",
  // Weak, file-level copyleft. Acceptable here only because every package
  // carrying it in this tree is build/test tooling whose modified files stay
  // unmodified and unshipped (lightningcss, axe-core) — see
  // docs/dependency-licenses.md. A runtime library under MPL still needs a
  // maintainer decision before being added.
  "MPL-2.0",
]);

/**
 * Packages whose license expression contains an otherwise-disallowed
 * identifier, with the rationale for tolerating it. Keys are matched as
 * regular expressions against the `name@version` key of the report.
 *
 * These are pre-existing tree members (as of October 2026); a *new* package
 * with the same license fails until it is added here with its own reason.
 */
const EXCEPTED = [
  {
    pattern: /^@img\/sharp/,
    licenses: "LGPL-3.0-or-later",
    reason:
      "prebuilt libvips shared libraries pulled in by Next.js's optional image optimizer (sharp). Dynamically loaded native binaries, not linked into the app bundle; the LGPL dynamic-library terms are satisfied and the source is published at libvips.org",
  },
];

/**
 * True when the SPDX expression is fully covered by the allowlist.
 *
 * license-checker reports the package.json `license` field verbatim, which can
 * be a bare identifier, `(MIT OR Apache-2.0)`, or `MIT WITH LLVM-exception`.
 * Parentheses are stripped (they only group, and this grammar has no mixed
 * AND/OR nesting that stripping would reorder), OR-branches pass if any one
 * branch is allowed, and AND-parts must all be allowed.
 */
function isAllowed(expression) {
  const normalized = String(expression).replace(/[()]/g, " ").trim();
  if (normalized.length === 0) return false;
  return normalized.split(/\s+OR\s+/i).some((alternative) =>
    alternative.split(/\s+AND\s+/i).every((part) => {
      const identifier = part.replace(/\s+WITH\s+.+$/i, "").trim();
      return ALLOWED.has(identifier);
    }),
  );
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: check-npm-licenses.mjs <license-checker-json>");
    process.exit(2);
  }

  let report;
  try {
    report = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`check-npm-licenses: cannot read ${file}: ${error.message}`);
    process.exit(2);
  }

  const disallowed = [];
  const excepted = [];
  for (const [pkg, info] of Object.entries(report)) {
    const expression = info?.licenses;
    if (isAllowed(expression)) continue;
    const exception = EXCEPTED.find((entry) => entry.pattern.test(pkg));
    if (exception) {
      excepted.push({ pkg, expression: expression ?? "(none declared)", reason: exception.reason });
    } else {
      disallowed.push({ pkg, expression: expression ?? "(none declared)" });
    }
  }

  for (const { pkg, expression, reason } of excepted) {
    console.warn(`excepted: ${pkg}: ${expression} — ${reason}`);
  }

  if (disallowed.length > 0) {
    console.error("Disallowed or missing licenses:");
    for (const { pkg, expression } of disallowed) {
      console.error(`  - ${pkg}: ${expression}`);
    }
    console.error("");
    console.error(
      "The allowlist lives in scripts/check-npm-licenses.mjs and is documented in docs/dependency-licenses.md.",
    );
    console.error(
      "Replace the dependency, or extend the allowlist in the same PR with a rationale.",
    );
    process.exit(1);
  }

  console.log(`OK: ${Object.keys(report).length} packages, all licenses allowed.`);
}

main();
