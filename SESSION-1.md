# Rogers Session 1: One development workflow with GitHub Copilot

**Monday, November 23, 2026 | 10:30 am-noon ET | 90 minutes**

> **How this guide works.** This is a hands-on workshop: you'll do every step on
> your own machine. Each section has these parts:
>
> - **Scenario & Background**: sets the stage and explains when you'd use the
>   technique at work.
> - **▶️ Follow along**: we do it on screen and you do it at the same time.
> - **🧑‍💻 Your turn**: you run the whole loop on your own (S8).
>
> Prompts and commands appear in code blocks so they're easy to copy. Use whichever
> approved surface you prefer: Copilot App, Copilot CLI, or VS Code. Everyone's
> experience level is welcome. If you fall behind, pick up at the next step; your
> results don't need to match the screen exactly.
>
> **Draft, rehearsal pending:** prompts, commands, and timings have not been run yet.
> Items in [brackets] will be filled in after the dry-run.

---

## The app we're working in: Octocat Supply

Octocat Supply is a small supply-chain demo app: a TypeScript/Express API with a
SQLite database, and a React/Vite/Tailwind front end. It manages **products**,
**suppliers**, **orders**, and **deliveries** for a fictional company's branches.

The products page lets you pick a quantity and click **Add to Cart**, but the cart
isn't built yet: the button only shows a pop-up message. That gap is our scenario.

**Our goal today:** take one small cart behavior from idea to a reviewed pull request
and see where Copilot helps at each step, while you stay in charge of the decisions.
The loop we'll follow:

> **plan -> build -> test -> review in the terminal -> pull request review -> CI**

Along the way you'll see how to choose the right Copilot surface, mode, and effort for
a task, and why each step ends with a person checking the result.

---

## Before you start

Ahead of the workshop you were asked to:

- Confirm you have GitHub and GitHub Copilot access (request it through the Rogers
  GitHub Access Portal if needed).
- Install and update VS Code and the GitHub Copilot extension.
- Confirm Git is installed and you can authenticate with GitHub.
- Make sure you can clone a repository, create a branch, and push changes.
- Confirm you can access the Copilot App and CLI.

**Getting the files:** your facilitator will share this guide, `SESSION-1.md`.
Upload it to [where participants add the file]. If a section needs another file, it
will be shared on its own with instructions for where to add it.

If something isn't ready, pair with a neighbor or follow on screen for now, and
we'll get you set up after the session.

---

## Agenda

| Time | Section | Format |
| --- | --- | --- |
| 0-5 | S1. Welcome and surface map | ▶️ Follow along |
| 5-15 | S2. Copilot App: sessions, modes, and Fusion | ▶️ Follow along |
| 15-32 | S3. Feature development | ▶️ Follow along |
| 32-40 | S4. Testing | ▶️ Follow along |
| 40-48 | S5. Copilot CLI | ▶️ Follow along |
| 48-55 | S6. Pull request and code review | ▶️ Follow along |
| 55-60 | S7. CI and agentic automation | ▶️ Follow along |
| 60-80 | S8. Your turn | 🧑‍💻 Your turn |
| 80-90 | S9. Wrap-up | Discussion |

---

## S1. Welcome and surface map (~5 min)

**Scenario:** A teammate asks, "Which Copilot should I use for this?" There are
several places Copilot shows up. Before we build anything, we'll map each one to a
step in the work.

**Background:** Copilot isn't one tool in one place. It's one agent experience across
several surfaces, and you pick the one that fits where you're working.

| Surface | What it is | Common uses | Where we use it today |
| --- | --- | --- | --- |
| **Copilot App** (desktop) | Runs agent sessions on your repositories, several in parallel, each on its own branch or worktree. Triage issues, review changes, and follow PRs and CI in one place. | Planning and running tasks; parallel work; starting from an issue; PR follow-through | S2, S3, S6 |
| **Copilot CLI** | The same agent in your terminal: interactive (`copilot`) or one-shot (`copilot -p "..."`). Shift+Tab switches into plan mode. | Quick terminal changes; Git work; `/review` and `/diff`; scripted prompts | S5 |
| **VS Code** | Inline suggestions as you type, the Chat view (an agent beside your editor, terminal, and tests), and the Agents window for coordinating sessions. | Hands-on editing; focused edits; debugging with tests | Your option in S8 |
| **GitHub.com** | Copilot code review on PRs, Copilot in the cloud for background work, and agentic workflows in GitHub Actions. | PR review; background tasks; CI automation | S6, S7 |

