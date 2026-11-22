# Rogers Session 1: One development workflow with GitHub Copilot

**Monday, November 23, 2026 | 10:30 am-noon ET | 90 minutes**

> **Working draft - rehearsal required.** This is a usable outline, not a finished
> participant handout. Source files have been imported and inspected; the application,
> exercises, prompts, timings, reviews, and CI have not been run in this repository.
> We will rehearse each section together, capture actual results, then make an
> editorial and timing pass. No cart starter or participant checkpoint is prepared.

## Introduction

To make the most of our 90 minutes, we'll follow one workshop guide built around a
single development scenario in Octocat Supply. The guide brings together selected
exercises and techniques from the Copilot Academy materials, connecting planning,
implementation, testing, review, and CI into one practical workflow. We'll combine
demonstrations with guided practice rather than complete each original lab in full.
Follow this guide during the session; the original resources are linked at the end
for deeper exploration afterward.

The session welcomes mixed levels of Copilot experience. **Watch the demonstration**
means follow the presenter without keeping your tools in lockstep. **Try it yourself**
marks guided practice in your chosen surface. **Optional follow-up** is outside the
90-minute core; it is not required to keep up.

## Learning outcomes

- Turn a small requirement into a reviewed plan with explicit acceptance criteria.
- Understand the roles of App chats/sessions, modes, model effort, and CLI; recognize
  that Fusion and other features depend on availability and policy.
- Inspect a bounded implementation and verify behavior with focused tests.
- Use diffs, Copilot feedback, and human judgment together during code review.
- Distinguish ordinary CI from agentic automation and identify the permissions,
  inputs, and outputs that need checking before automation runs.

## Repository, setup, and known starting state

### Source provenance and snapshot scope

Workshop repository: <https://github.com/rko26-tt-shiny-dollop/test-repo-rogers>.

Source: <https://github.com/copilot-academy/octocat_supply>, default branch `main`,
snapshot inspected and published on November 22, 2026:

`0ac787d24a029e49ec97c3ca0441eec0ec85a00d`

Pinned source: <https://github.com/copilot-academy/octocat_supply/commit/0ac787d24a029e49ec97c3ca0441eec0ec85a00d>.

This repository's first commit is a **single-commit snapshot** of that upstream
revision: its file tree is identical to upstream `main` at `0ac787d`, without the
upstream commit history. All upstream tracked files are included unchanged,
including `api/ca.key` (upstream demo key material) and every `.github/workflows/`
definition, exactly as upstream ships them. The upstream README and attribution are
unchanged. The only addition is this guide, `SESSION-1.md`, in a separate commit.

The snapshot has **no standalone LICENSE, COPYING, or NOTICE file**.
`api/package.json` declares `"license": "MIT"`; that metadata and existing attribution
are preserved. This does not establish a repository-wide license for every asset.
Confirm upstream licensing/redistribution expectations before broader distribution;
no new license grant is invented here.

### Actual layout

| Path | What is present |
| --- | --- |
| `api/` | TypeScript/Express API, SQLite persistence, migrations and seed data; its own `package.json` and `package-lock.json` |
| `frontend/` | React/Vite/Tailwind UI; its own `package.json` and `package-lock.json` |
| `frontend/src/components/entity/product/Products.tsx` | Product list and quantity controls; Add to Cart is still a TODO/alert |
| `frontend/src/App.tsx`, `frontend/src/components/Navigation.tsx` | Existing routes/navigation; no implemented cart route or cart badge |
| `frontend/tests/` | Existing Playwright end-to-end test and product-navigation feature description |
| `docs/design/cart.png` | Cart design image, present; using it in the demo still needs rehearsal |
| `docs/`, `Makefile` | Source architecture/build documentation and per-component commands |
| `.github/` | Instructions, prompts, agents, skills, hooks, actions, and workflow definitions; import is not an instruction to run them |
| `.devcontainer/`, `.vscode/`, `docker-compose.yml`, `infra/` | Environment/editor/container/deployment definitions; not provisioned or launched |

There is **no root `package.json`**. Do not assume root npm workspace commands work.
Use the actual component manifests and inspected Makefile rather than generic
template instructions.

### Participant readiness: requested, not verified

