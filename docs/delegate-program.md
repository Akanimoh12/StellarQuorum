# Delegate Program Guide

Delegation allows token holders who don't want to research every proposal themselves to entrust their voting power to trusted representatives. This guide explains what makes a good delegate, how to become one, and how the community can recognize and reward active delegates.

---

## Overview

### What is a Delegate?

A delegate is a token holder (or group of token holders) who receives voting power from other token holders through delegation. Delegates then vote on proposals on behalf of their delegators, using their expertise and judgment to represent delegator interests.

### Why Delegation Matters

Delegation is critical for healthy governance because:

- **Increases participation** — token holders who lack time or expertise can still influence outcomes
- **Improves decision quality** — delegates can specialize in understanding complex proposals
- **Reduces voter fatigue** — not every holder needs to research every proposal
- **Enables representation** — diverse perspectives can be represented through specialized delegates

### Current Status

Delegation is planned but not yet implemented in Quorum. Track progress in:
- Issue #1 — initial delegation tracking
- Issue #47 — delegation contract design
- Issue #60 — delegation UI implementation

---

## What Makes a Good Delegate

### Core Responsibilities

A good delegate should:

1. **Vote consistently** — participate in every proposal that passes the proposal threshold
2. **Vote thoughtfully** — read proposals thoroughly, ask questions, and make informed decisions
3. **Communicate clearly** — explain voting rationale to delegators
4. **Be transparent** — disclose conflicts of interest, holdings, and decision-making process
5. **Stay engaged** — attend community calls, participate in discussions, and respond to delegator questions
6. **Act in good faith** — prioritize delegator interests over personal gain

### Expected Behavior

#### Voting Rationale

For every vote, a delegate should publish a rationale that includes:

- **Summary of the proposal** — what it does and why it matters
- **Analysis of pros and cons** — balanced view of the trade-offs
- **Your decision** — vote FOR, AGAINST, or ABSTAIN with clear reasoning
- **Expected impact** — what outcome you anticipate
- **Delegator alignment** — how this vote aligns with your delegate platform

**Example rationale:**
> "I voted FOR this proposal to increase the timelock period from 12 to 24 hours. The rationale: recent governance attacks on other protocols show that 12 hours is insufficient for guardian review. While this slows execution speed, the security benefit outweighs the cost. This aligns with my platform of prioritizing security over efficiency."

#### Communication Channels

Delegates should maintain active presence on:

- **Discord** — answer questions in governance channels
- **GitHub Discussions** — comment on proposals before voting
- **X (Twitter)** or **blog** — publish voting rationales and commentary
- **Email newsletter** — periodic updates for delegators (optional)

#### Platform Statement

Before accepting delegation, publish a delegate platform that includes:

- **Your values** — what principles guide your voting (e.g., security-first, growth-focused, conservative, experimental)
- **Your expertise** — what areas you specialize in (e.g., technical, economic, legal, UX)
- **Your availability** — how often you can vote and respond
- **Your compensation** — if you charge fees or accept donations (transparent disclosure)
- **Your track record** — past voting history (if applicable)

**Example platform:**
> "I delegate for security-focused token holders. I have 5 years of smart contract auditing experience and prioritize proposals that improve protocol security over short-term gains. I vote on every proposal within 24 hours and publish rationales on my blog. I do not charge fees but accept donations to cover my time."

### Conflict of Interest Policy

Delegates must disclose any conflicts of interest:

- **Proposals you authored** — disclose authorship and abstain if there's a personal benefit
- **Proposals from entities you're affiliated with** — disclose relationship and consider abstaining
- **Proposals that affect your holdings** — disclose if you stand to gain/lose financially
- **Compensation for voting** — disclose if you're paid to vote a certain way (and reject such arrangements)

**Rule:** If in doubt, disclose it. Transparency builds trust.

---

## Becoming a Delegate

### Prerequisites

Before accepting delegation:

1. **Understand the protocol** — read the architecture, security model, and governance parameters
2. **Hold QUORUM tokens** — you need skin in the game (minimum amount TBD)
3. **Publish a platform** — create a delegate statement (see above)
4. **Set up communication channels** — Discord, GitHub, blog, etc.
5. **Participate in governance** — vote on proposals before accepting delegation to demonstrate your approach

### Registration

Once delegation is implemented, registration will likely involve:

