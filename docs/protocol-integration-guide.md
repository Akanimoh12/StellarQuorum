# Protocol Integration Guide: Adding Quorum to Your Soroban Treasury

This guide walks you through integrating Quorum governance into an existing Soroban DeFi protocol, enabling token-weighted community control over treasury management and protocol parameters.

## Prerequisites

- A deployed Soroban protocol with an admin contract or treasury contract
- Understanding of Soroban contract development and Stellar CLI
- A governance token (or plan to issue one via a separate contract)
- Admin multisig or privileged account to initialize the governance contracts

## Overview: The Integration Pattern

The integration pattern is straightforward:

1. **Deploy governance contracts** — The Quorum Governor contract and a governance token contract (if needed)
2. **Expose admin functions through `execute()`** — Create a dispatcher function in your protocol that accepts Quorum-validated proposals and executes the embedded transactions
3. **Transfer admin control** — Change the admin of your protocol's treasury to point to the Quorum governance contract's `execute()` dispatcher
4. **Initialize parameters** — Set quorum, voting period, timelock, and proposal thresholds in the governance config

## Step 1: Deploy Quorum Governance Contracts

### 1.1 Deploy the Governance Token (if needed)

If you don't have a governance token, deploy one first. You can use the Stellar Asset Contract (SAC) or a custom contract:

```bash
# Example: Using Stellar CLI to deploy a native asset contract wrapper
soroban contract deploy --wasm PATH_TO_SAC.wasm \
  --address-book-name mytoken \
  --network testnet
```

Or if you prefer a custom token, ensure it has:
- A `name()` function returning the token name
- A `symbol()` returning a short code
- A `decimals()` returning the number of decimals (typically 7 for Stellar)
- A `mint(to, amount)` function for initial issuance
- Standard `transfer()` and `balance()` functions

Record the token contract ID for the next step.

### 1.2 Deploy the Quorum Governor Contract

Clone or download the Quorum source:

```bash
git clone https://github.com/StellarQuorum/StellarQuorum.git
cd StellarQuorum/contracts
```

Build and deploy:

```bash
cargo build --release --target wasm32-unknown-unknown
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/quorum_governance.wasm \
  --network testnet \
  --address-book-name quorum_governor
```

Record the governance contract ID.

### 1.3 Initialize Governance Configuration

Use the Quorum SDK to initialize the governance parameters:

```typescript
import { QuorumClient } from '@quorum/sdk';

const governanceContractId = 'C...'; // from Step 1.2
const tokenContractId = 'C...';      // from Step 1.1
const adminAddress = 'G...';         // your multisig or admin account

const client = new QuorumClient({
  networkPassphrase: 'Test SDF Network ; September 2015', // or 'Public Global Stellar Network ; September 2015'
  rpcUrl: 'https://soroban-testnet.stellar.org',         // or your RPC endpoint
  governanceContractId,
  tokenContractId,
});

// Call the initialize() function on the governance contract
// (Exact initialization mechanism varies; see the contract's test files for patterns)
```

Typical initialization parameters:

| Parameter | Recommended | Notes |
|-----------|-------------|-------|
| `quorum_bps` | 500 | 5% of total token supply |
| `voting_period` | 17,280 ledgers | ~24 hours at 5s/ledger |
| `timelock_period` | 8,640 ledgers | ~12 hours for guardian review |
| `proposal_threshold` | 0.05% of supply | Prevents spam |
| `admin` | Multisig address | Initially only multisig can propose system changes |
| `token` | Token contract ID | From Step 1.1 |

## Step 2: Create a Protocol Dispatcher Function

Your protocol's admin contract (or treasury contract) needs an `execute(proposal_id)` function that:

1. Verifies the caller is the Quorum governance contract
2. Retrieves the queued proposal from Quorum
3. Executes the embedded transaction(s) inside the proposal
4. Logs success or error

### Example Dispatcher (Soroban Rust)

```rust
// In your protocol's admin contract

#[contract]
pub struct Admin {
    // ... your fields
    governance: Address, // Quorum governance contract
}

impl Admin {
    /// Called by the Quorum governance contract after timelock expiry
    pub fn execute(env: &Env, proposal_id: u64) -> Result<(), Error> {
        // Verify the caller is the governance contract
        let caller = env.current_contract_address();
        if caller != self.governance {
            return Err(Error::UnauthorizedCaller);
        }

        // Fetch the queued proposal from Quorum
        // (Quorum SDK or direct contract invocation)
        // let proposal = gov_client.get_proposal(proposal_id)?;

        // Parse the embedded actions from the proposal description
        // (This depends on how you encode the actions in the proposal)
        // let actions = decode_actions(&proposal.description)?;

        // Execute the actions
        for action in actions {
            match action {
                Action::UpdateParameter { key, value } => {
                    self.update_param(&env, key, value)?;
                }
                Action::TransferFunds { recipient, amount } => {
                    self.transfer(&env, recipient, amount)?;
                }
                // ... more actions
            }
        }

        env.events().publish(
            ("governance", "proposal_executed"),
            proposal_id,
        );
        Ok(())
    }

    // Internal methods to update parameters, transfer funds, etc.
    fn update_param(&mut self, env: &Env, key: String, value: i128) -> Result<(), Error> {
        // ... implementation
        Ok(())
    }

    fn transfer(&mut self, env: &Env, recipient: Address, amount: i128) -> Result<(), Error> {
        // ... implementation
        Ok(())
    }
}
```

