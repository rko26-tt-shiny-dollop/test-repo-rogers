---
name: code-review
description: Review pull requests and local changes in the OctoCAT Supply Chain application. Use this skill when asked to review a diff, a branch, or a pull request, or to check a change against its requirements before merging. Covers correctness against acceptance criteria, type safety, error handling, accessibility, tests, and unintended changes across the React frontend and Express API.
---

# Code Review

Review changes the way a careful teammate would: check that the change does what
was asked, nothing more, and that it is safe to merge.

## Workflow

1. **Establish intent.** Read the pull request description, any linked issue, and
   any stated acceptance criteria. If none exist, say so and infer intent from the
   diff.
2. **Read the full diff.** Note every file touched. Flag files that seem unrelated
   to the stated intent.
3. **Check against the criteria below.** Only report concrete findings with a file
   and line reference.
4. **Report findings by severity**, then a short overall summary.

## Review criteria

### Correctness

- Each acceptance criterion is met; list any that are not.
- Edge cases: empty states, zero or negative quantities, repeated actions (for
  example, adding the same product twice), and rapid clicks.
- Calculations (counts, totals, discounts) are correct and use one shared source of
  truth rather than duplicated logic.

### Frontend (`frontend/src/`)

- Follows `.github/instructions/frontend.instructions.md`.
- Shared state lives in a context/provider under `frontend/src/context/`, not in
  prop chains or module-level variables.
- No `any`; props and state are typed.
- Interactive elements are keyboard accessible and have accessible names; counts
  and status changes are readable by screen readers.
- Tailwind utilities for styling; no new custom CSS duplicating utilities.

### API (`api/src/`)

- Follows `.github/instructions/api.instructions.md`.
- Uses the existing repository pattern and custom error types; returns consistent
  HTTP status codes.

### Tests

- New behavior has focused tests, ideally one per acceptance criterion.
- Frontend tests use Vitest and React Testing Library (`frontend/src/**/*.test.tsx`)
  and query by role or label rather than CSS classes.
- Tests would fail if the behavior broke; flag tests that only restate the
  implementation.

### Scope and safety

- No unrelated refactors, dependency changes, or configuration changes.
- No secrets, credentials, or hard-coded environment-specific URLs.

## Output format

For each finding:

```text
[High|Medium|Low] path/to/file.tsx:LINE - what is wrong, why it matters, suggested fix
```

- **High:** breaks an acceptance criterion, loses data, or is a security issue.
- **Medium:** likely bug, missing test for new behavior, or accessibility gap.
- **Low:** maintainability or consistency.

End with a one-paragraph summary: whether the change meets its intent, and what a
human reviewer should look at most closely. Do not approve or merge; a person makes
the final decision.
