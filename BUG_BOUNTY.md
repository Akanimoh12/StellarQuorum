# Bug Bounty Program

This policy describes how Stellar Quorum handles security reports that may be
eligible for a reward. The program is **not currently funded or active**. A
report is not entitled to payment unless the maintainers publish an active
program notice with its budget, reward ranges, and payment terms before the
report is submitted. Responsible disclosure is welcome regardless of whether a
reward is available.

## In-Scope Components

Reports must demonstrate a security impact in code maintained in this
repository:

| Component | In-scope paths | Examples |
|---|---|---|
| Soroban contracts | `contracts/governance/`, `contracts/token/` | Unauthorized proposal execution, voting or delegation accounting errors, quorum or timelock bypass, loss or locking of assets |
| TypeScript SDK (`@quorum/sdk`) | `sdk/` | Incorrect transaction construction, signature or authorization bypass, unsafe handling of secrets |
| Web application | `frontend/` | Cross-site scripting, wallet authorization flaws, or security-relevant display of false on-chain state |
| Deployment automation | `scripts/`, `.github/workflows/` | Secret exposure or deployment of unintended contract/code artifacts |

Only the latest commit on `main` is supported. A vulnerability must affect
production-intended code; test-only code and issues limited to local development
are not eligible for a monetary reward.

## Severity

Maintainers assign severity based on demonstrated impact, exploitability,
affected users, and any required attacker privileges. These categories guide
triage; they do not guarantee a particular reward.

| Severity | Impact guide |
|---|---|
| Critical | Direct, substantially unauthorized control or loss of protocol/DAO funds; systemic compromise of governance; or an exploit that makes core protocol guarantees broadly ineffective without unusual prerequisites. |
| High | Material unauthorized governance actions, significant theft or permanent loss/lock of funds, or a broad compromise of user security that is practically exploitable. |
| Medium | A meaningful but limited security impact, such as a bounded denial of service, a bypass requiring significant constraints, or an issue affecting a subset of users without direct major loss. |
| Low | A narrowly scoped issue with limited security consequences, difficult exploitation, or a defense-in-depth weakness without a demonstrated material impact. |

Informational observations, best-practice suggestions, and bugs without a
demonstrable security impact are not bounty-eligible.

## Eligibility and Exclusions

A report may be considered for a reward only if it:

- Is the first valid report of the issue and is submitted privately through the
  channel in [SECURITY.md](SECURITY.md).
- Identifies an in-scope component and provides enough detail to reproduce the
  issue and understand its security impact.
- Is submitted in good faith, without accessing or altering other users'
  accounts or data, disrupting services, or publicly disclosing the issue
  before coordinated resolution.
- Does not rely on a compromised key/device, a third-party contract, or a
  vulnerability in Stellar, Soroban, a wallet, or another dependency without a
  demonstrated vulnerability in this repository.

The existing exclusions in [SECURITY.md](SECURITY.md#scope) also apply.
Duplicate reports, reports of issues already known to the maintainers, and
reports that only describe expected behavior are not eligible. Testing must be
limited to accounts and testnet deployments controlled by the researcher; do
not test against mainnet users or funds.

## Triage and Response Targets

Reports are handled through the private disclosure process in
[SECURITY.md](SECURITY.md#reporting-a-vulnerability). Maintainers will:

1. Acknowledge receipt within **3 business days**.
2. Make an initial validity and severity assessment within **7 days**. If more
   information is needed, they will ask through the private report.
3. Confirm the final severity and reward eligibility after reproducing the
   issue and assessing its impact. The initial assessment may change as facts
   are verified.
4. Provide a status update at least every **14 days** until resolution, and
   coordinate a fix and disclosure timeline with the reporter.

These are targets, not guarantees; the project is volunteer-maintained. The
fix targets for critical and high severity issues in `SECURITY.md` continue to
apply.

## Reward Decisions and Payment

While no funded program is active, maintainers may acknowledge and credit
reports but cannot promise or imply a monetary reward. When a funded program is
announced, its notice must state the per-severity reward ranges, budget or
limits, eligible deployment/environment, supported assets, and payment terms.
Those terms apply to reports submitted after the announcement.

For an eligible report under an active program, maintainers will determine the
award after validating the finding and assigning final severity. The decision
will account for impact, exploitability, report quality, and program limits;
the highest-impact demonstrated consequence is considered, and duplicate
findings are paid at most once. The reporter will be told the proposed award
privately and can accept or decline it. Payment is arranged with the reporter
through a mutually agreed method, subject to the active program's terms and any
applicable legal requirements. No payment details should be included in a
public issue or disclosure.
