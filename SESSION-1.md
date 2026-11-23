# Rogers Session 1: One development workflow with GitHub Copilot

**Monday, November 23, 2026 | 10:30 am-noon ET | 90 minutes**

> **How this guide works.** This is a hands-on workshop: you do every step on your
> own machine, in your own repository. Each section has:
>
> - **Scenario & Background**: what we're doing and when you'd use it at work.
> - **🧑‍💻 Hands-on**: the steps you run. In S1-S7 we do them together on screen;
>   in S8 you run the loop on your own.
>
> Prompts and commands are in code blocks so they're easy to copy. If you fall
> behind, pick up at the next step; your results don't need to match the screen.
>
> **Draft, rehearsal pending:** prompts, commands, and timings have not been run
> end to end yet. Items in [brackets] will be filled in after the dry-run.

---

## The app and the feature: Octocat Supply's shopping cart

Octocat Supply is a small supply-chain demo app: a TypeScript/Express API with a
SQLite database, and a React/Vite/Tailwind front end. It manages **products**,
**suppliers**, **orders**, and **deliveries** for a fictional company.

The products page has an **Add to Cart** button, but **there is no cart**: the button
only shows a pop-up, and the footer's "My Cart" link goes nowhere. The product team
has a design for the cart page (`docs/design/cart.png`).

**Today you'll build that cart and take it all the way to a reviewed pull request,**
using Copilot at each step while you make the decisions:

> **plan -> build -> test -> review in the terminal -> pull request review -> CI ->
> extend it yourself**

---

## Before you start

Ahead of the workshop you were asked to:

- Confirm you have GitHub and GitHub Copilot access (request it through the Rogers
  GitHub Access Portal if needed).
- Install and update VS Code and the GitHub Copilot extension.
- Confirm Git is installed and you can authenticate with GitHub.
- Make sure you can clone a repository, create a branch, and push changes.
- Confirm you can access the Copilot App and CLI.

You'll also need **Node.js 24** (with npm) and **make**:

```bash
node -v
make -v
```

### Set up your own repository (~10 min, before or at the start of S1)

You'll work in **your own private copy** of the workshop starter. You need your own
repository so you can push branches, open pull requests, and run CI without
affecting anyone else.

1. **Clone the workshop starter:**

   ```bash
   git clone [starter repository URL]
   cd rogers-workshop-starter
   ```

2. **Create an empty private repository** on GitHub, for example
   `[your-name]-octocat-supply`. Set it to **Private** and **don't** add a README,
   `.gitignore`, or license.

3. **Point your clone at your new repository** and push:

   ```bash
   git remote set-url origin https://github.com/[your-username]/[your-name]-octocat-supply.git
   git remote -v
   git push -u origin main
   ```

   `git remote -v` should show **your** repository for both fetch and push. From here
   on, everything you push goes to your repository, not the starter.

4. **Install and run the app:**

   ```bash
   make install
   make dev
   ```

   Open <http://localhost:5137>, go to **Products**, and click **Add to Cart**. You'll
   see a pop-up and nothing else. That's our starting point. Stop the app with
   **Ctrl+C**.

5. **Add your repository to the Copilot App:** in the sidebar next to **Sessions**,
   click **+**, choose **Open local folder**, and select the folder you cloned. Use
   **Open local folder**, not a GitHub repository. The sidebar shows it as
   `[parent folder]/[repo folder]`.

---

## Agenda

| Time | Section | What you do |
| --- | --- | --- |
| 0-5 | S1. Welcome and surface map | Check your readiness |
| 5-13 | S2. Plan the cart in the Copilot App | Start a session and get a plan |
| 13-33 | S3. Build the cart | Approve the plan, build, and verify it |
| 33-43 | S4. Test the cart | Generate and run focused tests |
| 43-51 | S5. Review and commit in the Copilot CLI | Review locally, commit, and push |
| 51-61 | S6. Pull request and Copilot code review | Open a PR and act on review findings |
| 61-67 | S7. CI and agentic automation | Read your checks and an agentic workflow |
| 67-82 | S8. Extend the cart on your own | Run the whole loop yourself |
| 82-90 | S9. Wrap-up | Reflect and plan next steps |

