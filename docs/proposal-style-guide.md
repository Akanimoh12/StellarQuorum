# Proposal Style Guide

A well-written proposal is the foundation of informed governance. This guide covers the structure, tone, and required sections for each proposal category so that voters can understand what they're deciding on without confusion or ambiguity.

## General Principles

1. **Clarity first:** Use plain language; assume readers have governance knowledge but not technical depth on this specific topic
2. **Be complete:** Include everything a voter needs to make an informed decision — don't leave them guessing
3. **Be honest:** Acknowledge risks, tradeoffs, and alternatives you considered; hiding downsides undermines trust
4. **Be concise:** Each section should be 2–4 sentences unless the topic demands more; voters are busy
5. **Be immutable:** Once on-chain, proposals cannot be edited; draft carefully

## All Proposals: Required Sections

Every proposal, regardless of category, must include:

### Title (Mandatory)
- **Length:** ≤100 characters
- **Format:** Lowercase except proper nouns; no markdown
- **Examples:**
  - `Extend voting window from 5 to 7 days for complex proposals`
  - `Allocate 50k QUORUM for Certora security audit`
  - `[SIGNAL] Community preference on delegation UI design`

The title is voters' first impression and appears in lists and notifications. Make it specific and action-oriented.

### Description / Rationale (Mandatory, 150–300 words)
- **What's the problem?** Why does this proposal matter?
- **Why now?** What changed that makes this timely?
- **Who benefits?** Whose interests does this serve?

**Example (Too Vague):**
> "We should improve the voting window because it's important for governance."

**Example (Better):**
> "Complex proposals like contract upgrades require more careful review than straightforward parameter changes. The current 5-day window gives voters insufficient time for technical evaluation, leading to rushed decisions. Extending to 7 days addresses this without materially slowing governance."

### Voting Mechanics (Mandatory)
- **For / Against / Abstain:** What does each outcome mean?
- **Threshold:** What percentage of votes is required to pass? (Simple majority, supermajority, etc.)
- **Quorum requirement:** What's the minimum participation?

**Example:**
> "Vote FOR to approve the parameter change, AGAINST to reject. A simple majority (>50%) with 5% quorum (default) is required to pass. Abstain is allowed and counts toward quorum but not toward FOR/AGAINST tallies."

### Expected Outcome (Mandatory, 1–3 sentences)
- If the proposal passes, what happens next?
- Who is responsible for executing it? (usually specified in the smart contract)
- When does it take effect?

**Example:**
> "If passed, the voting window will be updated to 7 days (50,400 ledgers) on the next contract upgrade, scheduled for November 15. No action is required from voters; the change executes automatically via the timelock mechanism."

### Links and References (Mandatory if applicable)
- Link to the related issue or pull request
- Link to any technical documentation
- Links to prior discussions in GitHub Discussions

**Example:**
> "Issue: #287 | Implementation PR: #301 | Discussion: https://github.com/.../discussions/4521"

---

## Category-Specific Sections

### Parameter Change Proposals

**Required Sections:**

1. **Current Value** — What is it today?
2. **Proposed Value** — What should it be?
3. **Rationale** — Why change it?
4. **Impact** — How will this affect governance, users, or the system?
5. **Risks & Mitigations** — What could go wrong? How will you address it?
6. **Alternatives** — What else did you consider and reject, and why?

**Tone:** Technical but accessible; assume the reader understands governance but not this specific contract parameter.

**Example Structure:**
```
Title: Increase quorum threshold from 5% to 10%

Current Value: voting_quorum = 5% (500K QUORUM tokens)

Proposed Value: 10% (1M QUORUM tokens)

Rationale: [3–4 sentences explaining why higher quorum is needed]

Impact: Proposals will require more participation; expect fewer votes to pass; protects against low-participation attacks.

Risks & Mitigations:
- Risk: Governance becomes slower
  Mitigation: We observe trends for 2 months before discussing further changes
  
Alternatives Considered:
1. Increase timelock veto period instead — rejected because...
2. Add a two-tier system — rejected because...
```

### Treasury Spend Proposals

**Required Sections:**

1. **Recipient** — Who receives the funds? Is it a person, multisig, or contract?
2. **Amount** — How much, and why this amount?
3. **Budget Breakdown** (if amount >10K QUORUM) — How is the money allocated?
4. **Purpose** — What will the funds be used for?
5. **Timeline** — When do they spend it? When is it complete?
6. **Success Metrics** — How will we know the spend achieved its goal?
7. **Risks & Mitigations** — What could go wrong? What's your fallback?

**Tone:** Business-like and transparent; treat it like a grant application.

