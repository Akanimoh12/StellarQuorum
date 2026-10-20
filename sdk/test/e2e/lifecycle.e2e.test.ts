// End-to-end governance lifecycle against a local Soroban standalone network
// (issue #311): create -> vote (three voters) -> finalize -> timelock -> execute.
//
// Every governance and token step goes through the SDK's build* methods and
// real transaction submission. Contract deployment and initialisation use the
// `stellar` CLI, the same way scripts/deploy.sh does.
//
// The suite is skipped unless the environment points it at a network, so the
// default `npm test` run stays offline. Run it with `npm run test:e2e`.
//
// Environment:
//   QUORUM_E2E_RPC_URL            Soroban RPC of the standalone network, e.g.
//                                 http://localhost:8000/soroban/rpc
//   QUORUM_E2E_FRIENDBOT_URL      Friendbot that funds test accounts, e.g.
//                                 http://localhost:8000/friendbot
//   QUORUM_E2E_NETWORK_PASSPHRASE Optional; defaults to the standalone passphrase.
//   QUORUM_E2E_WASM_DIR           Optional; defaults to the release WASM output
//                                 of `cargo build --target wasm32-unknown-unknown`.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { Keypair, Transaction, TransactionBuilder, rpc } from '@stellar/stellar-sdk';
import { QuorumClient } from '../../src/client';
import type { Proposal, VoteSupport } from '../../src/types';

const RPC_URL = process.env.QUORUM_E2E_RPC_URL ?? '';
const FRIENDBOT_URL = process.env.QUORUM_E2E_FRIENDBOT_URL ?? '';
const PASSPHRASE = process.env.QUORUM_E2E_NETWORK_PASSPHRASE ?? 'Standalone Network ; February 2017';
const WASM_DIR =
  process.env.QUORUM_E2E_WASM_DIR ??
  path.resolve(process.cwd(), '../contracts/target/wasm32-unknown-unknown/release');

const describeE2E = RPC_URL && FRIENDBOT_URL ? describe : describe.skip;

// Ledgers close roughly every 5 seconds on the quickstart network, so the
// voting window is sized to leave room for three votes to confirm.
const QUORUM_BPS = 500; // 5% of total supply
const VOTING_PERIOD = 20;
const TIMELOCK_PERIOD = 2;
const EXECUTION_GRACE_PERIOD = 1_000;
const PROPOSAL_THRESHOLD = 100_000n;
const INITIAL_SUPPLY = 1_000_000n;

const FOR: VoteSupport = 1;
const AGAINST: VoteSupport = 0;
const ABSTAIN: VoteSupport = 2;

const LIFECYCLE_TIMEOUT_MS = 15 * 60_000;
const SETUP_TIMEOUT_MS = 5 * 60_000;

function rpcFlags(): string[] {
  return ['--rpc-url', RPC_URL, '--network-passphrase', PASSPHRASE];
}

function deploy(wasmFile: string, source: Keypair): string {
  return execFileSync(
    'stellar',
    ['contract', 'deploy', '--wasm', path.join(WASM_DIR, wasmFile), '--source-account', source.secret(), ...rpcFlags()],
    { encoding: 'utf8' },
  ).trim();
}

function invoke(contractId: string, source: Keypair, fnArgs: string[]): void {
  execFileSync(
    'stellar',
    ['contract', 'invoke', '--id', contractId, '--source-account', source.secret(), ...rpcFlags(), '--', ...fnArgs],
    { encoding: 'utf8' },
  );
}

