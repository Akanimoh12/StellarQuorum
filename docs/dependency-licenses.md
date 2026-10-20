# Dependency License Policy

Quorum is MIT-licensed. Every dependency — Rust crates in `contracts/`, npm
packages in `frontend/` and `sdk/` — must carry a license that is compatible
with MIT redistribution, so downstream integrators never inherit copyleft
obligations from a transitive dependency nobody reviewed.

This policy is enforced in CI (issue #336). `cargo audit` and `npm audit`
already fail the build on known *vulnerabilities*; these checks fail it on
disallowed *licenses*.

## Allowed licenses

### Rust (`contracts/`, enforced by `contracts/deny.toml` + `cargo deny check licenses`)

| SPDX identifier | Notes |
| --- | --- |
| `MIT` | |
| `Apache-2.0` | |
| `Apache-2.0 WITH LLVM-exception` | |
| `MIT-0` | |
| `BSD-2-Clause` | |
| `BSD-3-Clause` | |
| `0BSD` | |
| `ISC` | |
| `Zlib` | |
| `BSL-1.0` | Boost |
| `CC0-1.0` | |
| `Unicode-DFS-2016` | `unicode-ident` and friends |
| `Unicode-3.0` | |

### npm (`frontend/`, `sdk/`, enforced by `scripts/check-npm-licenses.mjs`)

All of the above, plus licenses that only appear in the JavaScript data
and build-tooling ecosystem:

| SPDX identifier | Typical source |
| --- | --- |
| `Unlicense` | |
| `BlueOak-1.0.0` | |
| `Python-2.0` | |
| `CC-BY-4.0` | `caniuse-lite` browser data |
| `CC-BY-2.0`, `CC-BY-3.0` | occasional browser-data transitive deps |
| `MPL-2.0` | weak, file-level copyleft — acceptable here **only** for build/test tooling whose modified files stay unshipped (`lightningcss`, `axe-core`). A runtime library under MPL still needs a maintainer decision. |

SPDX *expressions* are resolved per the SPDX rules: `(MIT OR Apache-2.0)`
passes because one allowed branch exists; `A AND B` passes only if every part
is allowed; `A WITH exception` is checked on `A`.

**Package-level exceptions** (allowlist cannot express these; they live in
the script's `EXCEPTED` list and are printed on every run):

| Package pattern | License | Why it is tolerated |
| --- | --- | --- |
| `@img/sharp-*` | `LGPL-3.0-or-later` (often `Apache-2.0 AND LGPL-3.0-or-later`) | Prebuilt libvips shared libraries pulled in by Next.js's optional image optimizer (`sharp`). Dynamically loaded native binaries, not linked into the app bundle; libvips' source is published. Grandfathered October 2026 — a *new* LGPL package fails until excepted with its own rationale. |

**Deliberately not allowed:** GPL, LGPL (outside the named exception), AGPL,
EPL, SSPL, BUSL, and any package that declares no license at all
(`UNLICENSED` / missing field).

## How CI enforces this

| Tree | Tool | Config |
| --- | --- | --- |
| `contracts/` | [`cargo-deny`](https://github.com/EmbarkStudios/cargo-deny) | `contracts/deny.toml` |
| `frontend/` | `license-checker` + allowlist script | `scripts/check-npm-licenses.mjs` |
| `sdk/` | same as frontend | `scripts/check-npm-licenses.mjs` |

The CI steps live in `.github/workflows/ci.yml`. A PR that introduces a
disallowed license fails the corresponding job with a list of the offending
packages and the license string that was rejected.

## Adding or excepting a license

1. **Preferred:** replace the dependency with one under an allowed license.
2. If the license is genuinely needed and commercially safe (e.g. a permissive
   license missing from the list above), extend **both** the `deny.toml`
   allowlist (if the Rust tree is affected) and `scripts/check-npm-licenses.mjs`
   **in the same PR** that introduces the dependency, with a one-line
   rationale in the PR description.
3. Copyleft licenses require an explicit maintainer decision recorded in the
   PR — do not add them "just to make CI green".

## Running the checks locally

```bash
# Rust
cd contracts && cargo deny check licenses

# npm (either package)
cd frontend   # or: cd sdk
npm ci
npx --yes license-checker@25.0.1 --json --out licenses.json
node ../scripts/check-npm-licenses.mjs licenses.json
```
