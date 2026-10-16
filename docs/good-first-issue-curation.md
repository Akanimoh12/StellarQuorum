# Good First Issue Curation and Triage Process

This document outlines how maintainers curate and maintain the `good-first-issue` label on Stellar Quorum issues, ensuring a healthy supply of beginner-friendly work is always available.

## What Makes an Issue "Good First"

An issue earns the `good-first-issue` label when it meets **all** of these criteria:

1. **Self-contained**: The issue can be completed without depending on another open issue landing first
2. **Scoped**: The implementation touches one file or one component, not across multiple modules
3. **Clear acceptance criteria**: A newcomer can verify their work is done by checking the stated criteria
4. **Low context overhead**: No deep knowledge of the codebase, governance model, or Soroban/Stellar APIs required to understand what needs changing
5. **Estimated effort**: The issue can realistically be completed in 1–3 hours by someone new to the codebase

### Examples of Issues That Qualify

- Add a new validation rule to the frontend form (one component)
- Write unit tests for an existing function (no new logic needed)
- Update a doc comment or README section (isolated change)
- Fix a spelling error or improve an error message (localized, obvious)
- Add a missing field to the glossary or proposals list (data task, no dependencies)

### Examples of Issues That Do NOT Qualify

- "Implement delegation UI" (touches multiple components, requires understanding of the voting flow)
- "Build the Freighter wallet connection" (depends on contract deployment, external API knowledge)
- "Add proposal search and sorting" (spans data layer + UI, needs state management)
- Anything requiring changes across `contracts/`, `frontend/`, and `sdk/` simultaneously

## Curation Process

### Before Opening an Issue

1. **Check the acceptance criteria** — if they do not clearly specify what "done" looks like, the issue is not ready
2. **Check scope** — if the issue touches more than one module or requires cross-cutting changes, it is not a good first issue
3. **Check for dependencies** — if another open issue must land first, document it and skip the label
4. **Assign an estimate** — if you cannot estimate it as 1–3 hours for a newcomer, it is not small enough

### During Triage (Monthly, as part of regular maintainer reviews)

Every month, or when the labeled set drops below 3 active issues:

1. **Scan open issues** for any that now meet the criteria above
2. **Check claimed good-first-issues** — if an issue has been claimed for more than 2 weeks with no PR, comment to check in; if 4+ weeks have passed with no update, remove the label and re-open it for others
3. **Check closed good-first-issues** — verify the closure was a completed merge (not a duplicate, wontfix, or dupe); if an issue was closed but not merged, archive it and consider relabeling the canonical issue if it remains open
4. **Spot-check recent PRs** — did any just-merged PR touch areas that now have obvious follow-ups that would make good first issues? If so, draft them and add the label

### Labeling Guidance

- Use the label **generously** — when in doubt, add it; a contributor can always comment that they found it harder than expected
- Remove the label **conservatively** — only if it no longer meets the criteria (e.g., another issue it was supposed to pair with is taking longer than expected)
- Do **not** use the label as a way to deprioritize issues; `status/*` or custom labels track priority separately

## Keeping the Supply Healthy

A healthy supply is **3–5 labeled, unclaimed issues at any given time**. This ensures:
- New contributors always have something to pick up without waiting
- Maintainers can still close/merge work at their normal pace without the supply drying up
- We avoid backlogs of stale issues that no one has claimed

If the supply drops below 3:
1. In the next triage pass, be more generous with the label
2. Proactively draft 2–3 small follow-ups from recent merges to add to the set
3. Comment on open issues asking contributors for ideas on what next small wins would help them

## Examples of Issues Added During Triage

After merging a wallet connection feature:
- "Document the wallet connection component in the SDK" (newcomer doc task)
- "Add unit tests for the wallet state hook" (test-only, low context)
- "Add a glossary entry for 'voting power'" (isolated data task)

After closing an old styling issue:
- "Review and update CSS variable naming" (scoped, clear criteria)
- "Add inline CSS comments for non-obvious color choices" (localized, obvious)

## Questions?

If you're unsure whether an issue qualifies, ask a fellow maintainer or open a discussion. It's better to label it and get feedback than to leave good work unlabeled.
