# Session 2: Building with Advanced GitHub Copilot Capabilities

> Go deeper with custom agents, skills, plugins, hooks, and hands-on agentic workflows.

2 hours, virtual, hands-on. The GitHub Copilot App is the main surface; the CLI is
used where it's strongest.

**Through-line:** In Session 1 you used Copilot as it comes. In this session you teach
it how your team works: package conventions as a **skill**, give work to specialized
**custom agents**, enforce policy with **hooks**, bundle all three as a **plugin**, and
hand recurring work to **agentic workflows**.

You start by finishing the cart you built in Session 1.

## Agenda

| Section | Topic | Surface |
|---|---|---|
| Setup | Your own repository (reuse your Session 1 repository if you have it) | Terminal, App |
| S1 | Finish the Session 1 cart: code review, agentic workflows, browser test | App, GitHub.com, CLI |
| S2 | The customization map | App (Customize) |
| S3 | Skills | App |
| S4 | Custom agents | App |
| S5 | Hooks | App, terminal |
| S6 | Plugins | CLI, App |
| S7 | Wrap-up | |

---

## Set up your own repository

If you attended Session 1, open the same repository in the App and skip to S1.
Otherwise, follow *Set up your own repository* in Session 1:
<https://github.com/rko26-tt-shiny-dollop/rogers-workshop-starter/blob/main/SESSION-1.md>

---

## S1. Finish the Session 1 cart

If you attended Session 1, use your cart session from that day. If you don't have a
cart, follow along on screen for this section; you'll be hands-on from S2.

### Part 1: Pull request and Copilot code review

Follow **S6** of the Session 1 guide:
<https://github.com/rko26-tt-shiny-dollop/rogers-workshop-starter/blob/main/SESSION-1.md>

### Part 2: Agentic workflows

Source: Immersive Experience Use Case 12; Session 1 **S7**.

#### Scenario

Deterministic CI tells you something broke. An agentic workflow can work out why and
propose a fix.

#### Try it

> 1. Open `.github/workflows/auto-analyze-failures.md` and its `.lock.yml`. Find what
>    starts it, what decides whether it acts, and what it's allowed to create.

#### 🎬 Demo only: from a red build to a fix PR

The presenter breaks a test on a branch, pushes, and follows the chain: CI fails, the
agentic workflow opens an issue, and Copilot opens a draft fix PR.

#### What to notice

- CI caught the bug, the agentic workflow diagnosed it, and Copilot wrote the fix, but
  it stopped at a draft PR because merging is still a person's call.

### Part 3: Test the cart in a real browser from the CLI

Follow **S8** of the Session 1 guide.

---

## S2. The customization map

### Scenario

Your team keeps typing the same guidance into prompts. Copilot has several places to
put that guidance once. Before building any, see where each one lives and when it loads.

### Background

| Customization | Lives in | Loads | Good for |
|---|---|---|---|
| Custom instructions | `.github/copilot-instructions.md`, `.github/instructions/` | Always, or by file path | Standards that apply everywhere |
| Skills | `.github/skills/<name>/SKILL.md` | When the task matches its description | Multi-step workflows with references or scripts |
| Custom agents | `.github/agents/<name>.agent.md` | When you select it | A role with its own tools and rules |
| Hooks | `.github/hooks/hooks.json` | On agent events (start, prompt, stop) | Audit, checkpoints, policy |
| Plugins | Installed bundle with `plugin.json` | After install | Sharing agents, skills, and hooks together |
| MCP servers | `.mcp.json` or App settings | When a tool is needed | Reaching external systems |

### Try it

> 1. In the App, open **Customize** and browse the skills, agents, and plugins available
>    to your repository.
> 2. In your repository, open `.github/skills/`, `.github/agents/`, and `.github/hooks/`.

### What to notice

- Instructions are always on; skills and agents load only when relevant or selected,
  which keeps context small.

---

## S3. Skills

