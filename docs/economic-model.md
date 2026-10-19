# Governance Economic Model: Parameter Interplay and Token Distribution

This document models how Quorum's governance parameters — `quorum_bps`, `proposal_threshold`, and `voting_period` — interact with token distribution patterns. Understanding these dynamics is critical for setting governance parameters that resist capture while remaining functional.

## Core Principle: Effective Quorum Depends on Distribution

The raw quorum threshold (e.g., "5% of tokens must vote") has different practical effects depending on **who holds the tokens**:

- **Broad distribution** (many holders, no single large holder): A 5% quorum is achievable; requires genuine consensus.
- **Concentrated distribution** (few whales, many minnows): A 5% quorum may be captured by a single large holder voting alone.

The same parameter means very different things depending on distribution shape.

## Scenario 1: Broad Distribution (Ideal Case)

### Setup
- **Total supply:** 100M tokens
- **Distribution:** 10,000 equal holders, each with 10,000 tokens (0.01% each)
- **Top 10 holders:** ~0.1% each
- **Gini coefficient:** ~0.1 (very egalitarian)

### Parameter Values
| Parameter | Value | Real-World |
|-----------|-------|-----------|
| `quorum_bps` | 500 | 5% of supply = 5M tokens |
| `proposal_threshold` | 50,000 tokens | 0.05% of supply |
| `voting_period` | 17,280 ledgers | ~24 hours |
| `timelock_period` | 8,640 ledgers | ~12 hours |

### Analysis

**Who can propose?** ~1,000 mid-size holders (holding ≥0.05% = 50k tokens)

**Who can pass a proposal?** Any coalition of 500+ holders voting together (5% of 10,000 = 500 holders × 0.01% = 5% quorum met)

**Capture risk:** LOW

Even the top 10 holders, voting as a bloc (1% of supply) cannot unilaterally pass a proposal — they need consensus from ~4,000 additional token holders. The broad distribution makes capture difficult.

**Effective governance:** FUNCTIONAL

Proposals can achieve quorum with realistic community participation. A 5% participation rate from diverse stakeholders is achievable for contentious votes.

### Numeric Example: Fee Increase Proposal

Proposal: *Increase protocol fee from 0.25% to 0.5%*

- **For:** 2M tokens (2% of supply) — mostly small and mid-size holders
- **Against:** 3.2M tokens (3.2% of supply) — large protocols relying on low fees
- **Abstain:** 0.5M tokens (0.5% of supply)
- **Did not vote:** 94.3M tokens (94.3% of supply)

**Quorum check:** (For + Against + Abstain) = 5.7M tokens > 5M required ✅ PASSED

**Majority check:** For (2M) > Against (3.2M)? ❌ FAILED

The proposal fails because opponents outnumber supporters, even though quorum was reached. This is healthy governance — small holders and large ones had a voice, and the diverse opinions led to rejection.

---

## Scenario 2: Concentrated Distribution (Risk Case)

### Setup
- **Total supply:** 100M tokens
- **Distribution:** 
  - 1 whale (founder): 10M tokens (10%)
  - 9 dolphins (early investors): 1M tokens each (1% each)
  - 990 small holders: ~90k tokens each (~0.09% each)
- **Gini coefficient:** ~0.45 (unequal)

### Parameter Values (Same as Scenario 1)
| Parameter | Value | Real-World |
|-----------|-------|-----------|
| `quorum_bps` | 500 | 5% of supply = 5M tokens |
| `proposal_threshold` | 50,000 tokens | 0.05% of supply |
| `voting_period` | 17,280 ledgers | ~24 hours |
| `timelock_period` | 8,640 ledgers | ~12 hours |

### Analysis

**Who can propose?** ~1,000+ holders (all who hold ≥50k tokens) including the whale and all dolphins

**Who can pass a proposal?** The whale alone + at least 100 minnows (10M + 0.1M = 10.1M > 5M quorum)

**Capture risk:** HIGH ⚠️

The whale can pass proposals with minimal additional support (just 0.1% of the rest of the supply). Minnows have little power individually. Even if all 990 small holders vote against, the whale + 1 dolphin can pass a proposal (10M + 1M = 11M > 5M).