1. **Call `delegate(to)`** — designate yourself as your own delegate initially
2. **Add yourself to the delegate directory** — frontend for discovering delegates (see related issue)
3. **Announce your candidacy** — post on Discord, GitHub Discussions, and social media
4. **Start accepting delegations** — token holders can delegate to you via the UI

### Onboarding Delegators

When attracting delegators:

- **Be responsive** — answer questions promptly and thoroughly
- **Be consistent** — vote on every proposal and publish rationales
- **Be humble** — acknowledge mistakes and correct course
- **Be patient** — building a delegation base takes time

---

## Recognizing and Rewarding Delegates

### Delegate Performance Metrics

The community should track these metrics to evaluate delegates:

| Metric | How to Measure | Good Target |
|--------|-----------------|-------------|
| **Participation rate** | % of proposals voted on | > 90% |
| **Response time** | Average time from proposal creation to vote | < 48 hours |
| **Rationale quality** | Delegator ratings or community assessment | Subjective |
| **Alignment with platform** | % of votes matching stated platform | > 80% |
| **Delegator retention** | % of delegators who stay after 6 months | > 70% |

### Delegate Directory Frontend

A delegate directory frontend (planned in a future issue) will:

- List all registered delegates with their platforms
- Show performance metrics (participation, voting history)
- Allow token holders to compare delegates
- Enable one-click delegation via the UI
- Display delegate rankings based on community votes

**Features to include:**
- Search and filter by platform values (security, growth, etc.)
- Sort by participation rate, voting power, or community rating
- View detailed voting history and rationales
- Read delegate platform statements and bios

### Delegate Incentives

The delegate incentive design (planned in a future issue) should consider:

#### Option 1: Token Rewards

- Protocol allocates a portion of token inflation or treasury to delegates
- Rewards based on participation and delegator votes
- Requires governance proposal to authorize

**Pros:** Aligns delegate incentives with protocol success
**Cons:** May attract mercenaries rather than principled delegates

#### Option 2: Delegator Tips

- Delegators voluntarily send tips to delegates they appreciate
- No protocol-level mechanism needed
- Can be done on-chain or off-chain

**Pros:** Purely voluntary, market-driven
**Cons:** May not provide sufficient income for professional delegates

#### Option 3: Reputation System

- Non-monetary rewards (badges, recognition, governance privileges)
- Community votes on delegate performance
- Could unlock special roles (e.g., guardian nomination)

**Pros:** Avoids mercenary behavior, builds community
**Cons:** May not be enough to motivate full-time delegates

#### Option 4: Hybrid Model

Combine multiple approaches:
- Small protocol rewards for participation
- Voluntary tips for exceptional performance
- Reputation badges for long-term service

**Recommendation:** Start with a hybrid model and iterate based on community feedback.

### Delegate Accountability

To ensure delegates remain accountable:

1. **Undelegation is always possible** — delegators can revoke delegation at any time
2. **Voting history is public** — on-chain data shows all delegate votes
3. **Community feedback loops** — delegates can be rated or reviewed
4. **Term limits (optional)** — consider 6-12 month terms with re-approval
5. **Removal mechanism** — governance proposal to remove malicious delegates

---

## Delegator Best Practices

### Choosing a Delegate

When selecting a delegate, consider:

- **Platform alignment** — do their values match yours?
- **Track record** — have they voted consistently and thoughtfully?
- **Communication** — do they explain their votes clearly?
- **Availability** — are they responsive to questions?
- **Conflicts of interest** — are they transparent about affiliations?

### Monitoring Your Delegate

After delegating:

- **Check their voting history** periodically
- **Read their rationales** for recent votes
- **Engage with them** — ask questions, provide feedback
- **Undelegate if necessary** — if they stop voting or act against your interests

### Self-Delegation

You can always delegate to yourself to:
- Vote directly without intermediaries
- Signal your involvement in governance
- Build a track record to attract future delegators

---

## Community Governance of Delegates

### Delegate-Related Proposals

The community may vote on proposals to:

- Create or modify delegate incentive programs
- Approve protocol-funded delegate rewards
- Establish delegate performance benchmarks
- Remove malicious or inactive delegates
- Change delegation mechanics (e.g., revote periods, delegation caps)

### Delegate Council (Optional)