---

## S1. Welcome and surface map (~5 min)

**Scenario:** A teammate asks, "Which Copilot should I use for this?" Before we
build, we'll map each Copilot surface to a step in today's work.

**Background:** Copilot is one agent experience across several surfaces. Pick the
one that fits where you're working.

| Surface | What it is | Where we use it today |
| --- | --- | --- |
| **Copilot App** (desktop) | Runs agent sessions on your repositories, each on its own branch or worktree. Plan, build, review changes, open PRs, and follow CI in one place. | S2, S3, S4, S6 |
| **Copilot CLI** | The same agent in your terminal: interactive (`copilot`) or one-shot (`copilot -p "..."`). | S5 |
| **VS Code** | Inline suggestions, Chat, and agent sessions beside your editor. | Your option in S8 |
| **GitHub.com** | Copilot code review on pull requests, Actions, and agentic workflows. | S6, S7 |

**Watch out for:**

- **Surfaces only share uncommitted work when they open the same folder.** The CLI
  sees your App session's changes only if you start it in the same worktree.
- **What you see depends on policy.** Some models or features may be turned off for
  your organization. If something is missing, use what's available; don't
  troubleshoot it live.
- **Copilot doesn't replace review.** Every step ends with you checking the result.

#### 🧑‍💻 Hands-on

> Confirm you're ready:
>
> 1. `git remote -v` shows **your** repository.
> 2. The app ran at <http://localhost:5137>.
> 3. Your repository appears in the Copilot App sidebar.
> 4. `copilot --version` works in a terminal.
>
> If any of these fail, follow along on screen for now.

---

## S2. Plan the cart in the Copilot App (~8 min)

**Scenario:** We've been asked to build the cart from the design. Before writing code,
we want Copilot to look at the real code and the design and propose a plan, without
changing files yet.

**Background:**

**Chats vs sessions.** A **chat** isn't connected to a repository: it works from what
you type and any files you attach, but it won't explore your codebase or change
files. A **session** starts from a repository you've added. Its agent explores the
code on its own, changes files, and runs commands, and the side panel shows its plan,
to-do list, and changes. Use a session whenever the work depends on your code.

**Where the session runs.**

- **Environment:** *This computer* (local) or *Cloud*. We use *This computer* so you
  can run the app on `localhost`.
- **Workspace:** *New worktree* gives the session an isolated copy of your repository
  on its own branch. Its changes stay there until you open a PR. *Current checkout*
  works directly in your main folder.

**Modes.**

| Mode | What happens | Use it when |
| --- | --- | --- |
| **Plan** | Writes a plan; nothing changes until you approve | You want to agree on scope first (S2-S3) |
| **Interactive** | Makes changes step by step and checks in with you | You want close control (S4) |
| **Autopilot** | Works on its own: writes code, runs tests, iterates | The task is small and well defined |

Mode is separate from **tool permissions** (*Ask every time*, *Assisted*, or
*Approve all*), which decide whether the agent asks before running tools.

**Copilot Fusion.** Fusion is a router, not a model: for each prompt it picks models
and a pattern (one model; a draft checked by a judge; or several models critiquing a
draft). You choose the **effort**: *Standard* for everyday work, *High* for
multi-file work like today's plan, *Max* sparingly. Higher effort is slower and uses
more AI credits. If you see **Auto** instead of Fusion, your organization uses Auto
model selection; pick what's available.

#### 🧑‍💻 Hands-on

