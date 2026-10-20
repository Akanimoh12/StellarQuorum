# Audit Scope: Governance and Token Contracts

This document defines the scope, process and deliverables for a third-party
security audit of Quorum's two Soroban contracts. It exists so an engagement
can be quoted, contracted and reviewed against a written target rather than an
informal conversation, and so findings have a pre-agreed home as follow-up
issues. Tracking issue: [#330](https://github.com/StellarQuorum/StellarQuorum/issues/330).

## Status

| Step | Status | Notes |
|---|---|---|
| Scope document in `docs/` | **Done** | This file |
| Auditor selection (quotes) | Pending | Maintainers to solicit/compare; a Soroban-focused auditor has already offered a quote in [#330](https://github.com/StellarQuorum/StellarQuorum/issues/330) |
| Engagement signed on a frozen commit | Pending | Freeze = tagged commit + recorded wasm hashes (see [Freezing the target](#freezing-the-target)) |
| Fieldwork | Pending | |
| Findings tracked as follow-up issues | Pending | One issue per finding, labelled by severity |
| Remediation and retest | Pending | |
| Public summary published | Pending | Per the disclosure spirit of [SECURITY.md](../SECURITY.md) |

## In scope

Both contracts in `contracts/`, including every exported (public) function,
all storage they read or write, cross-contract invocations, events, and the
auth model of each entry point.

### Governance contract (`contracts/governance`)

| Area | Functions |
|---|---|
| Lifecycle | `initialize`, `create_proposal`, `cancel`, `finalize`, `execute`, `mark_expired`, `extend_proposal_ttl` |
| Voting | `vote`, `has_voted`, `get_vote`, `get_voting_power` |
| Administration | `transfer_admin`, `accept_admin`, `cancel_admin_transfer`, `pause`, `unpause` |
| Reads | `version`, `get_config`, `get_proposal`, `get_proposal_count`, `get_proposals`, `get_proposals_by_proposer`, `has_reached_quorum` |
| Cross-contract | `TokenClient` calls into the token at `Config::token` (`total_supply`, `balance`, `get_past_balance`) |

### Token contract (`contracts/token`)

| Area | Functions |
|---|---|
| Lifecycle | `initialize`, `mint`, `burn`, `burn_from` |
| Transfers | `transfer`, `transfer_from` |
| Allowances | `approve`, `allowance` (SEP-41 expiry semantics) |
| Snapshots | `get_past_balance`, `get_past_total_supply` (checkpoint history and pruning) |
| Administration | `transfer_admin`, `accept_admin`, `cancel_admin_transfer` |
| Metadata | `name`, `symbol`, `decimals`, `total_supply`, `balance`, `spendable_balance`, `version` |

### Focus areas

1. **Proposal state machine.** Status transitions in
   `create_proposal` → `vote` → `finalize` → `execute` / `mark_expired` /
   `cancel`: double finalization, execution of non-queued proposals,
   re-entrancy through future action dispatch, timelock and
   `execution_grace_period` boundary arithmetic.
2. **Quorum and threshold math.** `quorum_for_supply`, `add_weight`, the
   basis-point bounds (`MIN`/`MAX_QUORUM_BPS`), checked-arithmetic paths and
   any input that can trap instead of returning a declared error.
3. **Snapshot voting power.** Checkpoint recording, collapse-per-ledger in
   `record`, binary search in `value_at`, retention pruning in `set_balance`,
   and the same-ledger mint/create mismatch documented in
   `get_past_total_supply`.
4. **Token authority.** Auth on `mint`/`burn`/`approve`, allowance
   expiry and partial spends, `transfer_from` ordering, supply/balance
   invariants under all mutation paths.
5. **Governance ↔ token trust boundary.** What a passed proposal can and
   (today) cannot do; the `execute` TODO for action dispatch; effects of a
   stale `Config::token` or a malicious token implementation behind the
   client trait.
6. **Storage and economics.** TTL extension (`touch_*`), rent exposure under
   spam, persistent-vs-instance storage choice, event completeness for
   off-chain reconstruction.
7. **Authorization.** Every `require_auth` call site; admin two-step transfer
   races; guardian pause scope; whether any path lets one role exercise
   another's power.

## Out of scope

- `frontend/`, `sdk/`, `scripts/`, and off-chain infrastructure (these are
  covered by ESLint, Semgrep, `cargo audit` and `npm audit` — see
  [static analysis](static-analysis.md)).
- `contracts/fuzz/` harness code (unless the audit finds a bug the harness
  should have caught).
- Vulnerabilities in third-party dependencies with no demonstrated impact on
  the contracts (same policy as [SECURITY.md](../SECURITY.md)).
- The Stellar network, Soroban runtime, and wallet software.
- Gas/rent optimisation suggestions that carry no security impact (welcome as
  ordinary issues, not audit findings).

## Deliverables

1. **Findings report** with severity (Critical / High / Medium / Low /
   Informational), affected function(s), impact, reproduction steps, and a
   recommended mitigation for each.
2. **Runnable proof of concept** for every confirmed finding: a `soroban`
   test against the real contracts (no mocked dependencies) or an equivalent
   reproducible script.
3. **Retest** of fixes on the remediation commits.
4. **Public summary**, even if abbreviated, once remediation is complete —
   per the disclosure policy in [SECURITY.md](../SECURITY.md). Full reports
   may stay private until the embargo the engagement sets expires.

## Process

1. **Select an auditor.** Solicit at least two quotes. Selection criteria:
   demonstrated Soroban/Rust experience (a public report on a Soroban
   contract is worth more than general blockchain audit history), a named
   reviewer, willingness to work from a signed scope on a frozen commit, and
   a retest window included in the price.
2. **Freeze the target.** The audit runs against one commit, not a moving
   branch (see below).
3. **Sign the scope.** This document, the frozen commit hash, the wasm
   hashes, timeline, price, embargo terms and disclosure plan go into the
   engagement agreement.
4. **Track findings.** Each confirmed finding becomes a GitHub issue
   (`audit: <title>`, severity label) so remediation is visible and
   reviewable in public, matching how earlier hardening work was tracked.
5. **Remediation and retest.** Fixes land as ordinary PRs referencing their
   finding issue; the auditor retests and the issue closes with the auditor's
   confirmation.
6. **Publish the summary** and tick the roadmap item in the
   [README](../README.md).

### Freezing the target

- Tag the audited commit (e.g. `audit-freeze-YYYY-MM`).
- Record the wasm hashes. The [Contract specs workflow](../.github/workflows/contract-specs.yml)
  builds `quorum_governance.wasm` and `quorum_token.wasm` on every run and
  attaches them to releases; the engagement should cite the hashes of the
  artifacts built from the frozen commit.
- The audited commit must pass full CI (build, clippy, tests, coverage,
  `cargo audit`) with no skips.

## Remediation policy

| Severity | Target |
|---|---|
| Critical / High | Fix or mitigating configuration before any mainnet deployment; 30 days where feasible |
| Medium | Next release |
| Low / Informational | Best effort, tracked publicly |

Any finding that is triaged as a false positive or accepted risk is recorded
in the finding issue with the rationale, not silently dropped — the same
standard the [Known Gaps](security-model.md#known-gaps) section of the
security model follows.

## Related documents

- [Security Model & Threat Assumptions](security-model.md) — the vectors the
  diagram and prose establish, which this audit is meant to pressure-test
- [SECURITY.md](../SECURITY.md) — vulnerability reporting and disclosure
- [Admin Key Management](admin-key-management.md) — custody guidance for the
  admin key the audit assumes is at risk
- [Incident Response](incident-response.md) — what to do when a finding is
  exploitable in the wild
