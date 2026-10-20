# Static Analysis

Two automated security analyzers run in CI alongside the correctness linters
(`cargo clippy` for the contracts, ESLint for the TypeScript packages):

| Analyzer | Covers | Workflow |
|---|---|---|
| **Semgrep** (`p/typescript`, `p/react`) | `frontend/`, `sdk/` | [`.github/workflows/semgrep.yml`](../.github/workflows/semgrep.yml) |
| **cargo-geiger** + first-party `unsafe` gate | `contracts/` and its dependency tree | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (`unsafe-audit` job) |

`cargo audit` and `npm audit` (dependency advisories) are documented in
[CONTRIBUTING.md](../CONTRIBUTING.md) and are separate from this document.

## Semgrep (TypeScript / React)

Runs on every PR that touches `frontend/` or `sdk/`, and on pushes to `main`.
The packs are the Semgrep community registry rulesets: `p/typescript` for the
language (injection sinks, insecure crypto, audit rules) and `p/react` for
React/JSX-specific issues (`dangerouslySetInnerHTML`, blank targets, unsafe
`href`). `.semgrepignore` at the repository root excludes dependencies,
build output and test files — tests are owned by ESLint and Jest.

### Running locally

```bash
semgrep scan --config=p/typescript --config=p/react
```

Install with `pipx install semgrep` (or `brew install semgrep`). No account
or `SEMGREP_APP_TOKEN` is needed for local scans; CI runs with `--metrics=off`
so nothing leaves the runner.

### Triaging a finding

1. Reproduce locally with the command above.
2. If the pattern is a real issue, fix it — do not suppress it.
3. If it is a false positive, suppress it **inline with a reason** (below).
4. If a rule is systematically noisy for this codebase, open an issue; do not
   disable the pack in the workflow without discussion.

### Suppression convention

Suppress a single finding on the line it fires on, naming the rule and the
reason. A bare `// nosemgrep` (all rules on that line) is acceptable when the
rule id is not known, but naming the rule is preferred:

```ts
await delay(base * 2 ** attempt + Math.floor(Math.random() * (jitter + 1))); // nosemgrep: typescript.javascript.lang.security.audit.insecure-randomness -- retry jitter, not a security primitive
```

Rules for suppressions, which reviewers should enforce:

- The reason must say **why the pattern is safe here**, not restate the rule.
- A suppression without a reason is grounds for rejection.
- Suppressions live next to the code they excuse so the next reader sees the
  trade-off. Never batch-suppress a file or directory.

The live example in this repository is the retry-jitter `Math.random` in
`sdk/src/client.ts` (`read()`): randomness quality is irrelevant when the
worst case is a slightly longer backoff, and the value never becomes a key,
nonce or token.

## cargo-geiger and the first-party `unsafe` policy (contracts)

The `unsafe-audit` job in CI does two things:

1. **Baseline report.** `cargo geiger --format markdown` scans the workspace
   (`governance`, `token`) and the whole dependency tree for `unsafe` usage.
   The report is written to the job summary and uploaded as the
   `cargo-geiger-report` artifact. This is informational: a change in the
   dependency numbers is a review signal, not a build failure. A tool or
   toolchain failure warns instead of failing the job, so a reporting tool
   can never wedge the pipeline.
2. **First-party gate (blocking).** A grep over
   `contracts/governance/src` and `contracts/token/src` fails the job if any
   `unsafe` construct (`unsafe {`, `unsafe fn`, `unsafe impl`, `unsafe
   extern`, `allow(unsafe_code)`) appears.

### Policy: new `unsafe` in first-party code

The contracts are `#![no_std]` Soroban code; `unsafe` should essentially never
be necessary. If a contribution genuinely needs it:

1. The PR description must contain an explicit justification: what cannot be
   expressed in safe Rust, why, and why the risk is acceptable.
2. The PR must update the `Forbid unsafe in first-party contract code` step in
   `.github/workflows/ci.yml` in the same commit — which forces the change
   into review rather than letting it land quietly.
3. Every `unsafe` block must carry a `// SAFETY:` comment stating the
   invariants the caller upholds.
4. The justification is repeated on the audit-scope freeze if the change is
   in flight during an engagement (see [Audit Scope](audit-scope.md)).

### Policy: `unsafe` in dependencies

Dependency `unsafe` is expected (allocators, hashers, encoding crates) and is
**not** automatically a vulnerability. It is handled by:

- reading the geiger baseline when reviewing a dependency bump — a large jump
  or a new crate containing unsafe deserves a look;
- `cargo audit` for known advisories in the same tree;
- the audit focus areas in [Audit Scope](audit-scope.md) for anything the
  baseline makes newly relevant.

### Running locally

```bash
cargo install cargo-geiger --locked
cd contracts
cargo fetch --locked
cargo geiger --format markdown
```

### Note on the grep gate

The gate matches source text, so a **comment** containing `unsafe {` (for
example, explaining what a function does not do) also matches. Reword the
comment or, if that is unreasonable, adjust the pattern in the same PR with
the reasoning in the description.