> 1. In the App sidebar, hover over your repository and click **+** (**New
>    session**). Choose **This computer**, **New worktree**, **Plan** mode, and
>    Copilot Fusion at **High** effort. If the mode shows **Interactive**, switch
>    it to **Plan**.
>
> 2. Send:
>
>    ```text
>    I need to build a shopping cart for this app. Use the design in docs/design/cart.png as a reference.
>
>    Requirements:
>    -Add to Cart on the products page adds the selected quantity to the cart instead of showing a pop-up
>    -A cart icon in the navigation bar shows the total number of units and links to the cart page
>    -The cart page lists items with quantity, unit price, and line total
>    -I can change quantities (applied immediately, no Update Cart button) and remove items
>    -Use each product's discounted price when it has one
>    -Show only a subtotal and grand total; no discount, shipping, or coupon rows
>
>    Out of scope:
>    -Checkout (hide the checkout button) and payment
>    -Saving the cart between page refreshes
>    -An empty-cart message
>
>    Constraints:
>    -Don't write or change any tests
>    -Keep the Product type where it is; no lazy loading
>    -Run builds with "cd frontend && npm run build"
>    -Don't commit
>
>    Explore the existing code, ask me any clarifying questions, then propose a plan with numbered acceptance criteria and the files you'll change. Don't change any files yet.
>    ```
>
> 3. While it plans, notice it reading `Products.tsx`, `Navigation.tsx`, and the
>    router, and opening `docs/design/cart.png`. Below the response, see which model
>    Copilot Fusion chose. Hover over **ⓘ** to see the AI credits used.
>
> 4. **Don't approve the plan yet**; that's S3.

**What to notice:** the session found the real starting point (the Add to Cart pop-up)
on its own, because it's connected to your code.

**Learn more:** [Agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions),
[Copilot Fusion](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/models/copilot-fusion),
[Auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection).

---

## S3. Build the cart (~20 min)

**Scenario:** Copilot has a plan and probably some questions. We'll answer them,
check the plan, approve it, and let Copilot build the cart. Then we verify it
ourselves in the browser.

**Background:** What Copilot builds depends on how clearly you define "done." Check
the plan before approving: the files it will touch, what it leaves alone, and its
acceptance criteria. Good criteria are checkable, for example "the cart icon shows
the total quantity" rather than "the cart works." After it builds, the agent saying
"done" is a claim; seeing it work in the browser is evidence. When something's
wrong, describe the **symptom** ("the count doesn't change when I add an item")
rather than guessing the fix.

#### 🧑‍💻 Hands-on

> 1. **Answer Copilot's clarifying questions.** If you're unsure, pick the
>    **(Recommended)** option.
>
> 2. **Check the plan.** Make sure it lists numbered acceptance criteria and the files
>    it will change, and stays inside the requirements. Ask for changes if needed.
>
> 3. **Approve the plan when asked** and let the session build. Watch the to-do
>    list and changes in the side panel.
>
> 4. **Run the app from the session's worktree:**
>    - If `make dev` is still running from setup, stop it (**Ctrl+C**) so the
>      ports are free.
>    - Ask the session:
>
>      ```text
>      Start the app with make dev.
>      ```
>
>    - Open <http://localhost:5137> in the App's **Browser** tab and check each
>      acceptance criterion. Review the code in the **Changes** tab.
>
> 5. **If something's off,** tell the session what you saw, for example:
>
>    ```text
>    When I click Add to Cart with quantity 3, the cart icon still shows 0. Please fix it.
>    ```
>
> **Done when:**
> - Add to Cart adds the selected quantity with no pop-up, and the cart icon shows
>   the total units
> - The cart icon opens the cart page, which lists each item with unit price
>   (discounted where applicable), quantity, and line total
> - Changing a quantity or removing an item updates the totals and the icon
> - The order summary shows only a subtotal and grand total

If your build gets stuck, describe the symptom to the session. If it's still stuck,
follow along on screen through S4.

**What to notice:** the plan was a contract you checked before any code changed, and
you confirmed the result yourself.

---

## S4. Test the cart (~10 min)

**Scenario:** The cart works when we click through it. Now we want proof that keeps
working after the next change.

**Background:** Tests turn acceptance criteria into evidence that runs every time.
Ask for a few **focused** tests, one per criterion, rather than a large suite, and
spell out what each should check. Copilot can run the tests and fix failures in a
loop, but you still decide whether a failure means the code or the test is wrong,
and you run the final check yourself. The starter already includes a frontend test
setup (Vitest and React Testing Library) and a sample test,
`frontend/src/components/Navigation.test.tsx`.

#### 🧑‍💻 Hands-on