async function fund(account: Keypair): Promise<void> {
  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(account.publicKey())}`);
  if (!response.ok) {
    throw new Error(`friendbot funding failed for ${account.publicKey()}: ${response.status} ${await response.text()}`);
  }
}

/** Signs an unsigned XDR from a build* method and submits it until confirmed. */
async function submit(client: QuorumClient, unsignedXdr: string, signer: Keypair): Promise<void> {
  const transaction = TransactionBuilder.fromXDR(unsignedXdr, PASSPHRASE) as Transaction;
  transaction.sign(signer);
  await client.submitAndWait(transaction.toXDR());
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describeE2E('governance lifecycle on a local Soroban network', () => {
  let client: QuorumClient;
  let rpcServer: rpc.Server;
  let admin: Keypair;
  let voterFor: Keypair;
  let voterAgainst: Keypair;
  let voterAbstain: Keypair;

  async function latestLedger(): Promise<number> {
    return (await rpcServer.getLatestLedger()).sequence;
  }

  /** Polls until the network has closed ledger `target` or later. */
  async function waitUntilLedger(target: number): Promise<void> {
    while ((await latestLedger()) < target) {
      await sleep(1_000);
    }
  }

  async function proposalOrFail(id: bigint): Promise<Proposal> {
    const proposal = await client.getProposal(id);
    if (!proposal) throw new Error(`proposal ${id} not found`);
    return proposal;
  }

  beforeAll(async () => {
    rpcServer = new rpc.Server(RPC_URL, { allowHttp: true });
    admin = Keypair.random();
    voterFor = Keypair.random();
    voterAgainst = Keypair.random();
    voterAbstain = Keypair.random();
    await Promise.all([admin, voterFor, voterAgainst, voterAbstain].map(fund));

    const tokenId = deploy('quorum_token.wasm', admin);
    invoke(tokenId, admin, [
      'initialize',
      '--admin', admin.publicKey(),
      '--name', 'Quorum',
      '--symbol', 'QUORUM',
      '--decimals', '7',
      '--initial_supply', INITIAL_SUPPLY.toString(),
    ]);

    const governanceId = deploy('quorum_governance.wasm', admin);
    invoke(governanceId, admin, [
      'initialize',
      '--admin', admin.publicKey(),
      '--guardian', admin.publicKey(),
      '--token', tokenId,
      '--quorum_bps', String(QUORUM_BPS),
      '--voting_period', String(VOTING_PERIOD),
      '--timelock_period', String(TIMELOCK_PERIOD),
      '--execution_grace_period', String(EXECUTION_GRACE_PERIOD),
      '--proposal_threshold', PROPOSAL_THRESHOLD.toString(),
    ]);

    client = new QuorumClient({
      rpcUrl: RPC_URL,
      networkPassphrase: PASSPHRASE,
      governanceContractId: governanceId,
      tokenContractId: tokenId,
      confirmationTimeoutMs: 120_000,
    });
  }, SETUP_TIMEOUT_MS);

  test('create, vote with three voters, finalize, wait out the timelock, execute', async () => {
    // Distribute voting power from the admin's genesis allocation. Votes are
    // weighted by balance at the proposal's snapshot ledger, so these transfers
    // must confirm before the proposal is created.
    await submit(client, await client.buildTransfer(admin.publicKey(), voterFor.publicKey(), 200_000n), admin);
    await submit(client, await client.buildTransfer(admin.publicKey(), voterAgainst.publicKey(), 150_000n), admin);
    await submit(client, await client.buildTransfer(admin.publicKey(), voterAbstain.publicKey(), 50_000n), admin);

    await submit(
      client,
      await client.buildCreateProposal(admin.publicKey(), 'E2E lifecycle', 'Create through execute on a local network'),
      admin,
    );
    const proposalId = await client.getProposalCount();
    expect(await proposalOrFail(proposalId)).toMatchObject({ status: 'Active' });

    const ballots: Array<[Keypair, VoteSupport]> = [
      [voterFor, FOR],
      [voterAgainst, AGAINST],
      [voterAbstain, ABSTAIN],
    ];
    for (const [voter, support] of ballots) {
      await submit(client, await client.buildVote(voter.publicKey(), proposalId, support), voter);
      expect(await client.getVote(proposalId, voter.publicKey())).toBe(support);
    }

    const voted = await proposalOrFail(proposalId);
    expect(voted.forVotes).toBe(200_000n);
    expect(voted.againstVotes).toBe(150_000n);
    expect(voted.abstainVotes).toBe(50_000n);

    // Voting closes after end_ledger; finalize is only accepted once it has.
    await waitUntilLedger(voted.endLedger + 1);
    await submit(client, await client.buildFinalize(admin.publicKey(), proposalId), admin);
    const queued = await proposalOrFail(proposalId);
    expect(queued.status).toBe('Queued');

    // The timelock runs from the ledger finalize closed, so execute must wait
    // until the network reaches queue_ledger.
    await waitUntilLedger(queued.queueLedger);
    await submit(client, await client.buildExecute(admin.publicKey(), proposalId), admin);
    expect(await proposalOrFail(proposalId)).toMatchObject({ status: 'Executed' });
  }, LIFECYCLE_TIMEOUT_MS);
});