Before the workshop, participants were asked to have GitHub/Copilot access,
updated VS Code and its Copilot extension, Git and authentication, clone/branch/push
capability, and App/CLI access. Receipt of that request is not proof of readiness.
Repository access, runtime startup, and permitted surfaces still need confirmation.

The presenter will use App and CLI; VS Code remains an available participant surface.
Choose one approved surface for guided practice rather than switching repeatedly.
The CLI demonstration must open the **same actual worktree and branch** as the App
demo. A different clone/worktree does not share uncommitted changes.

### Setup references - inspected, not yet run

Use Node.js **24 as the rehearsal baseline**: the imported CI and devcontainer select
24. Older source prose mentions 18+ or 22+ and is not a verified compatibility promise.
Local setup also needs npm and Make; SQLite's native dependency may require platform
build support. Docker is optional, not required for the selected local path.

| Source command/configuration | Meaning and current status |
| --- | --- |
| `make install` | Installs dependencies separately in `api/` and `frontend/`; not run |
| `make build` | Builds both components; not run |
| `make dev` | Starts both development services; API development startup initializes/seeds SQLite; not run |
| `api/package.json`: `npm run test:coverage` from `api/` | API Vitest coverage command; not run and not a cart/frontend test command |
| `frontend/package.json`: `npm run test:e2e` from `frontend/` | Playwright command; browser installation and working runtime remain unverified |
| API default `3000`; Vite `5137` | Source-configured local ports, not confirmed running endpoints |

These are source references, **not a copy-and-run rehearsal sequence**. Do not run
setup, expose ports, or change permissions just to follow this draft. The facilitator
will replace placeholders with the smallest confirmed setup path after rehearsal.
In particular, `make test`/`make test-frontend` expect a frontend `test` script that
is absent. Frontend Vitest dependencies exist, but no frontend unit-test script or
Vitest setup has been established for this workshop.

### Proposed development throughline

**Recommendation, not a validated scenario:** demonstrate a small shopping-cart
behavior on a prepared starter, not an entire cart implementation live.

Candidate participant follow-up: removing the final item displays an empty-cart
message and a **Continue shopping** action, keeps the badge consistent, and is
supported by focused tests and review. The final slice, starter, and participant
checkpoint will be chosen during rehearsal.

**Starting-state incompatibility:** the imported source does not yet provide the
cart needed for that follow-up. `Products.tsx` only alerts and resets the selected
quantity; the app has no cart route, cart state provider, or navigation badge.
The existing "No products found" state is product search, not an empty cart.
No cart implementation, starter branch, prepared PR, or checkpoint was created
during repository preparation.

## 90-minute agenda

Elapsed times are measured from 10:30 am ET. Optional follow-up is not extra live time.

| Elapsed minutes | Duration | Segment | Delivery |
| --- | --- | --- | --- |
| 0-5 | 5 | S1: Welcome, readiness, and surface map | Watch the demonstration |
| 5-15 | 10 | S2: App and Fusion | Watch the demonstration |
| 15-32 | 17 | S3: Feature development | Watch the demonstration |
| 32-40 | 8 | S4: Testing | Watch the demonstration |
| 40-48 | 8 | S5: CLI | Watch the demonstration |
| 48-55 | 7 | S6: PR and code review | Watch the demonstration |
| 55-60 | 5 | S7: CI and agentic automation | Watch the demonstration |
| 60-80 | 20 | S8: Guided participant exercise | Try it yourself |
| 80-90 | 10 | S9: Questions, takeaways, and resources | Try it yourself |
| **Total** | **90** | | |

## Session sections

The order below is the participant path. Draft slots are deliberately unfinished.
For every section, exact steps/prompts, observed output, measured time, and a fallback
are explicitly reserved in the separate facilitator rehearsal record below.

### S1. Welcome, readiness, and surface map (0-5)

**Intended outcome:** Know the single scenario, the participation labels, and which
surface to use without assuming everyone has the same experience.

**Delivery:** Watch the demonstration.

**Selected scope:** Quick access/readiness check; map App, CLI, VS Code, and GitHub
review/CI to the same development workflow. Avoid installation troubleshooting in
the live five-minute introduction.

**Draft activity:** [To be rehearsed: opening explanation and readiness check.]