> 1. In the **same session**, switch the mode to **Interactive**.
>
> 2. Ask for focused tests (draft, to be rehearsed):
>
>    ```text
>    Write focused frontend tests for the cart, one per acceptance criterion from the plan. Follow the style of frontend/src/components/Navigation.test.tsx. At minimum, cover:
>    -adding a product updates the cart count
>    -adding the same product again increases its quantity
>    -changing a quantity updates the totals
>    -removing an item removes it from the cart
>    Run them with npm test in the frontend folder and fix any failures. Show me the final output.
>    ```
>
> 3. **Run the tests yourself.** Open the **Terminal** tab in the session's side
>    panel. It opens in the session's worktree. Then run:
>
>    ```bash
>    cd frontend
>    npm test
>    ```
>
> 4. **Check that the tests can fail.** Read Copilot's reply. Did it break the code
>    on purpose to check that a test fails? If not, send:
>
>    ```text
>    Check that the tests catch a real bug:
>    -Temporarily make the cart ignore product discounts
>    -Run npm test in the frontend folder and show me which tests fail
>    -Then undo the change and run the tests again
>    ```
>
> **Done when** you've seen the tests pass, and seen at least one fail when the code
> was broken.

**What to notice:** each test maps to an acceptance criterion, and the passing result
is one you saw, not just one you were told about.

---

## S5. Review and commit in the Copilot CLI (~8 min)

**Scenario:** You'd rather review and commit from the terminal. We'll open the same
worktree in the CLI, review the change, write a commit message, and push the branch.

**Background:** The CLI is the same Copilot agent in your terminal. It only sees the
changes in the folder you start it in, so start it in the **same worktree** as your
App session. `/diff` shows what changed and `/review` asks Copilot for a local review
before anything leaves your machine. The starter includes a **code-review skill**
(`.github/skills/code-review/SKILL.md`) that tells Copilot what to check in this
repository. Copilot can also work one-shot: `copilot -p` runs a single prompt and returns the result.

#### 🧑‍💻 Hands-on

> 1. Open the worktree in a terminal and start the CLI:
>
>    ```bash
>    cd [session worktree path]
>    git status --short --branch
>    copilot
>    ```
>
> 2. Inside the CLI, look at the change and review it:
>
>    ```text
>    /diff
>    /review
>    ```
>
> 3. Ask for a review in your own words, without naming the skill:
>
>    ```text
>    review my code before I commit and report back
>    ```
>
>    Watch for Copilot loading the **code-review** skill on its own, because the
>    request is about reviewing code. Compare its findings with `/review`.
>
> 4. Still in the CLI, type `!` to run shell commands, then stage the changes and have
>    Copilot write the commit message:
>
>    ```bash
>    git add -A
>    copilot -p "Write a conventional commit message for my staged changes. Return only the message, with no code fences or explanation."
>    ```
>
> 5. Commit and push. Type this at the **CLI prompt**:
>
>    ```text
>    Commit using that message and push this branch to origin
>    ```
>
>    Check the command in the approval prompt, then choose **Yes**. Don't choose
>    "don't ask again".
>
> **Done when** your branch appears in your repository on GitHub.

**What to notice:** the CLI saw the App's changes because it opened the same
worktree. Review, commit message, and push all stayed in one CLI session, and Copilot
asked before it committed and pushed. This local review happens before anyone else
sees the code.

**Learn more:** [Copilot CLI](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-cli).

---

## S6. Pull request and Copilot code review (~10 min)

**Scenario:** The cart is built, tested, reviewed locally, and pushed. Now it needs a
pull request and a review before it's merged.

**Background:** A good pull request says **what** changed, **why**, and **how it was
tested**. Copilot code review gives a fast first pass and can suggest fixes, but it
doesn't decide. For each finding, you accept it, reject it, or follow up, and say
why. CI runs alongside as separate evidence; green checks alone aren't approval.

#### 🧑‍💻 Hands-on