**Effective governance:** DYSFUNCTIONAL

Proposals that benefit the whale pass easily, even if the community opposes them. The governance becomes plutocratic.

### Numeric Example: Treasury Drain Proposal

Proposal: *Transfer 30% of treasury (3M USDC) to whale's DAO*

- **For:** 11M tokens (whale + 1 dolphin voting yes, plus 100 small holders bribed)
- **Against:** 5M tokens (8 dolphins voting no)
- **Abstain:** 84M tokens (did not vote)

**Quorum check:** 11M + 5M = 16M > 5M ✅ PASSED

**Majority check:** 11M For > 5M Against ✅ PASSED

**Result:** Proposal executes. The whale, with minimal coalition support, drains the treasury despite 84% of token holders not participating.

This outcome is governance capture.

---

## Comparison: How Distribution Shapes Effective Quorum

| Metric | Broad Distribution | Concentrated Distribution |
|--------|-------------------|---------------------------|
| **Quorum difficulty (effort to reach 5%)** | High | Low |
| **Sole actor veto power** | None (top 10 ≈ 1%) | Whale (10%) can nearly veto |
| **Capture resistance** | Strong | Weak |
| **Parameter sensitivity** | Parameters matter; community debate has real power | Parameters are theater; whale decides |

## Adjusting Parameters for Concentration Risk

If your governance token has a concentrated distribution, adjust parameters to reduce capture risk:

### Option 1: Raise `quorum_bps` (Harder to Reach Quorum)

**Change:** `quorum_bps` from 500 (5%) to 1000 (10%)

**Effect on Scenario 2 (Concentrated):**
- Whale + 1 dolphin (11M) < 10M required quorum ❌ FAILS to reach quorum
- Whale + 3 dolphins (13M) > 10M required quorum ✅ Passes, but needs more allies

**Cost:** Harder for legitimate proposals to reach quorum; governance slows

**When to use:** Early phase when distribution is still forming and you want to force coalition-building

### Option 2: Raise `proposal_threshold` (Harder to Propose)

**Change:** `proposal_threshold` from 50k (0.05%) to 500k (0.5%)

**Effect on Scenario 2:**
- Only whale, dolphins, and ~100 top minnows can propose
- Minnows with ~90k tokens cannot propose
- Fewer spam proposals, but governance becomes elite-only

**Cost:** Disempowers small holders; suppresses diverse ideas

**When to use:** If spam is a major issue; otherwise, avoid — it concentrates power further

### Option 3: Raise `voting_period` (More Time to Vote)

**Change:** `voting_period` from 17,280 (24 hours) to 51,840 (3 days)

**Effect:** Gives small holders more time to coordinate a counter-vote

**Example:** If 100 small holders pool their voting power (9M tokens), they match the whale's 10M. More time helps them organize.

**Cost:** Governance is slower; market conditions may change during voting

**When to use:** When distribution is concentrated but you want to enable grassroots coordination

### Option 4: Graduated Parameters (By Distribution Concentration)

**Best practice:** Monitor distribution over time and adjust:

1. **Phase 1 (Launch):** High `quorum_bps` (10-15%), high `proposal_threshold` (0.1-1%) — conservative, forces broad coalition
2. **Phase 2 (Mature, broad distribution):** Medium `quorum_bps` (5%), medium `proposal_threshold` (0.05%) — functional
3. **Phase 3 (Still concentrated):** High `quorum_bps` (7.5-10%), low `proposal_threshold` (0.01%) — lower cost to propose, higher cost to pass

Or, deploy **multiple governance instances** for different authority levels:

- **High-stakes (treasury, parameters):** Higher quorum (10-15%)
- **Standard (feature proposals):** Medium quorum (5%)
- **Low-stakes (community signaling):** Lower quorum (2-3%)

## Token Distribution Strategies to Improve Governance Health

### 1. Vesting Schedules (Reduce Early Concentration)

Instead of issuing all tokens at launch:

```
Whale (founder):  10M total
  - Year 1: 2M unlocked
  - Year 2: 2M unlocked
  - Year 3: 3M unlocked
  - Year 4: 3M unlocked
```

