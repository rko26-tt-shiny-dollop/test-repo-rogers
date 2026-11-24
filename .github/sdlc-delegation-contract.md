# SDLC Delegation Contract

Use this contract for every handoff in the workshop agent pipeline. Keep facts,
assumptions, decisions, and requested actions separate. Do not claim an external
side effect unless the responsible agent verified it.

## Handoff Format

```markdown
## Handoff

- From: <agent role>
- To: <agent role>
- Stage: <investigation | triage | implementation | review | repair | delivery>
- Status: <ready | blocked | complete>

### Scope

- Affected area: <frontend | backend | shared>
- Files or endpoints: <paths or endpoints>
- Constraints: <applicable repository instructions and non-goals>

### Evidence

- Reproduction: <command and result, or not run>
- Observed behavior: <facts only>
- Expected behavior: <facts only>
- Artifacts: <paths, logs, test output, or none>

### Decision Input

- Confirmed findings: <facts supported by evidence>
- Finding classification: <product defect | operational or runbook gap | test-harness or environment precondition | maintenance observation>
- Hypotheses or risks: <clearly labelled, optional>
- Recommended next action: <one bounded action>

### Acceptance and Verification

- Requirements: <numbered list, when applicable>
- Acceptance criteria: <numbered list, when applicable>
- Allowed files: <explicit minimal path list for implementation; no wildcards>
- Required checks: <exact commands and results>

### Outcome

- Changed files: <paths or none>
- Review verdict: <APPROVE | CHANGES_REQUESTED | NOT_APPLICABLE>
- Remote side effects: <verified issue, project, branch, or PR URLs; otherwise none>
```

For a delivery handoff, include the verified Issue number and URL, target
repository, Project URL, exact branch name, base branch, authorized Project
status update, and approved review report.

## Role Ownership

| Role | Owns | Must not do |
| --- | --- | --- |
| Tech lead | Delegation, scope decisions, human checkpoints, final local summary | Invent test results, change application code, claim unverified GitHub writes occurred |
| QA | Reproduction, evidence collection, focused checks, defect reporting | Modify application code, create tickets, diagnose unsupported root causes |
| PM | Backlog-ticket drafting from verified findings; publish one human-selected ticket as an authorized Issue and Project item | Run code changes; publish candidate tickets; create branches, commits, or pull requests; claim an Issue or Project item was created without verified URLs |
| Coding | One human-selected ticket, implementation, acceptance checks | Start work before ticket selection, expand scope, push or create remote work items |
| Code review | Diff and acceptance-criteria review, focused verification, verdict | Modify code, approve without recording checks |
| Delivery | One approved local implementation: branch, commit, pull request, and authorized Project update | Modify application files, reinterpret the ticket, deliver without an approved review and verified Issue, merge pull requests, or create extra branches or pull requests |

## Evidence Conventions

Start in investigation mode when the user provides a reported outcome,
reproducible defect, specified requirement, or CI failure. In discovery mode,
the user requests a health check or does not provide a problem; QA then
establishes the initial evidence and recommended bounded scope. Select evidence
sources and validation commands from the lead's scope, repository instructions,
and available artifacts. Treat generated logs, build output, and locally
produced evidence as uncommitted artifacts unless the selected ticket explicitly
requires a source-controlled fixture.

## GitHub Tracking Convention

Ticket drafting produces proposed backlog entries only. After the human selects
one ticket, the tech lead may explicitly authorize PM to publish exactly that
ticket to the repository and Project named in the delivery configuration. PM
must return the verified Issue number, Issue URL, Project URL, and Project status
before the lead records remote side effects. Tracking failure does not authorize
a substitute target or block local coding and review unless the human explicitly
makes tracking a prerequisite.

## Delivery Convention

Delivery starts only after code review returns `APPROVE` and PM returns a
verified selected-ticket Issue number, Issue URL, Project URL, and Project
status. The tech lead resolves the exact branch name from the delivery
configuration's branch template and Issue number, then authorizes the configured
repository, base branch, Project, and status update. Delivery may commit the
approved local change, create that one branch and one pull request with
`Closes #<issue-number>`, update the selected Issue's existing Project item, and
report verified URLs and CI status. Delivery must stop and report a blocker when
the worktree differs from the reviewed change or a required handoff value is
incomplete.