Consider forming a delegate council to:

- Coordinate on complex proposals
- Discuss best practices and standards
- Provide feedback to core team
- Represent delegator interests in governance

**Council structure:**
- Elected by delegates or token holders
- Rotating membership (e.g., 6-month terms)
- Advisory role (no formal power unless delegated)

---

## Technical Implementation Notes

### Delegation Mechanics (When Implemented)

Based on issues #1, #47, and #60, delegation will likely work as follows:

1. **Token holders call `delegate(to)`** to designate a delegate
2. **Voting power is calculated** as: `self_balance + sum(delegated_balances)`
3. **Delegates vote on behalf** of their delegators automatically
4. **Delegators can override** by voting directly (undelegates temporarily)
5. **Delegation persists** until revoked or changed

### Smart Contract Considerations

- **Delegation snapshot** — voting power is read at the proposal's snapshot ledger
- **Delegation revocation** — must respect snapshot timing (cannot revoke after snapshot)
- **Delegation caps** — consider limiting how much voting power one delegate can hold
- **Delegation fees** — optional mechanism for delegates to charge (if approved by governance)

---

## Case Studies

### Example 1: Security-Focused Delegate

**Profile:** Former smart contract auditor, conservative voting style
**Platform:** "I vote for security over speed. I prioritize proposals that improve audit coverage, bug bounties, and guardian capabilities. I'm skeptical of rapid parameter changes."
**Delegators:** Long-term holders, risk-averse token holders
**Performance:** 95% participation, 48-hour average response time
**Reward structure:** Accepts voluntary tips, no protocol fees

### Example 2: Growth-Focused Delegate

**Profile:** DeFi yield farmer, aggressive voting style
**Platform:** "I vote for proposals that increase token utility, integration partnerships, and liquidity incentives. I'm willing to take calculated risks for higher returns."
**Delegators:** Speculative traders, short-term holders
**Performance:** 88% participation, 24-hour average response time
**Reward structure:** Charges 1% of delegated tokens annually (disclosed upfront)

### Example 3: Technical Delegate

**Profile:** Soroban developer, specializes in technical proposals
**Platform:** "I focus on contract upgrades, parameter tuning, and integration proposals. I abstain on governance process questions I'm not qualified to judge."
**Delegators:** Developers, technically-inclined holders
**Performance:** 92% participation, 72-hour average response time (thorough analysis)
**Reward structure:** Protocol-funded reward based on participation

---

## Related Resources

### Issues and Proposals

- Issue #1 — Delegation tracking
- Issue #47 — Delegation contract design
- Issue #60 — Delegation UI implementation
- [Delegate directory frontend issue] — (to be created)
- [Delegate incentive design doc issue] — (to be created)

### Documentation

- [Security Model](security-model.md) — governance threat model
- [Governance Parameters](governance-parameters.md) — voting and delegation settings
- [Proposal Style Guide](proposal-style-guide.md) — how to write proposals
- [Proposal Examples](proposal-examples.md) — sample proposals for reference

### External Resources

- [Compound Governance Delegates](https://compound.finance/governance/delegates) — inspiration from Compound
- [Uniswap Delegates](https://docs.uniswap.org/protocol/governance/delegates) — delegation best practices
- [Aave Governance Delegates](https://governance.aave.com/delegates) — delegation mechanics

---

## FAQ

### Can I vote directly after delegating?

Yes. When you vote directly, your vote overrides your delegate's vote for that proposal only. Your delegation remains intact for future proposals.

### Can I delegate to multiple delegates?

No. Quorum uses single-delegate delegation (like Compound and Uniswap). You can only delegate to one address at a time.

### What happens if my delegate stops voting?

Your voting power is unused (you effectively abstain). You should monitor your delegate and undelegate if they become inactive.

### Can I be a delegate and also delegate to someone else?

You can self-delegate (vote for yourself) or delegate to another delegate. If you self-delegate, you vote with your own tokens plus any tokens delegated to you.

### Is delegation reversible?

Yes. You can revoke or change your delegation at any time, but the change may not take effect until the next proposal's snapshot ledger.

### Do delegates earn my tokens?

No. Delegates only earn voting power, not token ownership. Your tokens remain in your wallet unless you explicitly transfer them.

---

**Last updated:** 2025-01-XX
**Version:** 1.0