How they fit one workflow:

**Plan** (App plan mode, CLI plan mode, VS Code `/plan`) -> **Build** (App session,
VS Code, CLI) -> **Test** (the agent runs tests; you check the results) -> **Review**
(Copilot code review plus a person) -> **CI** (Actions checks; agentic workflows for
jobs that need reasoning).

**Watch out for:**

- **Surfaces don't share uncommitted work by magic.** The App and CLI only see the
  same changes when they open the same checkout or worktree.
- **What you see depends on policy.** The App and CLI have separate admin policies,
  and some models or features may be turned off for your organization. If something
  is missing, use another surface; don't troubleshoot it during the session.
- **Copilot doesn't replace the review.** Every step still ends with a person
  checking the result.

#### ▶️ Follow along

> Quick readiness check. Can you:
>
> 1. Sign in to GitHub and see Copilot as available?
> 2. Open the Copilot App, or start `copilot` in a terminal?
>
> If not, say so in the chat now and pair with a neighbor or follow on screen. We'll
> sort out individual setups after the session rather than hold up the group.

**Learn more:** [Copilot App](https://docs.github.com/en/copilot/concepts/copilot-surfaces/github-copilot-app),
[Copilot CLI](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-cli),
[VS Code agents](https://code.visualstudio.com/docs/agents/overview),
[Copilot code review](https://docs.github.com/copilot/concepts/code-review).

---

## S2. Copilot App: sessions, modes, and Fusion (~10 min)

**Scenario:** We've been asked to start on the cart. Before writing code, we want to
think it through and agree on a plan, without Copilot changing files yet.

**Background:**

**1. Chats for general questions, sessions for work on your code.**

- A **chat** isn't connected to a repository. It knows what you type and any files
  you attach, but it won't look through your codebase, show a plan in the side panel,
  or change files. Use it for general questions, brainstorming, or drafting wording.
- A **session** is started from a repository or folder you've added to the App. Its
  agent can look through the code on its own, change files, and run commands. The
  side panel shows its file tree, plan, to-do list, and changes. Use a session
  whenever the answer depends on your actual code.

**2. Choose where the session runs before you start.**

- **Environment:** *This computer* (local) or *Cloud* (a GitHub-hosted sandbox you
  can steer from any device).
- **Workspace:** *New worktree* is an isolated copy of the repository on its own
  branch. It's safe for parallel work, and its changes stay there until you review
  and open a PR. *Current checkout* works directly in your existing files: simpler,
  but one task at a time.

**3. Modes control how much the agent does before checking in.**

| Mode | What happens | Use it when |
| --- | --- | --- |
| **Interactive** | Suggests changes and waits for you | You want tight, step-by-step control |
| **Plan** | Writes a plan; nothing runs until you approve it | You want to agree on scope and approach first (today's default) |
| **Autopilot** | Works on its own: writes code, runs tests, iterates | The task is small and well defined |

You can switch modes at any time. **Mode is separate from tool permissions**, which
decide whether the agent asks before running tools: *Ask every time*, *Assisted*
(a model approves requests it judges safe and asks about the rest), or *Approve all*.

**4. Model and effort: Copilot Fusion.**

- **Fusion is a router, not a model.** For each prompt it chooses the models and a
  pattern:
  - **Single:** one model does the task.
  - **Cascade:** an efficient model drafts; a judge accepts it or escalates.
  - **Critique:** several models review a draft before it's revised.
- **You choose the effort level:**
  - **Standard** for everyday work.
  - **High** for substantial, multi-file work.
  - **Max** for the deepest reasoning.

  Higher effort is slower and uses more AI credits. Hover over the effort label
  under a response to see which models ran.
- **Practical rule:** start at Standard, move to High for planning across several
  files, and use Max sparingly.
- **Availability depends on your plan and your organization's model policies.** If
  you see **Auto** instead of Fusion, that surface uses Auto model selection; its
  tiers (Efficiency, Balance, Intelligence) are not Fusion effort levels.

**Common uses of the App:** plan a change before touching code; run two tasks in
parallel worktrees; start a session from an issue; review a diff and open a PR;
follow CI and review feedback through to merge.

**Watch out for:**

- "The chat knows my codebase." It only knows what you type or attach. Use a session
  when the answer depends on the code.
- "Autopilot is the advanced mode, so it's better." It's riskier for unclear tasks.
  Plan first, then decide.
- "Max is always best." It costs more and takes longer. Match effort to the task.
- "Worktree changes are on my main branch." They're on the worktree's own branch
  until you merge them.

#### ▶️ Follow along

> 1. Start a **session** on the Octocat Supply repository: in the sidebar, hover over
>    the repository and click **+** (**New session**). Choose *This computer* and a
>    *New worktree*, select **Plan** mode, and pick Copilot Fusion at **Standard** or
>    **High** effort.
>
> 2. Ask a scoping question. Because this is a session, Copilot looks at the actual
>    code to answer (draft, to be rehearsed):
>
>    ```text
>    Look at frontend/src/components/entity/product/Products.tsx, frontend/src/components/Navigation.tsx, and docs/design/cart.png. Add to Cart currently only shows a pop-up. What's the smallest useful first cart behavior to build, and what questions should we answer before planning it?
>    ```
>
>    *Optional comparison:* ask a similar question in a new chat without attaching
>    files. It can only answer in general terms, because it isn't connected to the
>    repository.
>
> 3. Send the planning prompt (draft, to be rehearsed):
>
>    ```text
>    Read frontend/src/components/entity/product/Products.tsx and look at docs/design/cart.png. Propose a short plan for [selected cart slice], with acceptance criteria and the files you'd change. Don't change any files yet.
>    ```
>
> 4. Review the plan in the side panel. Hover over the effort label to see which
>    models ran. **Don't approve it yet**; S3 continues from here.

**Learn more:** [Agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions),
[Copilot Fusion](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/models/copilot-fusion),
[Auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection).

---

## S3. Feature development (~17 min)

**Scenario:** The plan from S2 is on screen. Now we tighten it into clear acceptance
criteria, approve it, and let Copilot build one small cart behavior.

**Background:** The quality of what Copilot builds depends on how clearly you define
"done." Good acceptance criteria are specific and checkable, for example "the badge
shows the number of items" rather than "the cart works." Review the plan before
approving it: check the files it will touch, what it will leave alone, and how it will
prove the behavior works. Keep the slice small enough to review in a few minutes.

**Common uses:** turning a ticket into a plan; building UI from a design mockup;
adding one behavior to an existing page; getting a second opinion on an approach
before you commit to it.

#### ▶️ Follow along

> 1. Tighten the plan (draft, to be rehearsed):
>
>    ```text
>    Before I approve: list the acceptance criteria as numbered, checkable statements. Confirm which files you will and won't change, and keep the change limited to [selected cart slice].
>    ```
>
> 2. Approve the plan and let the session implement it. Watch the to-do list and
>    changes in the side panel.
>
> 3. Run the app and check each acceptance criterion yourself in the browser at
>    [local front-end URL].

**What to notice:** the plan is a contract you can edit before any code changes; and
the agent saying "done" isn't the same as you seeing it work.

---

## S4. Testing (~8 min)

**Scenario:** The behavior works when we click through it. Now we want proof that
keeps working after the next change.

**Background:** Tests turn acceptance criteria into evidence that runs every time.
Ask for a few **focused** tests tied to the criteria, not a large suite. Then run
them yourself: an agent reporting "all tests pass" is a claim; output you've seen is
evidence. When a test fails, decide whether the code or the test is wrong before
asking for a fix.

**Common uses:** writing tests for new behavior; covering edge cases you'd otherwise
skip; explaining and repairing a failing test; checking that a test actually fails
when the behavior breaks.

#### ▶️ Follow along

> 1. Ask for focused tests (draft, to be rehearsed):
>
>    ```text
>    Write focused tests for [selected cart slice], one per acceptance criterion. Follow the existing test style in this repo. Run them with [test command] and show me the output.
>    ```
>
> 2. Run the tests yourself and read the result:
>
>    ```bash
>    [test command]
>    ```
>
> 3. Optional check: temporarily break the behavior and confirm a test fails.

**What to notice:** tests map one-to-one to the acceptance criteria, and you
confirmed the result yourself.

---

## S5. Copilot CLI (~8 min)

**Scenario:** You prefer the terminal, or you're already there. We'll review the
same change and update a short document without switching tools.

**Background:** The CLI is the same Copilot agent in your terminal. It only sees the
changes in the folder you start it in, so first confirm you're in the **same worktree
and branch** as the App session. `/diff` shows what changed, `/review` asks Copilot to
review it, and plain prompts can make small changes such as a documentation update.

**Common uses:** reviewing local changes before you commit; quick fixes without
opening an editor; Git tasks such as summarizing history; one-shot scripted prompts
with `copilot -p`.

#### ▶️ Follow along

> 1. Open the same worktree and confirm where you are:
>
>    ```bash
>    cd [worktree path]
>    git status --short --branch
>    copilot
>    ```
>
> 2. Inside the CLI, review the change:
>
>    ```text
>    /diff
>    /review
>    ```
>
> 3. Make a small documentation update (draft, to be rehearsed):
>
>    ```text
>    Update [existing doc] with 3-5 lines describing [selected cart slice] and how to test it. Change only that file.
>    ```

**What to notice:** the CLI saw the App's changes because it opened the same
worktree, and `/review` here is a local review, separate from the pull request
review in S6.

---

## S6. Pull request and code review (~7 min)

**Scenario:** The change is built, tested, and documented. Now it needs to be reviewed
and accepted by the team.

**Background:** A good pull request says **what** changed, **why**, and **how it was
tested**. Copilot code review gives a fast first pass on the PR and can suggest fixes,
but it doesn't decide. For each finding, a person decides whether to accept it, reject
it, or follow up, and says why. CI checks run alongside the review as separate
evidence. Green checks alone aren't approval.

**Common uses:** drafting a PR description from the diff; getting a first-pass review
before a teammate looks; checking a change against the original requirement; applying
a suggested fix in a couple of clicks.

#### ▶️ Follow along

> 1. Draft the PR description (draft, to be rehearsed):
>
>    ```text
>    Draft a pull request description for this change: what changed, why, how it was tested (include the test command and result), and anything a reviewer should look at closely.
>    ```
>
> 2. Open the PR and request a **Copilot code review**.
>
> 3. Go through each finding: accept, reject, or follow up, with a one-line reason.
>    Check the CI results on the PR.

**What to notice:** you made the final call on every finding; Copilot gave the first
pass.

---

## S7. CI and agentic automation (~5 min)

**Scenario:** A build fails at 2 a.m. Should a fixed script handle it, or an agent
that can reason about the failure?

**Background:** Ordinary CI runs **fixed steps** every time (install, build, test,
lint). That's right when the job is predictable. **Agentic workflows** run a Copilot
agent inside GitHub Actions for jobs that need judgment, such as analyzing a failure
or triaging an issue. Because an agent can act, check four things before it runs:

1. **Trigger:** what starts it.
2. **Permissions:** what it can read and write.
3. **Outputs:** what it's allowed to create, such as an issue or a comment.
4. **Human oversight:** who reviews what it produces.

**Common uses:** CI failure analysis; issue triage; documentation updates; daily
repository summaries.

#### ▶️ Follow along

> Open these files in your copy of the repository. We'll read them, not run them.
>
> ```text
> .github/workflows/ci.yml                        # ordinary CI: fixed steps
> .github/workflows/auto-analyze-failures.md      # agentic workflow: instructions and guardrails
> .github/workflows/auto-analyze-failures.lock.yml  # the generated workflow that actually runs
> ```
>
> In the agentic file, find the trigger, the permissions, and the outputs it's
> allowed to create.

**What to notice:** the agentic workflow's guardrails are written down and reviewable,
and its outputs, such as creating an issue, are real actions, not just logging.

**Learn more:** [GitHub Agentic Workflows](https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/).

---

## S8. Your turn (~20 min)

**Scenario:** The first cart behavior is in place. A follow-up request comes in:
when a shopper removes the last item, show an empty-cart message with a **Continue
shopping** action, and keep the cart badge correct.

**Background:** You'll run the same loop on your own: plan, build, test, review. Stay
in one surface (App, CLI, or VS Code) rather than switching mid-exercise.

#### 🧑‍💻 Your turn

> 1. Start from the participant starter: [starter repository or branch].
>
> 2. In **Plan** mode, plan the change (draft, to be rehearsed):
>
>    ```text
>    Plan this change: when the last item is removed from the cart, show an empty-cart message with a "Continue shopping" action that returns to the products page, and keep the cart badge count correct. List numbered acceptance criteria and the files you'd change. Don't change files until I approve.
>    ```
>
> 3. Review and approve the plan, then let Copilot implement it.
>
> 4. Ask for focused tests, one per acceptance criterion, and run them yourself.
>
> 5. Review the diff (`/diff` and `/review` in the CLI, or the changes view in the
>    App or VS Code).
>
> **Done when** removing the last item shows the empty-cart message, **Continue
> shopping** returns to the products page, the badge shows the right count, and
> you've seen the focused tests pass yourself.

**Optional follow-up:** after the session, pick one more edge case and write down how
you'd test it.

---

## S9. Wrap-up (~10 min)

### Putting it together

Today we took one small change through **plan -> build -> test -> review -> CI**.
Copilot helped at every step, but the value came from clear acceptance criteria, a
reviewed plan, tests you ran yourself, and review decisions you made. The point isn't
just generating code faster; it's combining clear guidance with real verification so
the speed is backed by evidence.

### Reflect

- Which step would save you the most time on your current work?
- Where would Plan mode have caught a misunderstanding earlier on a recent task?
- What would you want a human to check before trusting an agentic workflow?

### Key takeaways

| Topic | Takeaway |
| --- | --- |
| Surfaces | Same agent, different places; pick the one that fits where you're working. |
| Chats vs sessions | Chat for general questions; session when the answer depends on your code. |
| Modes and effort | Plan first; match effort to the task. |
| Feature development | Clear acceptance criteria drive a good result. |
| Testing | An agent's "tests pass" is a claim; output you've seen is evidence. |
| CLI | Same agent in the terminal; same worktree, same changes. |
| Code review | Copilot gives the first pass; a person owns the decision. |
| Agentic automation | Check trigger, permissions, outputs, and oversight before it runs. |

### Next steps

- **This week:** use Plan mode for one real task before writing any code.
- **This month:** add Copilot code review to your team's PR routine.
- **Later:** look for one CI job that needs judgment and check whether an agentic
  workflow fits.

### Resources

- [GitHub Copilot docs](https://docs.github.com/en/copilot)
- The original Copilot Academy labs are listed in the source map at the end of this
  guide. Explore them at your own pace.

---

## Facilitator preparation and dry-run record - not participant instructions

**Status:** Static snapshot/outline preparation only. No dependencies installed,
application started, test suite run, workflow dispatched, automation enabled,
starter/checkpoint created, or PR opened as part of this preparation. Publishing
the snapshot may trigger push-event workflows; such runs are not rehearsal evidence.

### Repository and setup reference (facilitator only)

**Provenance:** the dry-run repository
<https://github.com/rko26-tt-shiny-dollop/test-repo-rogers> starts from a
single-commit snapshot of
[copilot-academy/octocat_supply@`0ac787d`](https://github.com/copilot-academy/octocat_supply/commit/0ac787d24a029e49ec97c3ca0441eec0ec85a00d):
the full upstream tree unchanged (including `api/ca.key` and all `.github/workflows/`),
without upstream history, plus this guide in a separate commit. There is no standalone
LICENSE/NOTICE file; `api/package.json` declares MIT. Confirm redistribution
expectations before broader distribution. Update this note for the session repository.

**Readiness:** the pre-workshop checklist was requested, not verified. Repository
access, runtime startup, and permitted surfaces still need confirmation. The CLI demo
must open the same worktree and branch as the App demo.

**Layout and setup notes (inspected, not run):**

- `api/` (Express, SQLite) and `frontend/` (React/Vite/Tailwind) each have their own
  `package.json`; there is **no root `package.json`**.
- Node.js 24 is the baseline (CI and devcontainer); also needs npm and Make.
- `make install`, `make build`, `make dev` (dev startup seeds SQLite); API tests:
  `npm run test:coverage` in `api/`; Playwright: `npm run test:e2e` in `frontend/`.
  Default ports: API `3000`, Vite `5137`. `make test` expects a missing frontend
  `test` script.
- Cart starting state: `Products.tsx` Add to Cart only alerts; no cart route, state,
  or badge. Design reference: `docs/design/cart.png`.
- Proposed participant slice (not validated): removing the final item shows an
  empty-cart message and **Continue shopping**, keeps the badge consistent, with
  focused tests. Starter and checkpoint are not yet prepared.

### S1-S2 presenter beats (draft, un-rehearsed)

Read from the S1/S2 **Background**; use these beats for timing and what to show.
Features and labels were checked against GitHub docs and changelog on November 22,
2026 (Copilot Fusion GA: October 28, 2026). Re-check the live UI in the dry-run.

**S1 (5 min)**

| Time | Say / show |
| --- | --- |
| 0:00-1:00 | Welcome; the one-change scenario; the three participation labels |
| 1:00-2:00 | Quick readiness check (show of hands or chat): Copilot access, App, CLI. No fixing live |
| 2:00-4:30 | Surface table, then the plan -> CI line; name where each appears today |
| 4:30-5:00 | "Watch out for"; hand off to the App |

**S2 (10 min)**

| Time | Say / show |
| --- | --- |
| 0:00-1:00 | Explain chat vs session (a chat only knows what you type or attach) |
| 1:00-3:00 | Start a **session** from the repo (**+** New session); show the Environment and Workspace choices; explain worktree vs current checkout |
| 3:00-5:00 | Show the three modes and the tool-permission options; pick **Plan** and *Ask every time* or *Assisted*; pick Fusion (Standard or High) |
| 5:00-6:30 | Send the scoping prompt; point out Copilot reading the actual files. Optional: same question in a chat for contrast |
| 6:30-9:00 | Send the planning prompt; show the plan in the side panel; hover over the effort label to show the models used. Don't approve yet; S3 continues from here |
| 9:00-10:00 | Recap: chat vs session, mode vs permissions, effort matches the task |

The scoping and planning prompts are in the S2 **Follow along** steps.

**Fallbacks:**

- Fusion isn't shown: use whatever model picker is available and say why.
- High or Max is missing: use Standard (the plan or a model policy limits it).
- The App is unavailable: show plan mode in the CLI (Shift+Tab).

**Not yet verified:** exact plan-approval button wording, whether Rogers' policy
enables High/Max, and how long the planning prompt takes.

### Section notes and guardrails (facilitator only)

- **S2:** Fusion is policy-dependent; don't promise a specific menu label or model.
  Borrow App techniques, not the Academy's Pulse Analytics scenario or artifacts.
- **S3:** Full cart construction is not the live task. Use a starter only after it
  has been prepared and verified. Fill in the slice and local URL after rehearsal.
- **S4:** The source lab's product/supplier API coverage exercise is a technique
  reference, not a frontend instruction; no repository-wide 80% target. Frontend
  test setup and the non-watching test command are not yet established.
- **S5:** Confirm the actual worktree path and branch. Rehearse `/diff` and `/review`
  availability. Don't create the CLI lab's Task Manager API or reuse its paths.
- **S6:** Distinguish CLI/local review from Copilot PR review. A prepared
  review/check-result fallback is pending. No merge or Agent Merge needed. In the
  dry-run repo, `build-and-publish.yml` and `copilot-setup-steps.yml` fail before
  any job runs; expect red checks on the PR.
- **S7:** Source walkthrough only. The source permits issue creation and selected
  Copilot assignment (real side effects). Per the Academy lab, App automations need
  an eligible private/internal repo, write access, and org permission; cloud runs
  need the cloud agent. Eligibility here is unverified. Don't activate automations,
  compile/dispatch workflows, provision secrets, change policy, or run
  `test-auto-analysis.yml` (an intentional-failure workflow). The generated
  failure-analysis workflow expects `COPILOT_GITHUB_TOKEN`.
- **S8:** Scope and acceptance criteria are provisional until the cart foundation
  and tests are rehearsed. Participants must work from the confirmed starter, not a
  guessed branch or someone else's uncommitted files.
- **S9:** Separate observed behavior from untested ideas in the recap.

### Per-section rehearsal slots

Replace each pending cell with actual evidence, not predicted results. Keep detailed
troubleshooting here; publish only confirmed participant steps into the sections above.

| Section | Exact steps/prompts | Observed output/evidence | Measured time vs. budget | Fallback and trigger |
| --- | --- | --- | --- | --- |
| S1 | Draft beats above; [to be rehearsed] | [Not observed] | [Not measured] / 5 min | [To be rehearsed: access-limited participation] |
| S2 | Draft beats and prompt above; [to be rehearsed] | [Not observed] | [Not measured] / 10 min | [To be rehearsed: available mode without Fusion] |
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