### S2. App and Fusion (5-15)

**Intended outcome:** Understand chat versus a repository session, worktree isolation,
and choosing a mode/model effort appropriate to the task.

**Delivery:** Watch the demonstration.

**Selected scope:** App surfaces, chat/session, modes, and Fusion/model effort using
the Octocat requirement. Fusion is policy-dependent; no specific availability,
menu label, or model option is promised. Borrow App techniques, not the Academy's
Pulse Analytics launch-readiness scenario or its dashboards/artifacts.

**Draft activity:** [To be rehearsed: available App controls and bounded planning prompt.]

### S3. Feature development (15-32)

**Intended outcome:** See a small requirement become a reviewed plan, a bounded
implementation, and independently checked behavior.

**Delivery:** Watch the demonstration.

**Selected scope:** Inspect `docs/design/cart.png`; clarify acceptance criteria,
review the plan, implement only the selected slice, and inspect the result.
Use a starter only after it has actually been prepared and verified.
Full cart construction is not the live task.

**Draft activity:** [To be rehearsed: final slice, starter reference, prompt, approval
boundary, implementation steps, and manual behavior checks.]

### S4. Testing (32-40)

**Intended outcome:** Connect acceptance criteria to focused tests and distinguish an
agent's success claim from observed execution.

**Delivery:** Watch the demonstration.

**Selected scope:** Generate a few tests for the chosen behavior, execute/repair them,
then verify independently. The source lab's product/supplier API coverage exercise
is a technique reference, not a frontend instruction. No repository-wide 80% target
is promised in this session.

**Draft activity:** [To be rehearsed: frontend test approach, exact file targets,
non-watching command, assertions, and independent verification.]

### S5. CLI (40-48)

**Intended outcome:** Review the same change and make a small documentation update
from a terminal without losing repository context.

**Delivery:** Watch the demonstration.

**Selected scope:** Confirm actual worktree path and branch, then demonstrate `/diff`,
`/review`, and a short update to an existing document. Exact command availability
and behavior must be rehearsed. Do not create the CLI lab's separate Task Manager
API or reuse its Express/Zod/Jest setup paths.

**Draft activity:** [To be rehearsed: worktree/branch identity check, CLI commands,
documentation target, and bounded documentation prompt.]

### S6. PR and code review (48-55)

**Intended outcome:** Assess the change against requirements using the diff,
Copilot findings, human validation, and check evidence.

**Delivery:** Watch the demonstration.

**Selected scope:** PR creation/context and diff review for the same cart slice;
validate findings before accepting fixes. Distinguish CLI/local review from GitHub
Copilot PR review. Prepared review/check results are a pending fallback, not an
existing deliverable. No merge or Agent Merge is needed.

**Draft activity:** [To be rehearsed: reviewed PR description, permitted review
surface, real findings/check evidence, and human acceptance decision.]

### S7. CI and agentic automation (55-60)

**Intended outcome:** Explain when fixed CI steps suffice and when a guarded agentic
task is appropriate.

**Delivery:** Watch the demonstration.

**Selected scope:** A prepared source/result walkthrough, not live provisioning.
Compare ordinary `.github/workflows/ci.yml` with
`.github/workflows/auto-analyze-failures.md` and its generated
`.github/workflows/auto-analyze-failures.lock.yml`; both agentic files are present.
Inspect failure triggers, read permissions, permitted outputs, and human oversight.
The source permits issue creation and selected Copilot assignment; these are real
side effects, not merely logging. Source exists; a verified result example does not.

According to the linked Academy lab, App automations require an eligible
private/internal repository, write access, and organization permission; cloud runs
also require the cloud agent. Eligibility here is unverified. Repository workflows
have their own execution/secret preflight. Do not activate either automation surface,
compile/dispatch workflows, provision secrets, change policy, or run
`test-auto-analysis.yml` (an intentional-failure workflow).

**Draft activity:** [To be rehearsed: bounded source excerpts, guardrail explanation,
and an approved recorded result or explicitly source-only fallback.]

### S8. Guided participant exercise (60-80)

**Intended outcome:** Practice the same requirement-plan-change-test-review loop on
one manageable follow-up.

**Delivery:** Try it yourself.

