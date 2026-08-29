# Relay P0 execution plan

> Owner: main implementation session  
> Branch: `feat/relay-p0-demo`  
> Status: in progress  
> Last updated: 2026-08-29

## Outcome contract

Deliver a deterministic, mobile-first React + TypeScript + Vite demo that makes
the bounded responsibility transfer from Lin Ran to Xiaoyu immediately clear.
The only approved visual system is Warm Editorial. The golden path must work
offline, require no typing or network, synchronize same-origin tabs, and pass
the repository's single `npm run verify` quality gate.

## Boundaries

- P0 only: no database, auth, runtime AI, analytics, payments, PWA, production
  cross-device claims, deployment, credentials, or paid services.
- One state source using Context + `useReducer`.
- Persist with `localStorage`; synchronize with `BroadcastChannel` plus the
  `storage` event fallback.
- Required routes: `/`, `/demo`, `/r/demo-cat-checkup`; unknown tokens disclose
  no matter data.
- All critical assets must be local and the formal path must not scroll.
- Stage jumps are legal complete state snapshots, never visual-only changes.

## Acceptance map

| Area | Required evidence |
|---|---|
| State | Unit tests for seed migration, legal transitions, idempotency, reset date recomputation, and persistence |
| Synchronization | E2E proves same-origin update within 500ms |
| Golden path | Initial → prepare → confirm → share → accept → complete → reset without typing/network/scrolling |
| Reliability | Golden path succeeds ten consecutive runs from deterministic reset |
| Responsive | Screenshot QA at 375×812 and 1440×900, no horizontal overflow or clipping |
| Semantics | Responsibility rail uses labels, endpoints, a filled point, and persistent text; boundary remains prominent |
| Accessibility | Keyboard focus, ≥44px targets, 16px body text, reduced-motion meaning, useful labels, 200% resilient layout |
| Offline | Production build serves and completes the golden path without external requests |

## Milestones

### M0 — Baseline and recovery

- [x] Read `AGENTS.md` and all required product documents in mandated order.
- [x] Initialize `main` and commit the approved documentation baseline.
- [x] Create `feat/relay-p0-demo`.
- [x] Establish this durable execution plan.

### M1 — Scaffold and quality gates

- [x] Scaffold Vite React TypeScript without remote runtime assets.
- [x] Configure ESLint, Vitest, Playwright, typecheck, build, and `npm run verify`.
- [x] Add SPA rewrite build artifact.
- [x] Prove a minimal production page through the gate.

### M2 — Deterministic domain core

- [x] Define fixture, relative next-Saturday date, reducer, and legal stages.
- [x] Add persistence with `seedVersion` migration and safe parsing.
- [x] Add `BroadcastChannel` and `storage` event synchronization.
- [x] Cover state transitions, reset, migration, and idempotency; browser-level
  synchronization timing remains scheduled for M5.

### M3 — Bounded handoff experience

- [ ] Build Lin Ran Today view with three scannable responsibility sections.
- [ ] Build deterministic capture/confirmation and handoff preview surfaces.
- [ ] Build no-account helper view, accept, decline, and invalid-token states.
- [ ] Build accepted and completion loops with truthful persistent copy.
- [ ] Keep the decision boundary visible on all core surfaces.

### M4 — Warm Editorial demo stage

- [ ] Build the two-phone `/demo` stage and presenter-only controller.
- [ ] Make the responsibility rail the hero mechanism across all views.
- [ ] Add purposeful 680ms transfer motion and reduced-motion equivalent.
- [ ] Add close scenarios: moving, parent care, partner collaboration.

### M5 — QA and final reliability

- [ ] Validate 375×812 and 1440×900 screenshots visually.
- [ ] Check overflow, clipping, tap targets, projection readability, error/empty states, and reduced motion.
- [ ] Run same-origin sync timing and offline checks.
- [ ] Run the deterministic golden path ten consecutive times.
- [ ] Run final `npm run verify` and leave a green checkpoint commit.

## Checkpoints

### 2026-08-29 — Documentation baseline

- Completed outcome: repository initialized on `main`; approved context, specs,
  ADR, PRD, review, research source, project instructions, and `.gitignore`
  committed as `944b838`; feature branch created.
- Evidence: `git status --short --branch` showed clean
  `feat/relay-p0-demo` after branch creation.
- Changed files: `.gitignore`, `AGENTS.md`, `docs/**`, `report-source.md`.
- Unresolved risk: implementation and all executable quality gates are still
  absent.
- Next concrete goal: scaffold the smallest React/Vite app with the complete
  verification command before product behavior is added.

### 2026-08-29 — Green application scaffold

- Completed outcome: React/Vite/TypeScript app, required route shells, strict
  lint/typecheck, Vitest, Playwright using the locally installed stable Chrome,
  production build, and SPA rewrite are wired behind `npm run verify`.
- Evidence: `npm run verify` passed 2026-08-29: lint, typecheck, 1 unit test,
  production build, and 1 Chromium route-smoke E2E.
- Changed files: `package.json`, `package-lock.json`, TypeScript/Vite/ESLint/
  Playwright configs, `index.html`, `vercel.json`, `src/**`, `tests/**`.
- Unresolved risk: the app is still a route shell; fixture, state transitions,
  persistence, and synchronization are not implemented.
- Next concrete goal: implement the complete deterministic domain core and its
  unit-test suite before building product surfaces.

### 2026-08-29 — Deterministic state core

- Completed outcome: versioned five-matter fixture, strictly-next-Saturday date,
  legal whole-state reducer, idempotent share/accept/decline/complete actions,
  complete stage jumps, safe local persistence, and same-origin synchronization
  provider are implemented.
- Evidence: lint and strict typecheck passed; Vitest passed 13 tests covering
  transitions, illegal/duplicate actions, completion separation, declines,
  reset/date recomputation, deep fixture independence, and stale/corrupt cache
  migration.
- Changed files: `src/domain/**`, `src/store/**`, `src/main.tsx`.
- Unresolved risk: synchronization is implemented but its 500ms browser timing
  contract is not yet proven; product UI still does not expose the flow.
- Next concrete goal: build the shared responsibility components and complete
  both Lin Ran and Xiaoyu product surfaces against this state source.

## Decision notes

- The handoff context pack overrides the older PRD color direction: use warm
  cream, deep brown, restrained brick/coral, and warm taupe rather than purple
  or green as the primary system.
- `/demo` owns the formal presentation path; `/` and `/r/:token` remain truthful
  product views. The two phones share the same provider in one DOM.
- Completion is distinct from acceptance. Acceptance moves execution ownership;
  completion closes the action without erasing the recorded boundary.
