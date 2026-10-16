# Example Governance Proposals

This document provides realistic, fully-worked examples of each proposal category to help new governance participants understand what a well-formed proposal looks like.

## Category 1: Parameter Change

### Example: Increase Voting Window from 5 to 7 Days

**Title:** Extend voting window from 5 to 7 days for higher-complexity proposals

**Rationale:**
Complex proposals (e.g., contract upgrades, major feature releases) currently require voters to make decisions within 5 days. This timeline works for straightforward parameter changes but leaves insufficient time for careful review of contract changes or architectural decisions. Extending the voting window by 2 days provides:
- More time for technical review and discussion in governance calls
- Better accommodation of international time zones and work schedules
- Reduced risk of rushed decisions on high-impact changes

**Requested Action:**
Change the governance contract parameter `voting_window_ledgers` from `36000` (≈5 days at 6 ledgers/second) to `50400` (≈7 days).

**Risks & Mitigations:**
- **Risk:** Longer voting windows may lead to lower participation or voter fatigue
  - *Mitigation:* Maintain monthly governance calls to keep proposals top-of-mind; monitor participation metrics after the change
- **Risk:** Coordination attacks might have more time to organize
  - *Mitigation:* The timelock delay (48 hours) remains unchanged, and we retain the guardian multisig veto

**Alternatives Considered:**
1. Create two voting windows (5 days for parameter changes, 7 for contract changes) — rejected as adding complexity
2. Require explicit proposal categorization at creation time — rejected as introducing friction
3. Extend the timelock instead of voting window — rejected as less directly addressing the issue

**Voting Outcome:** Propose a simple FOR/AGAINST vote; 50% threshold with quorum.

---

## Category 2: Treasury Spend

### Example: Fund a Third-Party Security Audit

**Title:** Allocate 50,000 QUORUM for Certora security audit of governance contract v1.5

**Rationale:**
The governance contract has been in production for 18 months and is scheduled for a significant upgrade (delegation support, multi-sig proposals). Before deploying v1.5, a formal security audit by an established firm is prudent. Certora has experience with Soroban and governance contracts and can deliver within 6 weeks.

**Requested Action:**
Transfer 50,000 QUORUM from the governance treasury (current balance: 2.1M) to `GCERTORA...` (multisig address controlled by Certora, escrowed for the audit engagement).

**Budget Breakdown:**
- Base audit: 40,000 QUORUM
- Extended review of delegation logic: 8,000 QUORUM
- 2 weeks of follow-up fixes and re-testing: 2,000 QUORUM
- **Total: 50,000 QUORUM** (~$1.2M at current market rates)

**Risks & Mitigations:**
- **Risk:** Audit may uncover critical issues delaying the v1.5 launch
  - *Mitigation:* Audit begins immediately; findings are addressed in parallel with ongoing development
- **Risk:** Market downturn could make 50K QUORUM an unexpectedly large spend
  - *Mitigation:* Audit is priced in QUORUM to align incentives; alternative quotes from Trail of Bits obtained for comparison

**Alternatives Considered:**
1. Defer audit to post-launch — rejected; security-critical before deployment
2. Audit only the delegation feature, not the full contract — rejected; new functionality interacts with existing code
3. Use internal code review instead of external audit — rejected; external auditor provides independent verification

**Success Metrics:**
- Audit report delivered within 6 weeks
- Critical findings resolved within 2 weeks of report
- No critical or high-severity issues remain before mainnet deployment

**Timeline:**
- Week 1: Governance vote and treasury transfer
- Weeks 2–7: Audit in progress
- Week 8: Initial report and remediation planning
- Weeks 9–10: Follow-up testing and final report

---

## Category 3: Signaling (Non-Binding)

### Example: Community Consensus on Delegation UI Design

**Title:** [SIGNAL] Prefer async delegation over sync in governance UI

**Rationale:**
The roadmap includes delegation UI. Two designs have been prototyped:

1. **Sync delegation** (current draft): User submits a delegation tx, votes with delegated power immediately in the same voting window
2. **Async delegation** (alternative): User submits delegation tx now; it takes effect in the *next* proposal, preventing flash-loan delegation abuse

A sync model is simpler to implement but creates a griefing vector (delegate right before voting ends). An async model is more complex but safer. This signal seeks community consensus before we finalize the implementation.

**Requested Action:**
Vote FOR to indicate preference for async delegation (safer, slightly higher UX friction), or AGAINST to prefer sync delegation (simpler, acceptable risk with timelock veto).

**Visual Mockups:**
- [Async delegation flow](https://github.com/StellarQuorum/StellarQuorum/pull/401) (see PR screenshots)
- [Sync delegation flow](https://github.com/StellarQuorum/StellarQuorum/pull/405) (see PR screenshots)

**Next Steps:**
The winning design will be implemented in the next 2 sprints. Signaling is non-binding, but the governance team commits to respecting the vote and explaining any deviation.

---

## Category 4: Info/Status (Non-Binding)

### Example: Monthly Governance Status Update

**Title:** [INFO] October 2024 Governance Status and Roadmap Update

**Summary:**
- 47 proposals voted on in October; 89% passed
- Delegation feature 70% complete; targeting November launch
- Security audit findings: 2 medium, 0 critical; fixes in progress
- Community call attendance averaging 38 participants

**Highlights:**
1. **Voting participation:** Up 12% YoY; timelock vetoes used twice (both executed correctly)
2. **New contributors:** 14 good-first-issues claimed; 9 merged
3. **Upcoming:** Testnet deployment of v1.5 in 2 weeks; audit complete in 3 weeks

**Roadmap Ahead:**
- November: Delegation UI launch
- December: Mainnet security audit begins
- Q1 2025: Multi-sig proposal creation, analytics dashboard

---

## Tips for Writing Your Own Proposal

See [proposal-style-guide.md](proposal-style-guide.md) for detailed guidance on structure, tone, and required sections for each proposal type.

## Questions on These Examples?

Ask in [GitHub Discussions > Governance Questions](https://github.com/StellarQuorum/StellarQuorum/discussions/categories/governance-questions) or join the monthly community call.
