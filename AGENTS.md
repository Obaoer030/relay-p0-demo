# Relay project instructions

## Mission

Build the Relay hackathon P0 as a polished, deterministic, mobile-first Web demo that proves one idea: a life matter can move from “I must keep pushing” to “someone trusted has taken the next step,” with the decision boundary still clear.

This repository is demo-first. Do not silently expand it into a production collaboration platform.

## Required reading order

Before planning or changing code, read these files in order:

1. `docs/handoff/relay-p0-context-pack.md`
2. `docs/demo-spec.md`
3. `docs/adr/ADR-001-demo-first-architecture.md`
4. `docs/relay-prd.md`
5. `docs/reviews/2026-08-29-hackathon-requirements-review.md`

Resolve conflicts in that order. The context pack records the latest confirmed conversation decisions but does not override explicit safety boundaries in the ADR.

## User communication

- Begin substantive replies with a short “需求校准” that restates what the user is actually trying to achieve when their wording is ambiguous or evolving.
- When later messages reveal a better earlier question, state the improved question briefly and use it going forward.
- Do not ask for confirmation on routine, reversible, in-scope implementation choices.
- Pause only for destructive or irreversible actions, credentials, paid services, public deployment, a material product-direction conflict, or a blocker that cannot be resolved from repository evidence.
- Treat side questions as side threads. Answer them, then resume the authorized mainline unless they change the contract.

## Confirmed visual direction

Use “01 暖光杂志 / Warm Editorial” as the single primary design language.

- Warm cream surfaces, deep brown text, restrained brick/coral accent.
- Editorial display typography paired with highly readable sans-serif body text.
- Soft, asymmetric card geometry and generous but controlled breathing room.
- Warm, trustworthy, adult, and emotionally safe; never childish, overly pink, ornamental, or stereotypically feminine.
- The responsibility rail is the hero visual mechanism. Its state must remain understandable without color or motion.
- Motion supports the story; it does not decorate every component.

Do not switch to glassmorphism, neon, scrapbook, generic SaaS blue, or a different visual system without an explicit user decision recorded in the context pack.

## P0 technical boundary

- React + TypeScript + Vite.
- One deterministic state source using Context/useReducer or an equally small equivalent.
- `localStorage` persistence and `BroadcastChannel` same-origin tab synchronization.
- Routes include `/demo` and `/r/demo-cat-checkup`.
- No database, authentication, Supabase, runtime AI, remote font dependency, analytics, payments, or production cross-device claims in P0.
- All critical fonts, icons, avatars, and fixtures must work offline in the final demo build.

## Git and recovery

- If the repository is not initialized, create `main`, commit the approved documentation baseline, then create `feat/relay-p0-demo`.
- Stage explicit paths only. Never use `git add .`, `git add -A`, or `git add --all`.
- Never use `git reset --hard`, `git clean -fd`, force-push, or destructive checkout to remove user work.
- A checkpoint commit is allowed only after its relevant validation passes.
- Keep commits small, coherent, and independently understandable.
- Prefer `git revert` for recovery after a committed regression.

## Long-running execution

- Maintain `.agent/relay-p0-execplan.md` as the live task state.
- Each checkpoint records: completed outcome, evidence, changed files, unresolved risk, and next concrete goal.
- Continue while the next action is clear and covered by the approved P0 contract.
- If a run cannot finish, stop at the latest green commit and leave the execution plan accurate enough for a fresh session to resume without conversation history.

## Session boundaries

- The main implementation session owns writes to the active feature branch.
- Start a separate session when the desired outcome is materially distinct, such as a fresh-context requirements decision, a formal code review, or final visual/QA audit.
- Do not create a new session merely because a task is long or moves to the next implementation milestone.
- Never allow two sessions to write concurrently to the same checkout.
- Review sessions are read-only by default. If fixes are authorized, use a separate Git branch/worktree and integrate only verified commits.
- Requirement-change sessions must update the durable context pack or an ADR before implementation resumes.

## Quality gates

Create one `npm run verify` command that covers, at minimum:

- lint;
- TypeScript checking;
- unit tests for state transitions and persistence;
- production build;
- Playwright golden-path E2E.

Visually verify at least 375×812 and 1440×900. Check clipping, horizontal overflow, tap targets, projection readability, reduced-motion behavior, empty/error states used by P0, and semantic clarity of the responsibility transfer.

The final golden path must run successfully ten consecutive times from a deterministic reset.

## Prohibited shortcuts

- Do not disable type checking, tests, accessibility rules, RLS, or security controls to make a check pass.
- Do not replace product behavior with static screenshots.
- Do not hide failures in the demo controller.
- Do not claim real cross-device collaboration when the P0 uses same-origin local simulation.
- Do not begin Stretch Goals before every P0 acceptance criterion is green.