**Selected scope:** Candidate final-item removal/empty-cart behavior described above.
Stay in one available surface; work from the confirmed participant starter, not a
guessed branch or another person's uncommitted files. Scope and acceptance criteria
are provisional until the cart foundation and tests are rehearsed.

**Draft activity:** [To be rehearsed: distributed starter/checkpoint reference,
participant steps, prompt, acceptance checks, and recovery path.]

**Optional follow-up:** After the session, explain one additional edge case and how
you would test it; no additional implementation is required during live time.

### S9. Questions, takeaways, and resources (80-90)

**Intended outcome:** Explain what was verified, what still needs human judgment, and
where to find the original materials.

**Delivery:** Try it yourself (discussion and reflection).

**Selected scope:** Questions, one practical takeaway per participant, and the
source/adaptation map. Separate observed behavior from untested ideas.

**Draft activity:** [To be rehearsed: closing prompts, concise recap, and resource handoff.]

**Optional follow-up:** Explore the original labs at your own pace rather than
trying to complete their full scenarios during this workshop.

## Facilitator preparation and dry-run record - not participant instructions

**Status:** Static snapshot/outline preparation only. No dependencies installed,
application started, test suite run, workflow dispatched, automation enabled,
starter/checkpoint created, or PR opened as part of this preparation. Publishing
the snapshot may trigger push-event workflows; such runs are not rehearsal evidence.

### Per-section rehearsal slots

Replace each pending cell with actual evidence, not predicted results. Keep detailed
troubleshooting here; publish only confirmed participant steps into the sections above.

| Section | Exact steps/prompts | Observed output/evidence | Measured time vs. budget | Fallback and trigger |
| --- | --- | --- | --- | --- |
| S1 | [To be rehearsed] | [Not observed] | [Not measured] / 5 min | [To be rehearsed: access-limited participation] |
| S2 | [To be rehearsed] | [Not observed] | [Not measured] / 10 min | [To be rehearsed: available mode without Fusion] |
| S3 | [To be rehearsed] | [Not observed] | [Not measured] / 17 min | [To be rehearsed: prepared diff/result; not yet created] |
| S4 | [To be rehearsed] | [Not observed] | [Not measured] / 8 min | [To be rehearsed: focused test evidence; not yet captured] |
| S5 | [To be rehearsed] | [Not observed] | [Not measured] / 8 min | [To be rehearsed: same-checkout diff/doc walkthrough] |
| S6 | [To be rehearsed] | [Not observed] | [Not measured] / 7 min | [To be rehearsed: recorded review/check result; not yet created] |
| S7 | [To be rehearsed] | [Not observed] | [Not measured] / 5 min | [To be rehearsed: source-only walkthrough if result unavailable] |
| S8 | [To be rehearsed] | [Not observed] | [Not measured] / 20 min | [To be rehearsed: guided review if runtime/access blocks coding] |
| S9 | [To be rehearsed] | [Not observed] | [Not measured] / 10 min | [To be rehearsed: shortened closing with linked resources] |

### Dry-run readiness checklist

- [x] Inspect pinned source, actual layout, cart starting state, and workflow files.
- [x] Record snapshot provenance (upstream `0ac787d`, full tree) and missing standalone license.
- [x] Allocate exactly 90 minutes; keep the six-source adaptation map at the bottom.
- [ ] Confirm participant and presenter repository/Copilot access and allowed surfaces.
- [ ] Confirm licensing/attribution expectations before broader distribution.
- [ ] Confirm Node/npm/Make and native SQLite prerequisites; run and capture the
  minimum install/build/start sequence, actual endpoints, and database reset approach.
- [ ] Resolve stale setup guidance: no root npm workspace; Node/port references
  disagree; frontend unit-test command/setup is absent. Do not promise `make test`.
- [ ] Inspect local configuration before using it: devcontainer creation runs install
  and build; attachment requests public API port visibility. Review `.vscode/mcp.json`
  and imported hooks before enabling/trusting them. Hooks include prompt logging;
  the automatic checkpoint-commit hook is commented out and must remain inactive.
- [ ] Choose the small cart slice and acceptance criteria; prepare and verify a starter
  and participant checkpoint later. Do not mistake the current TODO/alert for a cart.