> 1. At the top of the App session, click **Create PR**. Let Copilot draft the
>    description, and check it covers what changed, why, and how it was tested
>    (include your test result).
>
> 2. Open the pull request in the App (**Pull requests** in the left sidebar) or on
>    GitHub. Look at **Overview** and **Files**.
>
> 3. In the pull request, click **Reviewers** and choose **Copilot**. It runs at
>    **Balanced** effort by default. Wait for its review to appear.
>
> 4. Each finding shows a severity: **High**, **Medium**, or **Low**. For each one,
>    read the reason and decide:
>    -to apply it, click **Commit suggestion**;
>    -to skip it, reply with a one-line reason, then click **Resolve conversation**.
>
>    Commit at least one suggestion.
>
> **Done when** every finding has a decision. Don't merge yet; S7 looks at the checks
> first.

**What to notice:** Copilot code review used the same **code-review skill** as your
local review, and you still made the final call on every finding.

**Learn more:** [Copilot code review](https://docs.github.com/copilot/concepts/code-review).

---

## S7. CI and agentic automation (~6 min)

**Scenario:** Your pull request ran checks. And when a build fails at 2 a.m., should
a fixed script handle it, or an agent that can reason about the failure?

**Background:** Ordinary CI runs **fixed steps** every time (install, lint, build,
test). That's right for predictable jobs. **Agentic automation** uses a Copilot agent
for jobs that need judgment, such as analyzing a failure or triaging issues. There
are two places it can run:

| | Copilot App automation | Agentic workflow (GitHub Actions) |
| --- | --- | --- |
| Where it runs | On a schedule from the Copilot App | In GitHub Actions, on repository events |
| Defined in | The App's Automations view | A Markdown file in `.github/workflows/` |
| Good for | Personal or team routines (daily summaries, checking PRs) | Repository-level jobs everyone shares (failure analysis, triage) |

Before an agent runs on its own, check four things:

1. **Trigger:** what starts it.
2. **Permissions:** what it can read and write.
3. **Outputs:** what it's allowed to create, such as an issue or comment.
4. **Human oversight:** who reviews what it produces.

#### 🧑‍💻 Hands-on

> 1. On your pull request, open **Checks** and find the **🧪 CI - Build, Test and
>    Lint** run. Its jobs are fixed steps from `.github/workflows/ci.yml`.
>
> 2. Open `.github/workflows/auto-analyze-failures.md` (read it; don't run it). It
>    isn't called from `ci.yml`. Instead, its **trigger** (`on: workflow_run`) watches
>    the CI workflow and runs only when CI **fails**. Your CI passed, so it didn't run.
>    Also find its **permissions** (read-only) and its **outputs** (`safe-outputs`:
>    create an issue, assign it to Copilot, or do nothing).
>
> 3. **Optional, after the session:** in the Copilot App, create an automation for
>    your repository (for example, a daily summary of open PRs). App automations need
>    a private or internal repository, which yours is.

**What to notice:** the agentic workflow's guardrails are written down and reviewable,
and its outputs are real actions, not just logs.

**Learn more:** [GitHub Agentic Workflows](https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/).

---

## S8. Extend the cart on your own (~15 min)

**Scenario:** A follow-up request comes in: when the cart is empty, show a friendly
message and a **Continue shopping** button that takes the shopper back to the
products page.

**Background:** You'll run the same loop on your own: plan, build, test, review. Use
whichever surface you prefer (App, CLI, or VS Code), and stay in it for the whole
exercise.

#### 🧑‍💻 Hands-on

> 1. Start from your cart branch: continue in your S3 session, or start a new session
>    on that branch.
>
> 2. In **Plan** mode, plan the change (draft, to be rehearsed):
>
>    ```text
>    Plan this change: when the cart has no items, the cart page shows an empty-cart message and a "Continue shopping" button that goes to the products page. The cart icon count stays correct. List numbered acceptance criteria and the files you'll change. Don't change files until I approve.
>    ```
>
> 3. Review and approve the plan, then let Copilot build it.
>
> 4. Ask for focused tests, one per acceptance criterion, and run them yourself.
>
> 5. Review the diff (`/diff` and `/review` in the CLI, or the Changes view in the
>    App or VS Code), then commit and push.
>
> **Done when** an empty cart shows the message, **Continue shopping** goes to the
> products page, the cart icon count is correct, and you've seen the tests pass.
>
> **Finished early?** Add the change to your pull request and request another Copilot
> code review.

---

## S9. Wrap-up (~8 min)

### Putting it together

Today you took a real feature through **plan -> build -> test -> review -> PR -> CI**,
then ran the loop again on your own. Copilot helped at every step. The results came
from clear requirements, a plan you checked, tests you ran yourself, and review
decisions you made.

### Reflect

- Which step would save you the most time on your current work?
- Where would Plan mode have caught a misunderstanding earlier on a recent task?
- What would you want a person to check before trusting an agentic workflow?

### Key takeaways

| Topic | Takeaway |
| --- | --- |
| Surfaces | Same agent, different places; pick the one that fits where you're working. |
| Chats vs sessions | Use a session when the work depends on your code. |
| Modes and effort | Plan first; match effort to the task. |
| Building | Clear acceptance criteria drive a good result; verify it yourself. |
| Testing | An agent's "tests pass" is a claim; output you've seen is evidence. |
| CLI | Same agent in the terminal; same worktree, same changes. |
| Code review | Copilot gives the first pass; you own the decision. |
| Agentic automation | Check trigger, permissions, outputs, and oversight before it runs. |

### Next steps

- **This week:** use Plan mode for one real task before writing any code.
- **This month:** add Copilot code review to your team's PR routine.
- **Later:** find one CI job that needs judgment and check whether an agentic
  workflow fits.

### Resources

- [GitHub Copilot docs](https://docs.github.com/en/copilot)
- The original Copilot Academy labs are listed in the source map at the end of this
  guide. Explore them at your own pace.

---

## Facilitator preparation and dry-run record - not participant instructions

### Repositories

- **Sandbox (dry-run):** <https://github.com/rko26-tt-shiny-dollop/test-repo-rogers>.
  It starts from a single-commit snapshot of
  [copilot-academy/octocat_supply@`0ac787d`](https://github.com/copilot-academy/octocat_supply/commit/0ac787d24a029e49ec97c3ca0441eec0ec85a00d)
  (full upstream tree, without upstream history), followed by this guide and the
  starter preparation commits.
- **Participant starter:** `rogers-workshop-starter` [to be created]. It will be a
  **single-commit** snapshot of the sandbox's baseline (not the finished cart), so
  participants can push it to their own repositories. Upstream history contains a
  commit with demo credentials that GitHub push protection can block; a single-commit
  starter avoids that, as in the ATT workshop's setup.
- **Starter preparation** (made in the sandbox; carry into the starter):
  - Added a frontend `npm test` script with Vitest config, test setup, and a sample
    `Navigation.test.tsx`.
  - Added `.github/skills/code-review/SKILL.md` (custom; upstream has no code-review
    skill).
  - Removed `.github/dependabot.yml` and the `build-and-publish`,
    `copilot-setup-steps`, and `test-auto-analysis` workflows, which failed or
    created noise on every push.
  - `ci.yml` runs frontend lint and build but not the frontend tests. Adding a test
    step is pending approval.
- **Licensing:** there is no standalone LICENSE/NOTICE file; `api/package.json`
  declares MIT. Confirm redistribution expectations before sharing the starter.

### Pre-session steps

- [ ] Create `rogers-workshop-starter` as a single commit from the rehearsed baseline
      and fill in the starter URL in *Set up your own repository*.
- [ ] Confirm participants can create private repositories and push the starter to
      them.
- [ ] Rehearse S2-S3 end to end in the sandbox and confirm the build fits in 20
      minutes. There is no prepared fallback cart; if a build stalls, participants
      describe the symptom to the session or follow along on screen.
- [ ] Confirm the S4 test command and timing.
- [ ] Fill in all [bracketed] items: starter URL, worktree path location, Create PR
      label, and code review effort setting.
- [ ] Confirm App, Fusion, CLI, and Copilot code review availability under Rogers'
      policies, and practice the fallbacks below.

### Section notes and fallbacks

- **Setup:** a local clone added with **Open local folder** is required: S3-S4 run
  the app on `localhost`, S5 opens the same worktree in the CLI, and S6 pushes a
  branch.
- **S2:** if Fusion isn't shown, use the available model picker. If High is missing,
  use Standard. If the App is unavailable, plan in the CLI (Shift+Tab for plan mode).
- **S3:** this is the longest live step. The likely problems are port conflicts
  (`make dev` already running) and running commands in the wrong folder; mention
  both on screen before the build starts.
- **S4:** if frontend tests prove too slow in rehearsal, decide then whether to
  narrow the test list or switch approach.
- **S5:** confirm `/diff`, `/review`, and `copilot -p` piping behave as written.
- **S6:** don't merge or use Agent Merge.
- **S7:** read-only. Don't run, compile, or dispatch agentic workflows. The
  failure-analysis workflow expects a `COPILOT_GITHUB_TOKEN` secret and can create
  issues; don't provision it during the session. Its trigger list still names the
  removed "Copilot Setup Steps" workflow, which is harmless.
- **S8:** participants work on their own cart branch, so results will vary; that's
  expected.

### Rehearsal record

Record only what was observed.

| Section | Observed | Measured time vs budget | Notes |
| --- | --- | --- | --- |
| Setup | [Not observed] | [Not measured] / ~10 min | |
| S1 | [Not observed] | [Not measured] / 5 min | |
| S2 | Earlier scoping run (2026-11-22, previous guide's prompt): Copilot proposed shared cart state, a navigation count, and a cart view with edit/remove, and asked about persistence, guest vs signed-in carts, re-adding the same product, and discounted totals. It noted there was no cart route yet. This informed the S2 prompt and S3 answers. The current prompt is not yet rehearsed. | [Not measured] / 8 min | |
| S3 | [Not observed] | [Not measured] / 20 min | |
| S4 | [Not observed] | [Not measured] / 10 min | |
| S5 | [Not observed] | [Not measured] / 8 min | |
| S6 | [Not observed] | [Not measured] / 10 min | |
| S7 | [Not observed] | [Not measured] / 6 min | |
| S8 | [Not observed] | [Not measured] / 15 min | |
| S9 | [Not observed] | [Not measured] / 8 min | |

---

## Source and adaptation map

These are selected techniques from Copilot Academy, adapted to one cart through-line.
Follow this guide during Session 1; use the originals for deeper exploration.

| Source | Used in | What we use | What we leave out |
| --- | --- | --- | --- |
| [Getting work done with Copilot App](https://copilot-academy.github.io/labs/getting-work-done-with-copilot-app) | Setup, S1, S2, S7 | Adding a local folder; surfaces; chats vs sessions; modes; Fusion effort; App automations (optional) | The Pulse Analytics scenario, its artifacts, and canvases |
| [Copilot CLI: Zero to Hero](https://copilot-academy.github.io/labs/copilot-cli-zero-to-hero) | S5 | `/diff`, `/review`, one-shot `copilot -p` with piped input, committing from the terminal | The Task Manager API build, installs and plugins, and `/delegate` |
| [Feature development](https://copilot-academy.github.io/workshops/immersive-experience/feature_development) | S2, S3, S8 | Planning from `docs/design/cart.png`, answering clarifying questions, building and verifying the cart | Opening the PR straight after the build (we do it in S6, after tests and local review) |
| [Test coverage](https://copilot-academy.github.io/workshops/immersive-experience/test_coverage) | S4, S8 | Focused test generation with explicit criteria, self-healing test runs, verifying yourself | The API coverage target (80%); we test the frontend cart instead |
| [Code review](https://copilot-academy.github.io/workshops/immersive-experience/code_review) | S6 | PR overview and files changed, Copilot code review, deciding on each finding, applying a fix | Agent Merge and auto-merge |
| [Agentic workflows](https://copilot-academy.github.io/workshops/immersive-experience/agentic_workflows) | S7 | Choosing App automation vs agentic workflow; reading a workflow's trigger, permissions, and outputs | Creating, compiling, or running workflows live |