Source: Immersive Experience Use Case 8.

### Scenario

Adding an API entity touches a model, repository, routes, migration, seed data, Swagger
docs, and tests. Copilot doesn't do all of it to your standards every time.

### Try it

> 1. Open `.github/skills/api-endpoint/SKILL.md` and its `references/` folder.
> 2. Start a new session in a worktree, **Interactive** mode, model **Auto**:
>
>    ```text
>    Add a new API endpoint for a new Entity called 'DeliveryVehicle'. Vehicles belong to branches.
>    ```
>
> 3. When it finishes, ask it to run `make test-api`, then open
>    <http://localhost:3000/api-docs> and find the DeliveryVehicle endpoints.

### What to notice

- Only the skill's name and description were in context until the task matched; then
  Copilot loaded the full instructions and references.
- [Observed during rehearsal: which conventions it followed or missed.]

---

## S4. Custom agents

Source: Immersive Experience Use Case 4.

### Scenario

Some work needs a specialist: a role with its own rules, tools, and boundaries.

### Try it

> 1. Open `.github/agents/bdd-specialist.agent.md`. Notice its description, tools, and
>    rules.
> 2. Start a new session, select the **BDD Specialist** agent, and prompt:
>
>    ```text
>    Add BDD tests for the product list page. Run the focused test suite and report the results.
>    ```
>
> 3. [Build your own agent: prompt to be finalized during rehearsal.]

### 🎬 Demo only: a team of agents across the SDLC

The presenter runs a tech-lead agent that delegates to QA, PM, coding, and code-review
agents. QA finds a defect, PM writes a ticket, you pick it, coding implements it, and
code review approves or sends it back.

### What to notice

- Each agent has a narrow job and limited tools. The human still chooses the ticket and
  approves the result.

---

## S5. Hooks

Source: Immersive Experience Use Case 11.

### Scenario

Your team wants an auditable record of what Copilot changed.

### Try it

> 1. Open `.github/hooks/hooks.json`. Find the `sessionStart`, `UserPromptSubmit`, and
>    `Stop` hooks that write to `.agent.log`, then open `.agent.log`.
> 2. Uncomment the `Stop` hook that calls `.github/hooks/checkpoint-commit.sh`. Edit
>    the script so the commit message ends with
>    `Co-authored-by: GitHub Copilot <copilot@github.com>`.
> 3. In a new session, prompt:
>
>    ```text
>    Add two rocket emojis 🚀🚀 to the title in the README.
>    ```
>
> 4. When the session stops, run `git log -1` in the session's **Terminal** tab.

### What to notice

- The hook ran without anyone asking; it's a command, not a prompt.

---

## S6. Plugins

Source: [Creating a plugin for GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating).

### Scenario

Your skill, agent, and hook work in one repository. Other teams want them too.

### Try it

> 1. Ask Copilot to package your S4 agent, the `api-endpoint` skill, and your S5 hook as
>    a plugin in a new `plugins/team-toolkit/` folder with a `plugin.json` manifest.
> 2. Install and check it from the CLI:
>
>    ```bash
>    copilot plugin install ./plugins/team-toolkit
>    ```
>
> 3. [Where to confirm it loaded in the App: to be confirmed during rehearsal.]

### What to notice

- A plugin is how customizations travel between repositories and people.

---

## S7. Wrap-up

### Putting it together

| You did | With |
|---|---|
| Reviewed and tested the cart | Copilot code review, the CLI, Playwright |
| Encoded a workflow | A skill |
| Delegated to a specialist | A custom agent |
| Enforced an audit trail | A hook |
| Shared all three | A plugin |
| Automated failure analysis | An agentic workflow |

### Resources

- [Immersive Experience](https://copilot-academy.github.io/workshops/immersive-experience)
- [Copilot Academy labs](https://copilot-academy.github.io/labs)
- [GitHub Copilot docs](https://docs.github.com/en/copilot)