Early on, the whale has less voting power, giving the community time to accumulate tokens. Capture risk decreases over time.

### 2. Delegation (Allow Small Holders to Pool Power)

Even if distribution is unequal, if small holders can delegate their voting power to a trusted representative or DAO, they can collectively counter a whale's vote.

**Example:** 1,000 small holders each have 90k tokens. Individually weak, but collectively 90M tokens — larger than the whale's 10M.

### 3. Quadratic Voting (Reduce Whale Power)

Instead of 1 token = 1 vote, use voting power = sqrt(tokens):

- Whale with 10M tokens: voting power = sqrt(10M) ≈ 3,162
- 1,000 small holders with 90k tokens each: voting power per holder = sqrt(90k) ≈ 300, total ≈ 300k

The whale's relative power drops dramatically, but still has legitimate influence.

### 4. Conviction Voting (Reward Long-Term Holders)

Voting power = tokens × time_held

- Long-term believers have more voice than recent traders
- Discourages pump-and-dump governance attacks
- Requires longer integration horizon

## Worked Examples: Parameter Recommendations

### You Have Broad Distribution (Gini < 0.3, top 10 < 5%)

**Recommended parameters:**
```
quorum_bps = 500               (5% quorum)
proposal_threshold = 500_000   (0.5% — accessible but not spam-prone)
voting_period = 17_280         (24 hours)
timelock_period = 8_640        (12 hours)
```

**Rationale:** A diverse community can reach quorum; parameter thresholds don't need to be high because capture is already difficult.

### You Have Moderate Concentration (Gini ≈ 0.4, top 10 = 10-20%)

**Recommended parameters:**
```
quorum_bps = 750               (7.5% quorum — harder to reach)
proposal_threshold = 500_000   (0.5% — same as broad)
voting_period = 34_560         (48 hours — extra time to organize)
timelock_period = 8_640        (12 hours)
```

**Rationale:** Higher quorum forces broader coalitions; longer voting lets small holders coordinate.

### You Have High Concentration (Gini > 0.5, top 10 > 30%)

**Recommended parameters:**
```
quorum_bps = 1_500             (15% quorum — very hard to reach unilaterally)
proposal_threshold = 100_000   (0.1% — lower to encourage more ideas)
voting_period = 51_840         (72 hours — extensive time for coordination)
timelock_period = 17_280       (24 hours — guardian has more time to review)
```

**Rationale:** Force even the largest holder to build a real coalition; enable small holders to organize; guardian veto is more critical.

Alternatively: **Migrate to gradual vest or delegation** to reduce concentration organically.

## Appendix: Key Formulas

### Effective Quorum Power (with concentration)

If a single holder controls fraction `f` of tokens and `quorum_bps` is the quorum threshold:

- If `f ≥ quorum_bps / 10_000`: That holder alone can reach quorum (dangerous)
- If `f < quorum_bps / 10_000`: Holder needs allies; governance is more distributed

**Example:** Scenario 2 with whale (f=0.1) and quorum_bps=500:
- 0.1 ≥ 0.05? Yes → whale alone reaches quorum ⚠️

### Gini Coefficient (Inequality Measure)

```
Gini = sum of (rank × token_amount) / (sum of token_amounts × (n-1)/2)
```

- Gini ≈ 0: Perfect equality
- Gini ≈ 1: Complete concentration (one holder has all)
- Gini < 0.3: Good for governance
- Gini > 0.5: Risky without mitigations

### Coalition Size to Pass Proposal

In a concentrated distribution, the minimum coalition to pass a proposal is often smaller than true consensus:

```
Min coalition = quorum_bps / 10_000 (to reach quorum)
                + (quorum_bps / (2 × 10_000)) (to win majority)
```

Example: 5% quorum requires 5% quorum + 2.5% to win majority = 7.5% coalition (excluding abstains).

---

## See Also

- [Governance Parameters](./governance-parameters.md) — Individual parameter explanations
- [Migration Guide](./migration-guide.md) — Transitioning from Compound-style Governor
- [Proposal Examples](./proposal-examples.md) — Templates for community proposals