**Example Structure:**
```
Title: Allocate 50k QUORUM for Certora security audit

Recipient: GCERTORA... (Certora Labs multisig, controlled by 3-of-5 signers)

Amount: 50,000 QUORUM (~$1.2M)

Budget Breakdown:
- Base audit (6 weeks): 40,000 QUORUM
- Extended delegation review: 8,000 QUORUM
- Follow-up fixes (2 weeks): 2,000 QUORUM

Purpose: Security audit of governance contract v1.5 before mainnet deployment

Timeline:
- Week 1 (approval): Treasury transfer
- Weeks 2–7: Audit in progress
- Week 8: Initial findings
- Weeks 9–10: Remediation and final report

Success Metrics:
- Report delivered within 6 weeks
- All critical findings resolved
- No critical/high-severity issues in final report

Risks & Mitigations:
- Risk: Audit uncovers blocking issues
  Mitigation: We begin work immediately in parallel; delays are communicated weekly
- Risk: Market downturn makes 50K tokens expensive
  Mitigation: We obtained bids from Trail of Bits and Zellic as backups; 50K is the median
```

### Signaling Proposals (Non-Binding)

**Required Sections:**

1. **Question or Topic** — What are we signaling on?
2. **Options** — What are voters choosing between? (usually 2–3 options)
3. **Why This Matters** — Why does the community's input matter here?
4. **Consequences** — What will the governance team do with the result? (Is it binding? Advisory?)
5. **Background / Context** — Links to designs, RFCs, discussions, etc.

**Tone:** Conversational and collaborative; emphasize that you're seeking input, not imposing.

**Example Structure:**
```
Title: [SIGNAL] Preferred approach for delegation UI design

Question: Should delegation take effect immediately (sync) or in the next voting window (async)?

Options:
FOR = Async delegation (safer, slightly higher friction)
AGAINST = Sync delegation (simpler, accepted risk)

Why This Matters: This choice affects UX complexity, security posture, and launch timeline.

Consequences: The winning design (determined by simple majority) will be implemented in the next sprint. This is binding on the development team.

Background:
- Design docs: https://...
- Security analysis: https://...
- Community discussion: https://github.com/.../discussions/451

Voting Timeline: [dates]
```

### Info/Status Proposals (Non-Binding)

**Required Sections:**

1. **Period Covered** — What time period does this cover?
2. **Key Metrics** — What numbers matter? (participation, issues, PRs, etc.)
3. **Highlights** — What went well?
4. **Issues or Concerns** — What didn't go as expected?
5. **Upcoming** — What's next?
6. **Call to Action** — Do you need community input or feedback?

**Tone:** Informative and transparent; think of this as a regular status report.

**Example Structure:**
```
Title: [INFO] October 2024 Governance Status Update

Period: October 1–31, 2024

Key Metrics:
- Proposals voted on: 47
- Pass rate: 89%
- Average participation: 234K QUORUM (18% of supply)
- Community call attendance: 38 people

Highlights:
- [list 3–5 things that went well]

Concerns:
- [any blockers, risks, or things that didn't work as expected]

Upcoming (November):
- Delegation UI launch
- Security audit report
- [other items]

Feedback: Do you have ideas on how we can improve governance? Share in Discussions > Governance Questions.
```

---

## Tone Guidelines

| Category | Tone | Focus |
|---|---|---|
| Parameter Change | Technical, precise | Numbers, effects, risks |
| Treasury Spend | Professional, transparent | Budget, timeline, success metrics |
| Signaling | Collaborative, open | Options, context, input sought |
| Info/Status | Candid, regular | Metrics, progress, upcoming work |

---

## Common Pitfalls to Avoid

1. **Burying the ask:** State what you want up front, not in the last paragraph
2. **Assuming knowledge:** "The usual stakeholders will..." — say *who*
3. **Omitting risks:** Voters assume you're hiding something if you don't mention downsides
4. **Vague success criteria:** "We'll know it worked because..." — be measurable
5. **Forgetting the why:** Don't just say what; explain why this matters *now*
6. **Ignoring alternatives:** If you didn't consider options, say so; if you did, explain the choice
7. **Setting unrealistic timelines:** Under-promise and over-deliver on execution dates

---

## Before You Post

- [ ] Title is ≤100 characters and specific
- [ ] Rationale answers "why now?"
- [ ] Voting mechanics are crystal clear
- [ ] All required sections are included
- [ ] Risks are acknowledged, not hidden
- [ ] Timeline or success metrics are measurable
- [ ] Links to supporting docs are included
- [ ] You've run it past a peer reviewer (optional but recommended)

---

## Examples

See [proposal-examples.md](proposal-examples.md) for fully-worked examples of each category.

## Questions?

Ask in [GitHub Discussions > Governance Questions](https://github.com/StellarQuorum/StellarQuorum/discussions/categories/governance-questions) or at the monthly community call.
