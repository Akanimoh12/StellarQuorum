# Migration Guide: Moving from Compound-style Governor to Quorum

This guide helps existing DAOs and protocols running an EVM-based Governor contract (Compound-style) migrate governance operations to Quorum on Soroban.

## Overview: Why Migrate?

**Compound-style Governors** are battle-tested but are confined to EVM chains:
- Monolithic, complex contract architecture
- High gas costs for voting and execution
- Slow upgrade cycles due to multi-sig governance
- Limited cross-chain capabilities

**Quorum** on Soroban offers:
- Lower operational costs (Stellar's 5-second close time, minimal fees)
- Faster governance cycles (no gas war dynamics)
- Native Stellar ecosystem integration
- Modern TypeScript SDK for frontend integration

## Migration Scenarios

### Scenario A: Parallel Governance (Lowest Risk)

Run **both Governor and Quorum simultaneously** for 6-12 months. This allows:
- Gradual token migration without halting EVM governance
- Testing Quorum on mainnet while EVM remains operational
- Smooth transition for community unfamiliar with Soroban
- Rollback option if Quorum has unforeseen issues

**Timeline:** 6-12 months (parallel phase) + 3-6 months (wind-down)

**Complexity:** Medium — requires dual governance for a period

### Scenario B: Cutover Migration (Faster)

Coordinate a **single cutover event** where:
- Token holders vote on cutover in EVM Governor
- Bridge-migrate governance tokens from EVM → Soroban
- All future votes happen only on Quorum
- EVM Governor is deprecated

**Timeline:** 2-4 weeks (preparation) + cutover day

**Complexity:** High — requires precise execution and coordination

We'll focus on **Scenario A (Parallel)** as it's lower-risk and more realistic for large DAOs.

---

## Phase 1: Preparation (Weeks 1-4)

### 1.1 Audit and Documentation

1. **Document current Governor configuration:**
   ```javascript
   // From EVM Governor
   const votingDelay = await governor.votingDelay();     // blocks
   const votingPeriod = await governor.votingPeriod();   // blocks
   const quorumNumerator = await governor.quorumNumerator(); // basis points
   const proposalThreshold = await governor.proposalThreshold(); // tokens
   ```

2. **Map EVM parameters to Quorum equivalents:**
   | EVM Governor | Quorum | Notes |
   |---|---|---|
   | votingPeriod (blocks) | voting_period (ledgers) | EVM: 1 block ≈ 13s; Soroban: 1 ledger ≈ 5s |
   | quorumNumerator | quorum_bps | Both are basis points; same semantics |
   | proposalThreshold | proposal_threshold | Both in raw token units |
   | votingDelay | (not in Quorum) | Quorum starts voting immediately at proposal creation |
   | timelockDelay | timelock_period | Guardian veto window on Soroban |

3. **Identify active proposals:**
   - List all in-flight EVM proposals and their stage (voting, queued, executed)
   - These must complete on EVM before migration or be re-proposed on Quorum

4. **Community audit:**
   - Ensure community is aware of the planned migration
   - Gather feedback on Quorum's governance model
   - Set clear expectations for timeline and risks

### 1.2 Governance Token Preparation

Decide how governance tokens move from EVM → Soroban:

#### Option A: New Quorum-specific Token (Simplest)
- Snapshot EVM token holders at block N
- Issue new tokens on Soroban with identical supply
- Maintain EVM tokens for historical reference; they no longer have voting power

**Pros:** Clean separation; no bridge complexity

**Cons:** Two token addresses; airdrop logistics

**Steps:**
```bash
# Snapshot EVM Governor token holders at block N
node scripts/snapshot-evm-holders.js > evm_holders.json

# Deploy Quorum token on Soroban with same supply
soroban contract deploy --wasm quorum_token.wasm
soroban contract invoke --id CXXXXX --method initialize \
  --arg-named admin <YOUR_MULTISIG> \
  --arg-named initial_supply 100000000000000

# Airdrop proportionally to EVM holders
node scripts/airdrop-to-quorum-holders.js evm_holders.json CXXXXX
```

#### Option B: Wrapped Bridge Token (More Complex)
- Keep EVM tokens in a bridge contract
- Mint wrapped tokens on Soroban (1:1 backed)
- Users bridge tokens as needed

**Pros:** Unified token; holders can bridge back if needed

**Cons:** Trust in bridge; operational complexity

**Note:** Cross-chain bridging itself is out of scope for this guide; use an audited bridge solution like Stargate, LayerZero, or Wormhole.

### 1.3 Deploy Quorum Contracts

Follow [Protocol Integration Guide](./protocol-integration-guide.md) to deploy:

1. **Governance token** (if new token)
2. **Quorum Governor contract**
3. **Initialize governance parameters** (mapped from Step 1.1)

```typescript
// Map EVM voting period (blocks) → Quorum (ledgers)
// EVM: 1 block ≈ 13 seconds; Soroban: 1 ledger ≈ 5 seconds
// EVM 45,818 blocks (1 week) ≈ Soroban 119,480 ledgers (1 week)

const votingPeriodLedgers = (evm_votingPeriod * 13) / 5;

// Quorum init
const client = new QuorumClient({
  rpcUrl: SOROBAN_RPC,
  governanceContractId: QUORUM_CONTRACT,
  tokenContractId: GOVERNANCE_TOKEN,
});

// Initialize with mapped parameters
// (Exact initialization depends on contract API)
```

---

## Phase 2: Parallel Governance (Weeks 5-52)

Both EVM Governor and Quorum accept proposals simultaneously.

### 2.1 Community Transition

**Weeks 5-12: "Quorum Onboarding" Phase**

- Deploy Quorum to **testnet first** (4 weeks before mainnet)
- Run a testnet election with sample proposals
- Community tests voting, delegation, and proposal creation
- Gather feedback; fix any issues

**Weeks 13-52: "Dual Governance" Phase**

- All new proposals go to **Quorum** (on mainnet)
- EVM Governor continues to accept and execute in-flight proposals
- New token holders vote on Quorum; legacy holders on EVM
- Coordinate off-chain: when a major decision is needed, holders vote on both

**Synchronization strategy for cross-chain votes:**

Option 1: **Identical proposals**
- Same proposal on EVM and Quorum
- Both must reach quorum and pass for execution
- Execution happens on whichever chain the action affects

Option 2: **Reference proposals**
- Quorum is the source of truth
- EVM mirrors accept/veto only (no original voting)
- Quorum passes → EVM mirrors confirm with light vote
- Then execution proceeds on the respective chain

### 2.2 Handling In-Flight Proposals

EVM proposals that are still voting or queued:

1. **Voting-phase proposals:** Let them complete naturally on EVM
2. **Queued proposals:** Execute them on EVM if the action is still valid
3. **Expired proposals:** Can ignore; they've lost community support

Re-propose any **strategic proposals** on Quorum alongside EVM (for parallelism).

### 2.3 Tracking Participation

Monitor:
- **Voter turnout on Quorum** vs. EVM historical averages
- **Governance token velocity** (how many holders are active voters)
- **Proposal passage rate** (pass/fail ratio)
- **Community sentiment** (forum discussions, Discord)

If Quorum turnout is <50% of EVM historical levels, extend the parallel phase and investigate why.

---

## Phase 3: Historical Record Continuity (Weeks 1-4 of Phase 2)

**Why this matters:** Governance history is social proof. Losing past proposals and votes degrades trust.

### 3.1 Archive EVM Governance Data

Export all historical Governor data:

```javascript
// Fetch and archive all past proposals
const filter = governor.filters.ProposalCreated();
const events = await governor.queryFilter(filter, BLOCK_START, 'latest');

const proposals = events.map(e => ({
  id: e.args.proposalId.toString(),
  proposer: e.args.proposer,
  startBlock: e.args.startBlock.toNumber(),
  endBlock: e.args.endBlock.toNumber(),
  description: e.args.description,
  forVotes: event.args.forVotes,
  againstVotes: event.args.againstVotes,
  abstainVotes: event.args.abstainVotes,
  status: getProposalStatus(e.args.proposalId),
  timestamp: (await ethers.provider.getBlock(e.blockNumber)).timestamp,
}));

// Store in JSON file and on IPFS for long-term archival
const ipfsHash = await ipfs.add(JSON.stringify(proposals));
console.log('EVM proposals archived at:', `https://ipfs.io/ipfs/${ipfsHash}`);
```

### 3.2 Mirror Proposals on Quorum (Optional)

For transparency, you can re-post closed EVM proposals as **readonly records** on Quorum:

```typescript
// Create a "Historical Proposals" section in Quorum frontend
// that links to archived EVM proposals and their outcomes

const archiveProposal = {
  title: "[ARCHIVE] EVM Governor: Increase Fee Tier Limit",
  description: JSON.stringify({
    archived_from: "EVM Governor",
    evm_proposal_id: 42,
    evm_result: "EXECUTED",
    evm_votes: { for: "5.2M", against: "1.1M", abstain: "0.3M" },
    ipfs_link: "https://ipfs.io/...",
    note: "Executed on EVM; shown here for historical completeness."
  }),
};

// Submit as non-votable "record" on Quorum
```

This helps the community see the full governance lineage.

---

## Phase 4: Cutover Decision (Weeks 40-52)

After 12 months of parallel operation, the community votes on whether to:

1. **Finalize cutover** to Quorum-only governance
2. **Extend parallel operation** for another 6 months
3. **Revert to EVM-only** and abandon Quorum (unlikely, but possible if issues arise)

**Cutover vote structure:**

```
EVM Proposal: "Sunset EVM Governor, Migrate to Quorum"
Quorum Proposal (mirror): Same resolution

Both must pass. If both pass:
  - Schedule cutover date (e.g., 30 days out)
  - Final on-chain vote on both chains to lock the date
  - On cutover date:
    - EVM Governor is paused (no new proposals accepted)
    - Quorum becomes the only governance venue
    - Any remaining EVM actions execute via a timelock
```

---

## Phase 5: Execution and Sunset (Weeks 52-72)

### 5.1 Final EVM Execution

1. Execute any remaining queued proposals on EVM
2. Transfer treasury, if any, to Soroban equivalent
3. Publish final governance record (block number, timestamp)

### 5.2 Sunset EVM Governor

1. Disable proposal creation and voting on EVM (or leave read-only)
2. Archive all contract bytecode and ABIs on IPFS
3. Link from EVM contract (via event) to Soroban Quorum contract

### 5.3 Announcement

- Blog post: "Governance Migration Complete"
- Link to full historical record (EVM + Quorum proposals)
- Summary of new governance model
- Invite community to participate in first major Quorum-only vote

---

## Bridging Considerations (Out of Scope)

This guide **does not cover** cross-chain token bridging itself. For actual token migration, use an audited bridge:

- **Stargate:** Fast cross-chain transactions; good for ERC-20 ↔ Soroban assets
- **Wormhole:** Wide ecosystem support; secure
- **Axelar:** General cross-chain messaging; flexible

**Timeline:** Plan 4-6 weeks for bridge integration and audits.

---

## Contingency: Rollback Plan

If Quorum encounters a critical bug during parallel operation:

1. **Pause Quorum governance** (community votes to disable proposal creation)
2. **Revert to EVM-only** temporarily
3. **Fix Quorum contracts** and redeploy
4. **Restart parallel phase** with longer stabilization period

This is why **parallel operation** is safer than direct cutover.

---

## Checklist for Successful Migration

- [ ] EVM governance parameters mapped to Quorum
- [ ] All in-flight EVM proposals completed or re-proposed on Quorum
- [ ] Governance token snapshot taken
- [ ] Quorum contracts deployed to testnet and tested
- [ ] Quorum contracts deployed to mainnet
- [ ] Token distribution to Quorum holders (airdrop or bridge)
- [ ] Community training on Quorum voting interface
- [ ] Parallel governance operational for 12+ months
- [ ] Historical proposal archive on IPFS
- [ ] Cutover vote passed on both EVM and Quorum
- [ ] Final EVM proposals executed
- [ ] Quorum announced as official governance venue
- [ ] Governance history published and linked

---

## Timeline Summary

| Phase | Duration | Key Milestone |
|-------|----------|---------------|
| **1: Prep** | 4 weeks | Quorum deployed to testnet |
| **2: Parallel** | 48 weeks | Both chains accept proposals |
| **3: Cutover Vote** | 4 weeks | Community votes on sunset |
| **4: Execution** | 4 weeks | EVM paused, Quorum finalized |
| **Total** | ~60 weeks | Full transition (≈14 months) |

## Troubleshooting

### "EVM token holders don't trust Soroban"
- Run longer parallel phase (18 months instead of 12)
- Highlight Soroban's audits and Stellar foundation support
- Offer testnet voting to reduce risk perception

### "Low turnout on Quorum vs. EVM"
- Check if governance interface is intuitive; improve UX if not
- Lower proposal threshold temporarily to encourage activity
- Host community calls about key Quorum proposals
- Consider delegation feature to reduce voting friction

### "Bridged tokens have liquidity issues"
- Prioritize broad distribution before cutover
- Ensure bridge supports high-volume token transfers
- Consider gradual migration (10%, 25%, 50%, 100% over months)

---

## See Also

- [Protocol Integration Guide](./protocol-integration-guide.md) — How to integrate Quorum with your protocol
- [Economic Model](./economic-model.md) — Governance parameter trade-offs
- [Governance Parameters](./governance-parameters.md) — Individual parameter explanations
- Soroban Docs: https://soroban.stellar.org/docs

