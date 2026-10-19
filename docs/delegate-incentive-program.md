# Delegate Incentive Program Design

## Overview

This document explores incentive models for delegate participation in Quorum governance. Active delegation is critical for governance at scale: it allows token holders who cannot participate directly to delegate their voting power to trusted representatives, ensuring proposals reach quorum and decisions reflect diverse perspectives.

However, being a good delegate requires significant effort: understanding proposals, voting consistently, communicating reasoning to delegators, and maintaining transparency. Without incentives, delegation may stagnate, limiting governance participation to whales and highly engaged insiders.

This document evaluates incentive models and provides a recommendation for Quorum's delegate program.

---

## Incentive Model 1: Drips Wave Points (Reputation-Based)

### Description

Delegates earn **Drips Wave points** based on their governance participation metrics. Points are non-transferable and track reputation within the ecosystem. Top delegates receive recognition (e.g., a "Verified Delegate" badge on the governance UI) and may be prioritized for future governance roles (e.g., guardian multisig seats).

### Metrics

Points are awarded quarterly based on:

| Metric | Weight | Criteria |
|--------|--------|----------|
| **Vote participation** | 40% | % of proposals voted on while holding delegated power |
| **Vote quality** | 30% | Votes aligned with quorum-winning side (indicates research) |
| **Communication** | 20% | Published rationale for votes (e.g., GitHub comments, forum posts) |
| **Tenure** | 10% | Continuous delegation held over 6+ months |

### Trade-offs

**Pros:**
- Low implementation complexity: no token transfers, no treasury management
- Aligns with existing Drips Wave infrastructure
- Avoids regulatory complexity (points are not financial rewards)
- Encourages long-term reputation building over short-term profit-seeking
- Fosters a culture of thoughtful governance engagement

**Cons:**
- May not attract enough delegates if governance is time-intensive
- Points are abstract; value depends on ecosystem recognition
- Harder to quantify delegate ROI compared to direct token rewards
- Reputation-based systems can favor established voices over new entrants

### Implementation Requirements

- Track delegation on-chain (delegate `delegatee` field in governance contract)
- Off-chain indexer calculates metrics from contract events
- Governance UI displays delegate rankings and points
- Quarterly "delegate leaderboard" published in governance updates

---

## Incentive Model 2: Dedicated Reward Pool (Token-Based)

### Description

A portion of the QUORUM token supply (e.g., 5%) is allocated to a **delegate reward pool**. Delegates earn QUORUM tokens based on their voting participation and the amount of voting power delegated to them. Rewards are distributed quarterly via an on-chain claim mechanism.

### Reward Formula

Rewards are calculated per-delegate per-quarter:

```
reward = pool_share * (delegated_power * participation_rate * activity_multiplier)

where:
- pool_share = 1 / (sum of all delegate scores)
- delegated_power = average QUORUM delegated to delegate during quarter
- participation_rate = proposals_voted / total_proposals
- activity_multiplier = 1.0 if delegate voted on ≥ 80% of proposals, else 0.5
```

### Trade-offs

**Pros:**
- Direct financial incentive aligns delegate economics with governance health
- Attracts professional delegates and governance service providers
- Delegates can build sustainable governance businesses
- Transparent, on-chain rewards distribution

**Cons:**
- Requires treasury management and security (reward pool is a target)
- Regulatory complexity: token rewards may be treated as income in some jurisdictions
- Risk of "delegate farming": delegates chase delegation volume over vote quality
- Requires token liquidity (sell pressure from delegates claiming rewards)
- Complex implementation: needs on-chain claim logic and off-chain indexing

### Implementation Requirements

- Deploy a separate `DelegateRewardContract` (or add to governance contract)
- Allocate reward pool at governance initialization (e.g., 5% of 100M supply = 5M QUORUM)
- Off-chain indexer calculates delegate scores quarterly
- Admin or multisig calls `distribute_rewards()` each quarter
- Delegates call `claim_rewards()` to receive QUORUM

### Security Considerations

- Reward pool must be protected by multisig (not single admin)
- Claim function should have a vesting period (e.g., 6 months) to discourage governance attacks
- Reward formula should be reviewed by community before deployment
- Consider adding a "slashing" mechanism for malicious delegate behavior

---

## Incentive Model 3: Recognition-Only (No Incentive Program)

### Description

No formal incentive program. Delegates participate voluntarily, motivated by:
- Alignment with protocol success (they may hold QUORUM)
- Reputation and influence in the Stellar ecosystem
- Civic duty to the community

Recognition is limited to social acknowledgment (e.g., governance update shout-outs) and optional on-chain metadata (e.g., delegate profile bio in governance UI).

### Trade-offs

**Pros:**
- Zero implementation cost
- No treasury or regulatory burden
- Avoids financial misalignment (delegates vote based on conviction, not rewards)
- Simple governance model

**Cons:**
- Likely insufficient for governance at scale
- Delegates may burn out without clear ROI
- Governance vulnerable to low participation (quorum failures)
- Hard to attract professional delegates from other ecosystems

---

## Recommendation

### Phase 1: Recognition + Drips Wave Points (Launch to 6 Months)

**Rationale:** In the early stages, governance participation is experimental. Direct token rewards create unnecessary complexity and risk before the system is proven. A reputation-based model encourages thoughtful participation without financial overhead.

**Implementation:**
- Deploy delegation in governance contract (already planned)
- Build off-chain indexer to track delegate metrics
- Publish quarterly delegate leaderboard with Drips Wave points
- Add "Verified Delegate" badge to governance UI for top 10 delegates
- Recognize top delegates in community calls and governance updates

**Success Criteria:**
- At least 20 delegates with > 10,000 QUORUM delegated each by month 6
- Average delegate vote participation > 70%
- Governance proposals consistently reach quorum

### Phase 2: Evaluate Token-Based Rewards (Post-Launch)

After 6 months, evaluate the following:
- Is delegation volume sufficient for governance health?
- Are delegates participating consistently?
- Is the protocol ready to manage a reward pool securely?

If delegation is still insufficient, **deploy a dedicated reward pool** (Model 2) with:
- 3% of QUORUM supply allocated to rewards (3M QUORUM)
- Quarterly distribution with 6-month vesting
- Slashing mechanism for governance attacks

If delegation is healthy without token rewards, **continue with recognition-only** and revisit annually.

---

## Alternative: Hybrid Model

A hybrid approach combines both models:
- **Base rewards:** Small Drips Wave points for participation (recognition)
- **Performance bonuses:** Token rewards for top 10 delegates each quarter (from reward pool)

This balances low-barrier participation with high-performance incentives. However, it adds complexity and may be unnecessary if either model works well on its own.

---

## Governance Considerations

Any incentive program should be governed by the community:

1. **Initial parameters** (e.g., reward pool size, metrics) should be set via on-chain proposal
2. **Metric adjustments** (e.g., changing weights in the points formula) require governance approval
3. **Reward pool changes** (e.g., increasing allocation) require governance approval
4. **Delegate eligibility** (e.g., minimum delegation threshold) should be transparent and on-chain

---

## References

- [Delegate Directory](https://github.com/StellarQuorum/StellarQuorum/issues/XXX) - Proposed delegate registry
- [Delegate Program Guide](https://github.com/StellarQuorum/StellarQuorum/issues/XXX) - Proposed guide for delegates
- [Drips Wave](https://www.drips.network/wave) - Stellar Wave points infrastructure
- [Governance Parameters](./governance-parameters.md) - Quorum parameter tuning guide