### Encoding Actions in Proposals

When community members create proposals, they include the desired actions in the proposal description (or in a separate contract call). The `execute()` dispatcher must decode and validate these.

**Best practice:** Use a structured format like JSON:

```json
{
  "actions": [
    {
      "type": "update_parameter",
      "key": "fee_percentage",
      "value": 2500
    },
    {
      "type": "transfer_funds",
      "recipient": "GABC...",
      "amount": "1000000000"
    }
  ]
}
```

Then in your dispatcher:

```rust
let actions: Actions = serde_json::from_str(&proposal.description)?;
for action in actions.actions {
    // execute each action
}
```

## Step 3: Transfer Admin Control

### 3.1 Update the Admin Address

Once your dispatcher is deployed and tested, update your protocol's admin field to point to the Quorum governance contract:

```typescript
// Using the protocol's admin contract
const protocolClient = new ProtocolClient({
  ...config,
  adminContractId: 'C...' // your admin contract
});

await protocolClient.setAdmin(governanceContractId);
```

### 3.2 Test with a Proposal

Before irrevocable transfer, test the full flow:

1. Create a test proposal (small parameter change or test transfer)
2. Have token holders vote and reach quorum
3. Wait for the voting period to close
4. Wait for the timelock to expire
5. Call `execute()` on the governance contract with the proposal ID
6. Verify the action executed in your protocol

If all checks pass, proceed to Step 3.3.

### 3.3 Irreversible Transfer (Multisig)

Once confident, execute a multisig transaction to permanently transfer admin control:

```bash
# Multisig transaction: call your protocol's setAdmin(governanceContractId)
# All multisig signers must approve
```

After this transaction:
- **No single account can change protocol parameters** — all changes go through Quorum governance
- **Token holders vote on all future changes** — decisions are transparent and decentralized
- **Timelock provides a safety window** — the guardian multisig can veto dangerous proposals before execution

## Step 4: Launch Token Distribution (if new token)

If you created a governance token for Quorum, distribute it to community members:

```typescript
const tokenClient = new TokenClient({
  ...config,
  tokenContractId,
});

// Mint and distribute
const recipients = ['GABC...', 'GDEF...', ...];
const amount = BigInt(1_000_000) * BigInt(10 ** 7); // 1M tokens, 7 decimals

for (const recipient of recipients) {
  await tokenClient.mint(recipient, amount);
}
```

See the [token distribution document](../docs/governance-parameters.md) for guidance on fair initial allocation.

## Step 5: Governance Workflows

### Creating a Proposal

Token holders with sufficient balance can now create proposals:

```typescript
const client = new QuorumClient({...});

// User must hold at least proposal_threshold tokens
const proposal = await client.propose({
  title: "Increase fee from 0.25% to 0.5%",
  description: JSON.stringify({
    actions: [{
      type: "update_parameter",
      key: "fee_bps",
      value: 50
    }]
  }),
});
```

### Voting

Holders vote during the voting period:

```typescript
// Vote with balance snapshot at proposal creation time
await client.vote(proposalId, 'For'); // or 'Against', 'Abstain'
```

### Execution

After voting closes and timelock expires:

```typescript
// Guardian or any account can call execute()
await client.execute(proposalId);

// The dispatcher in your protocol runs the embedded actions
```

## Migration Path: From Multisig to Governance

If your protocol currently uses a multisig for admin control, the handoff looks like:

1. **Phase 1 (Parallel operation):** Multisig and Quorum both have the ability to call admin functions (via a dispatcher that accepts both)
2. **Phase 2 (Gradient transfer):** Non-critical parameters are first moved under Quorum control; multisig remains on critical functions
3. **Phase 3 (Full transition):** All admin functions are moved under Quorum, multisig retains only the timelock veto right
4. **Phase 4 (Sunset multisig):** If desired, vote to remove the veto power and make governance fully community-driven

## Troubleshooting

### "Governance contract not found"
- Ensure the governance contract ID is correct and deployed to the same network
- Verify you're using the correct RPC endpoint

### "Caller is not authorized"
- In the `execute()` dispatcher, verify the caller check: `env.current_contract_address() == self.governance`
- Ensure the governance contract ID matches your actual deployment

### "Proposal not queued"
- The proposal must have passed voting and be past the timelock period
- Use the Quorum SDK to check the proposal status

### "Token balance mismatch"
- Voting power is calculated at the **snapshot ledger** (proposal creation time), not current balance
- Ensure governance token was issued and transferred to voters *before* the proposal was created

## Next Steps

- Read [Governance Parameters](./governance-parameters.md) to fine-tune quorum settings
- Check [Economic Model](./economic-model.md) for distribution and capture-resistance analysis
- See [Proposal Examples](./proposal-examples.md) for templates your community can use
- Join [Community Calls](./community-calls.md) to discuss governance evolution

---

**Status:** This guide covers the Quorum SDK and testnet. Production deployments should undergo a security audit and follow the Stellar security guidelines.
