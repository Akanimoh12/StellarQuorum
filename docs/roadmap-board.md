# Roadmap Board

This document describes the project roadmap board and how it syncs with the README roadmap section.

## Roadmap Board

The project uses a **GitHub Projects board** to track roadmap items with their implementation status:

- [StellarQuorum Roadmap Board](https://github.com/StellarQuorum/StellarQuorum/projects) — Public board with columns for each roadmap phase

## Board Structure

The board is organized by roadmap phase:

| Column | Description |
|--------|-------------|
| **Backlog** | Items not yet started |
| **In Progress** | Items currently being worked on |
| **Review** | Items under code review |
| **Done** | Completed items |

## Roadmap Items and Tracking Issues

Each item in the [README Roadmap](../README.md#roadmap) section links to its tracking issue(s) and/or the board:

- [x] Freighter wallet connection — connect, connected address, and the snapshot voting-power preview (✅ completed)
- [ ] Sign and submit votes on Stellar testnet through Freighter — tracking: [Issue #123](https://github.com/StellarQuorum/StellarQuorum/issues/123)
- [ ] Soroban governance contract testnet deployment — tracking: [Issue #124](https://github.com/StellarQuorum/StellarQuorum/issues/124)
- [ ] Token delegation UI — delegate voting power without transferring tokens — tracking: [Issue #125](https://github.com/StellarQuorum/StellarQuorum/issues/125)
- [ ] Timelock execution engine — automated execution after 48h delay — tracking: [Issue #126](https://github.com/StellarQuorum/StellarQuorum/issues/126)
- [ ] Multi-sig proposal creation — tracking: [Issue #127](https://github.com/StellarQuorum/StellarQuorum/issues/127)
- [ ] Governor contract security audit — tracking: [Issue #128](https://github.com/StellarQuorum/StellarQuorum/issues/128)
- [ ] QUORUM token distribution and staking — tracking: [Issue #129](https://github.com/StellarQuorum/StellarQuorum/issues/129)
- [ ] Off-chain signaling (Snapshot-style) before on-chain execution — tracking: [Issue #130](https://github.com/StellarQuorum/StellarQuorum/issues/130)
- [ ] Governance analytics dashboard — tracking: [Issue #131](https://github.com/StellarQuorum/StellarQuorum/issues/131)

*Note: Replace the issue numbers above with actual tracking issues once created.*

## Keeping README and Board in Sync

### When Adding a New Roadmap Item

1. Create a tracking issue for the item (if it doesn't exist)
2. Add the item to the GitHub Projects board in the **Backlog** column
3. Add the item to the README Roadmap section with a link to the tracking issue
4. Update this document to include the new item with its tracking link

### When Updating Item Status

1. Move the item to the appropriate column in the GitHub Projects board
2. Update the checkbox in the README Roadmap section (add `[x]` when done)
3. Ensure the tracking issue reflects the current status

### When Completing an Item

1. Move the item to the **Done** column in the GitHub Projects board
2. Mark the checkbox as complete in the README: `- [x] Item description`
3. Close the tracking issue with a reference to the completing PR
4. Update this document if needed

## Maintainer Process

Maintainers should:

- Review the board weekly to ensure items are in the correct columns
- Create tracking issues for roadmap items that don't have them
- Link PRs to tracking issues for better traceability
- Update the README when significant milestones are reached

## Visibility and Transparency

The public roadmap board provides:
- Real-time status of roadmap items
- Relative priority (based on column placement)
- Work-in-progress visibility
- Historical context of completed items

Community members can view the board to understand what's being worked on and what's coming next.