- [ ] Rehearse the UI, exact prompts, test runner, independent checks, and recovery.
- [ ] Confirm the CLI opens the App demo's actual worktree/branch, including its
  current changes. Avoid a competing agent editing the same files during the demo.
- [ ] Confirm current App/Fusion/review availability and practice the restricted-policy
  fallbacks. Skip installs, plugins, unrestricted permission shortcuts, and extra
  delegation setup in live time.
- [ ] Prepare a real review/check evidence fallback, with its actual revision and URL.
- [ ] Inspect workflow triggers and publication consequences before pushing or merging:
  the snapshot includes scheduled, deployment, build/publish, and agentic definitions.
  Publishing the snapshot does not establish safe or working CI in this repository.
- [ ] Inspect automation guardrails and any required secrets without creating them;
  the generated failure-analysis workflow expects `COPILOT_GITHUB_TOKEN`. Confirm
  policy separately if execution is ever considered; default to source/result review.
- [ ] Capture a permitted result walkthrough or mark the automation segment source-only.
  Do not manufacture a failure or activate an automation to fill this placeholder.
- [ ] Complete every rehearsal record, measure transitions, and time S8 with a
  participant-like environment; then do the final editorial/timing pass.

### Continuity beyond Session 1 (optional)

Preserve the agreed requirement, reviewed plan, focused tests, and review checklist.
They could later support reusable instructions and specialized agents for the same
scenario. This is a continuity note, not a second-session agenda or additional work now.

## Source and adaptation map

These are selected techniques, not a claim that the original labs were completed.
Follow this guide during Session 1; use the originals for optional deeper exploration.

| Source | Selected material | Adaptation and deliberate omissions |
| --- | --- | --- |
| [Getting work done with Copilot App](https://copilot-academy.github.io/labs/getting-work-done-with-copilot-app) | Exercise 2.2 and 3.1-3.3: surfaces, chat/session, modes, Fusion/model effort (S1-S2) | Original is a **noncoding Pulse Analytics launch-readiness** scenario in a local folder. Borrow techniques only; no launch dashboards, artifacts, or scenario. Availability must be rehearsed. |
| [Copilot CLI: Zero to Hero](https://copilot-academy.github.io/labs/copilot-cli-zero-to-hero) | Exercises 5.4 `/review`, 5.5 `/diff`, and 6.2 documentation-generation technique (S5) | Adapt to the same Octocat worktree and a short existing-doc update. Original builds a separate Express/Zod/Jest Task Manager API from scratch; do not create it or copy its paths/commands. Skip installs, plugins, unrestricted permissions, and extra delegation setup live. |
| [Feature development](https://copilot-academy.github.io/workshops/immersive-experience/feature_development) | Steps 1-4 planning/mockup/implementation/verification, Step 5 PR creation (S3, S6, S8) | Original builds an Octocat cart using `docs/design/cart.png`, verified present in this import. A small behavior on a prepared starter is our proposed adaptation, **not an existing Academy checkpoint**; starter and final slice remain pending. |
| [Test coverage](https://copilot-academy.github.io/workshops/immersive-experience/test_coverage) | Steps 2-4 focused test generation, execution/repair, independent verification (S4, S8) | Original targets Octocat product/supplier API routes at 80% coverage. Applying the technique to cart/frontend behavior is an **adaptation**; no copied API targets in frontend instructions and no repository-wide 80% promise. Test setup remains pending. |
| [Code review](https://copilot-academy.github.io/workshops/immersive-experience/code_review) | Selected Steps 1-5: diff/PR context, Copilot review, human validation, CI feedback (S6) | Original builds on the cart PR. Use the same bounded slice here; prepared PR/review/check-result fallback still needs creation. Skip optional Agent Merge and auto-merge. |
| [Agentic workflows](https://copilot-academy.github.io/workshops/immersive-experience/agentic_workflows) | Choose the Right Automation Surface; selected Exercise 2 source/guardrail/result inspection (S7) | `.github/workflows/auto-analyze-failures.md` and generated `.lock.yml` are present. Default to a prepared walkthrough, not execution. Result example is pending. Lab states App automations require eligible private/internal repos and org permission; workflow execution needs separate preflight. No automation activation now. |
