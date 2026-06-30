# AGENTS.md — Loom

> Context file for AI coding agents (Cursor, Claude Code, Codex, OpenCode,
> Copilot, etc.). This project uses **agent-skills**
> (https://github.com/addyosmani/agent-skills) installed globally. This file
> provides project-specific context only — it does not duplicate skill content.

---

## Project

Loom is an open-source educational web app for visualizing concurrent thread
execution. Users assemble visual blocks (Variable, Operation, Condition, Loop)
into parallel lanes — each lane is a thread. On execution, colored indicators
show which thread is at which instruction in real time, and a timeline panel
shows the full execution history. Pre-built scenarios cover key concurrency
concepts (parallel execution, race condition, deadlock).

**Current phase:** Phase 0 — Fondations techniques
**Primary language:** French (UI and user-facing content)
**Users:** Junior developers and CS students discovering concurrency for the first time

---

## Operators

Single operator. At session start, greet them by their `git config user.name` —
a light recognition signal, nothing more.

- **Théo** — builder, learning vibe coding. Wants simple, direct responses and
  fast execution — skip long preambles, go straight to the point. Explain technical
  concepts simply when needed (non-expert in AI-assisted development workflows).

---

## Foundation files

Read these for project context (in this order):

1. **VISION.md** — Strategic vision AND **decision filter** — read before
   any `/spec` or architecture decision. Every new feature should align with
   the vision; if alignment isn't clear, stop and clarify before specifying.
   Adapts to project maturity — some sections may be placeholders.
2. **STARTUP.md** — **Temporary bootstrap document.** Contains the plan
   from Phase 0 to MVP. Will be deleted once MVP is reached.
3. **docs/project.md** — Tech Stack, architecture, deployment workflow,
   constraints. **Source of truth for technical matters.**
4. **README.md** — Current state, local setup, deployment workflow summary.
5. **IDEAS.md** — Parking lot of future ideas (consult only when relevant).

---

## Project structure

```
loom/
├── README.md                   Current state, setup
├── VISION.md                   Strategic vision (adaptive depth)
├── STARTUP.md                  Bootstrap plan (TEMPORARY — delete after MVP)
├── IDEAS.md                    Parking lot for future ideas (English)
├── AGENTS.md                   This file
├── CLAUDE.md                   One-liner: @AGENTS.md (Claude Code compatibility)
├── docs/
│   ├── project.md              Stack + architecture + deployment (source of truth)
│   ├── adr/                    Architecture Decision Records (filled over time)
│   └── features/               Feature-level docs (filled when needed)
├── design/                     Visual assets (empty at start)
├── src/
│   ├── components/
│   │   ├── blocks/             Block type components
│   │   ├── lanes/              Thread lane components
│   │   ├── palette/            Block palette (left panel)
│   │   ├── visualization/      Inline dots + timeline (right panel)
│   │   └── ui/                 Shared UI primitives
│   ├── engine/                 Tick-based execution engine
│   ├── scenarios/              Pre-built scenarios
│   ├── hooks/                  Custom React hooks
│   └── types/                  Shared TypeScript types
└── tests/
```

---

## Project-specific conventions

### Source of truth for Tech Stack and Project Structure

- **`docs/project.md` is authoritative.**
- When running `/spec` or any skill that requires Tech Stack / Project
  Structure information, **reference `docs/project.md` instead of
  duplicating** the content into SPEC.md.
- Example in SPEC.md: `## Tech Stack` → `See [docs/project.md](./docs/project.md#tech-stack).`

### Deployment workflow (immutable)

Default workflow:

- Short-lived branches (`feature/*`, `fix/*`, `docs/*`, `chore/*`,
  `refactor/*`) require PR into `main` before merging
- Merge to `main` → auto-deploy to GitHub Pages via GitHub Actions
- No environment variables required (fully static app)
- Never commit `.env` files

Full details in `docs/project.md#deployment-workflow`.

### Git & PR workflow

This repo uses agent-skills for workflow routing. For Git shipping, apply
`/ship` or `git-workflow-and-versioning` with these local conventions.

**Default collaboration model:** short-lived task branches and PRs into `main`.

Use branch names aligned with agent-skills:

- `feature/<short-topic>` for new user-facing features or project phases
- `fix/<short-topic>` for bug fixes
- `docs/<short-topic>` for documentation-only changes
- `chore/<short-topic>` for maintenance/config changes
- `refactor/<short-topic>` for behavior-preserving code simplification

Do not commit or push directly to `main` unless the user explicitly asks.

Before editing files:

- if on `main`, create the appropriate short-lived branch;
- if already on a task branch, keep using it;
- if there are unrelated local changes, stop and ask;
- do not create a branch for pure discussion, planning, preview, or read-only
  inspection.

When the user says `ship en PR` or `crée une PR`:

1. Review `git status` and the diff.
2. Stage only intended files.
3. Commit with a concise message.
4. Push the branch.
5. Open a draft PR to `main`.
6. Report the PR link and checks run.
7. Do not merge.

When the user says `merge la PR` or `relis et merge`:

1. Review the PR diff.
2. Check mergeability, conflicts, and GitHub checks if available.
3. Merge only if there is no blocker.
4. Fetch and update `main`.
5. Report the local branch state.

After merge, return to `main` and update it before starting a new task.

### Execution engine — key constraint

The engine simulates concurrency in a **deterministic, tick-based** manner.
Do NOT use real Web Workers or async parallelism in the MVP. The simulation
must be pausable, steppable, and observable. This is a deliberate pedagogical
choice — see `docs/adr/` for the rationale once documented.

### STARTUP.md lifecycle (important)

- STARTUP.md is **temporary** — it guides the bootstrap from Phase 0 to MVP
- Once MVP is reached, **STARTUP.md should be deleted**
- Do NOT extend STARTUP.md with post-MVP phases
- Post-MVP work goes through `/spec` directly on individual features
- Ideas for future work go into IDEAS.md

### Documentation conventions

- **Architecture Decision Records** live in `docs/adr/` — use the
  `documentation-and-adrs` skill when making a significant technical decision
- **Feature-level documentation** lives in `docs/features/<feature-name>/README.md`
  when a feature grows complex enough to need its own docs
- Both directories exist at setup (empty) — agents fill them as needed

### Design and visual references

- **`design/` folder** at project root — single home for visual assets.
  Empty at project start. If visual references are added later, consult them
  before implementing the corresponding screens.
- No `design/DESIGN.md` at project start — add one if a design system is
  defined later (getdesign.md convention).

---

## Task routing — suggesting the right entry point

This project expects agent-skills to be used for all development work.
The skills handle their own processes — this file does not duplicate them.

The `using-agent-skills` meta-skill defines the official routing flowchart
and 6 core operating behaviors (Surface Assumptions, Manage Confusion Actively,
Push Back When Warranted, Enforce Simplicity, Maintain Scope Discipline,
Verify, Don't Assume). **These behaviors apply to ALL tasks, regardless of
which entry point is chosen.** The section below is a lightweight guide for
suggesting entry points — it does not replace `using-agent-skills`.

**→ For any non-trivial development task, start from `using-agent-skills`,
then apply the project-specific conventions below. If routing is still unclear,
`using-agent-skills` remains the source of truth.**

### How to route

When the user formulates a development request, suggest the appropriate entry
point in 2 lines max, announce it as an assumption the user can override, then
proceed. The user overrides with one word — no blocking for confirmation.

**Routing table:**

| User's intent signal                                                   | Suggested entry point                                                               |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| User doesn't yet know what they want, intent unclear                   | `interview-me`                                                                      |
| Vague idea, needs refinement before anything                           | `idea-refine`                                                                       |
| Typo, single-line fix, unambiguous self-contained change               | `/build` (skipping `/spec` + `/plan`)                                               |
| Modify existing behavior, targeted improvement, clear scope            | `/build` (skipping `/spec` + `/plan`)                                               |
| New screen, new data model, new integration, ambiguous requirements    | `/spec` (full pipeline)                                                             |
| Structural refactor (extract module, change architecture)              | `/spec`                                                                             |
| Cleanup refactor (same code, cleaner)                                  | `/code-simplify`                                                                    |
| Bug, error, unexpected behavior                                        | `debugging-and-error-recovery`                                                      |
| Browser-based behavior to verify (UI flows, console, network)          | `browser-testing-with-devtools`                                                     |
| Code review, verification pass                                         | `/review` — use `code-simplification` if unnecessary complexity is the main finding |
| Security review (input handling, auth, data storage)                   | `security-and-hardening`                                                            |
| Performance issue (latency, memory, throughput)                        | `performance-optimization`                                                          |
| Document a decision, write an ADR                                      | `documentation-and-adrs`                                                            |
| Removing/replacing a public API, breaking change with downstream users | `deprecation-and-migration`                                                         |
| Pre-ship web quality audit (perf, best practices)                      | `web-quality-audit`                                                                 |
| Deploy, ship to production                                             | `/ship`                                                                             |

**Context-specific skills activate automatically.** `context-engineering`
activates when starting a session, switching tasks, or when output quality
drops — it ensures the agent has the right information loaded at the right
time. **UI-specific work** (frontend components, styling) activates
`frontend-ui-engineering` automatically during `/build`. **API-specific work**
(endpoints, contracts, boundaries) activates `api-and-interface-design`.
**Unfamiliar library or API** activates `source-driven-development` so the agent
verifies syntax against actual docs rather than guessing. **High-stakes or
unfamiliar-code changes** activate `doubt-driven-development` — an adversarial
fresh-context review of every non-trivial decision in-flight. These are not
standalone entry points — they augment `/build` contextually.

**Web quality skills augment work on web projects.** `performance` activates
when work touches loading speed, runtime efficiency, or resource optimization.
`best-practices` activates when work touches security headers, modern web APIs,
or HTTP-exposed surfaces. Like `frontend-ui-engineering`, these are background
skills that augment `/build` contextually rather than serving as entry points.
The user-triggered `web-quality-audit` (see routing table above) remains the
explicit pre-ship audit across all these dimensions.

**For UI work specifically:** always consult the visual assets in `design/`
(if present) before generating any UI.

**Git and CI work activate dedicated skills.** `git-workflow-and-versioning`
covers commits, branches, conflicts, and parallel streams.
`ci-cd-and-automation` activates when touching build/test/deploy pipelines.
Both are background skills — invoke them implicitly through the work, not as
standalone entry points.

**Suggestion format** (to the user, in their language):

> "Je pars sur `[entry-point]` — [reason in 1 line]. Dis-moi si tu préfères
> autre chose."

Then proceed. Do not block for explicit confirmation.

### When skipping `/spec` and `/plan` (not skipping everything)

agent-skills explicitly allows skipping `/spec` and `/plan` for changes that
are **"single-line fixes, typo corrections, or changes where requirements are
unambiguous and self-contained"**.

**Before going directly to `/build`, run one quick check:** is this really an
unambiguous change, or is it a bug in disguise? When in doubt, check for an
applicable skill before starting work.

### When `/spec` is required (non-negotiable)

Always suggest `/spec` when the request implies:

- A new data model
- A new screen or module
- Requirements that are ambiguous or not self-contained
- A structural refactor that changes architecture

### Bootstrap vs post-MVP

**While STARTUP.md exists (bootstrap phase):** new work usually means a new
phase from STARTUP.md. `/spec` takes the phase description as input; the agent
reads STARTUP.md + VISION.md + docs/project.md for context.

**Reaching MVP:** when the last phase of STARTUP.md is shipped, **explicitly
remind the user to delete STARTUP.md before continuing**.

**After MVP (STARTUP.md deleted):** new work is feature-scoped. `/spec` takes
a feature description directly, without phase context.

---

## React skills (outside agent-skills)

These come from Vercel and are installed separately — they are NOT part of the
agent-skills pipeline (no `/spec→/ship`). Apply them in the background whenever
you write, review, or refactor React code:

- **`react-best-practices`** — performance: data fetching & waterfalls, bundle
  size, re-render optimization.
- **`composition-patterns`** — component architecture & reusable APIs: compound
  components, render props, context providers, avoiding boolean-prop bloat.

Like `frontend-ui-engineering`, these augment `/build` by context — but they are
React-specific quality guidance from a different source, not agent-skills entry points.

---

## What agents should NOT do

- Never modify `VISION.md` strategic structure (sections 1-5) without explicit
  user confirmation — it reflects validated strategic work.
- Never extend `STARTUP.md` with post-MVP phases — those go into IDEAS.md
  or directly into `/spec` work.
- Never duplicate Tech Stack or Project Structure content into other files —
  always reference `docs/project.md`.
- Never commit secrets or real `.env` files.
- Never create `docs/adr/` or `docs/features/` subfolders proactively
  without actually producing the corresponding documentation.
- Never assume a deployment workflow different from the one documented
  in `docs/project.md` — it is immutable unless an ADR supersedes it.
- Never delete STARTUP.md without explicit user confirmation that the MVP
  has been reached.
- Never make an architectural decision without documenting it in `docs/adr/`
  via the `documentation-and-adrs` skill.
- Never invoke the `accessibility` skill unless VISION.md explicitly states
  an accessibility compliance requirement (WCAG AA/AAA, EAA conformity, or similar).
- Never use real Web Workers or native async parallelism for the execution
  engine — the simulation must remain deterministic and tick-based.
- Never put operator names in product/technical docs (VISION.md, IDEAS.md,
  docs/project.md). Operator names live in the AGENTS.md "Operators" block only.
