# Relay P0 execution plan

> Owner: main implementation session  
> Branch: `codex/relay-p0-demo-recovery` (recovery worktree; based on `feat/relay-p0-demo`)
> Status: complete — interactive full-demo expansion
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

- [x] Build Lin Ran Today view with three scannable responsibility sections.
- [x] Build deterministic capture/confirmation and handoff preview surfaces.
- [x] Build no-account helper view, accept, decline, and invalid-token states.
- [x] Build accepted and completion loops with truthful persistent copy.
- [x] Keep the decision boundary visible on all core surfaces.

### M4 — Warm Editorial demo stage

- [x] Build the two-phone `/demo` stage and presenter-only controller.
- [x] Make the responsibility rail the hero mechanism across all views.
- [x] Add purposeful 680ms transfer motion and reduced-motion equivalent.
- [x] Add close scenarios: moving, parent care, partner collaboration.

### M5 — QA and final reliability

- [x] Validate 375×812 and 1440×900 screenshots visually.
- [x] Check overflow, clipping, tap targets, projection readability, error/empty states, and reduced motion.
- [x] Run same-origin sync timing and offline checks.
- [x] Run the deterministic golden path ten consecutive times.
- [x] Run final `npm run verify` and leave a green checkpoint commit.

### M6 — Complete interactive product demo

- [x] Record the expanded product contract and responsive-Web decision in ADR-002.
- [x] Document the product background, difference from chat, and independent value.
- [x] Extend the persisted domain for matter CRUD, people, activity, and filters.
- [x] Replace the standalone phone home with a complete responsive application shell.
- [x] Add overview, matters, handoffs, people, activity, settings, and product-story surfaces.
- [x] Preserve the verified `/demo` and public helper routes.
- [x] Add interactive-system E2E and mobile/desktop visual evidence.
- [x] Run final verification and leave a green checkpoint.

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

### 2026-08-29 — Bounded handoff and Warm Editorial stage

- Completed outcome: built Lin Ran's three-section Today view, deterministic
  confirmation and preview surfaces, the no-account Xiaoyu flow, accept,
  decline, complete and invalid-token outcomes, the shared responsibility rail,
  and the two-phone Warm Editorial `/demo` stage with presenter controls and
  expansion scenarios.
- Evidence: `npm run verify` passed after recovery with lint, strict typecheck,
  13 unit tests, production build, and route E2E. Browser walkthrough at
  1440×900 covered initial → confirm → preview → shared → accepted, plus decline
  and invalid-token states; the decision boundary remained visible and the
  accepted state showed both responsibility endpoints, Xiaoyu's filled point,
  and persistent copy that Lin Ran no longer needs to chase.
- Changed files: `src/App.tsx`, `src/App.test.tsx`, `src/styles.css`,
  `src/components/**`, `src/lib/**`, `src/screens/**`, and this execution plan.
- Unresolved risk: existing E2E is still route-level smoke coverage; the 500ms
  same-origin synchronization contract, production-build offline behavior,
  reduced-motion rendering, responsive screenshots, and ten-run deterministic
  path remain to be proven in M5.
- Next concrete goal: replace the smoke E2E with acceptance-level browser tests
  and collect the responsive, offline, synchronization, and ten-run evidence.

### 2026-08-29 — Final P0 reliability and visual QA

- Completed outcome: replaced route smoke coverage with acceptance-level tests,
  moved browser tests onto the production preview build, added durable visual
  baselines, fixed the reduced-motion switch hit area and mobile helper header,
  and raised all product and presenter controls to at least 44px targets.
- Evidence: `npm run test:golden` passed 10/10 consecutive runs from reset;
  final `npm run verify` passed lint, strict typecheck, 13 unit tests, production
  build, and 10 Chromium E2E tests. The E2E suite proves same-origin acceptance
  arrives within 500ms, the already-loaded production app completes while the
  browser is offline with zero external requests, and reduced-motion semantics
  remain complete.
- Visual evidence: inspected four versioned screenshots at 375×812 and
  1440×900 covering owner initial, helper shared, desktop initial, and desktop
  accepted states. No clipping or horizontal overflow was visible; the mobile
  helper's action and decision boundary remain in the first viewport, and both
  desktop phones remain projection-readable.
- Changed files: `package.json`, `playwright.config.ts`, `tsconfig.node.json`,
  `src/styles.css`, `src/screens/HelperView.tsx`, `tests/acceptance.spec.ts`,
  `tests/golden-path.spec.ts`, `tests/visual.spec.ts`, visual baselines, and this
  execution plan.
- Unresolved risk: none within the approved P0 contract. Real cross-device
  collaboration, production security, deployment, and Stretch Goals remain
  explicitly out of scope and were not started.
- Next concrete goal: none within P0; preserve the green checkpoint until a
  separately authorized deployment, recording, or Stretch Goal task exists.

### 2026-08-29 — Complete interactive product demo

- Completed outcome: `/` is now a complete responsive Relay workspace rather
  than a phone-shaped stage. It includes overview, searchable and filterable
  matter management, create/edit/delete/detail/status workflows, handoff
  columns, trusted people, activity history, settings, and an in-product design
  background/comparison with chat. Eight seeded matters, four trusted people,
  and activity records are real application state persisted in localStorage.
- Mobile outcome: 375×812 uses a compact header, fixed four-tab navigation,
  touch-sized controls, a floating create action, vertically scrollable content,
  and no horizontal page overflow. Desktop uses a persistent sidebar and
  multi-column information layout. The same deployable Web build serves both.
- Evidence: `npm run verify` passed lint, strict typecheck, 16 unit tests,
  production build, and 15 Chromium E2E tests. New E2E proves module navigation,
  seeded data, matter creation, refresh persistence, editing, responsibility
  transfer, search, activity history, product story, and mobile navigation.
- Regression evidence: `npm run test:golden` again passed 10/10 after the
  expansion; `/demo`, helper sharing, 500ms same-origin synchronization,
  reduced motion, offline flow, invalid token, and existing P0 visual baselines
  remain green.
- Visual evidence: versioned 1440×900 overview/matters/demo screenshots and
  375×812 overview/matters/helper screenshots were inspected. Navigation,
  content hierarchy, controls, cards, and fixed mobile navigation remain clear.
- Changed files: `src/app/**`, `src/screens/Workspace*.tsx`, `src/workspace/**`,
  `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `tests/workspace.spec.ts`,
  `tests/visual.spec.ts`, visual baselines, ADR-002, product story, context pack,
  and this execution plan.
- Unresolved risk: online deployment still uses per-browser local data. Real
  cross-device shared accounts require an authorized backend, identity,
  permissions, and security phase; a WeChat Mini Program remains an optional
  separate distribution project, not a requirement for phone browser use.
- Next concrete goal: deploy the static build when the user authorizes a host,
  or begin a separately scoped cloud-account architecture if real shared data
  across devices is required.

## Final P0 acceptance evidence

| Acceptance item | Evidence |
|---|---|
| Initial → accepted in under 45 seconds | Golden-path E2E enforces the threshold; the full path including completion and reset ran in under one second per automated run. |
| Helper can explain action and prohibited decisions | The 375×812 shared-helper baseline shows time, exact next action, required material, completion condition, and medical decision boundary together in the first viewport. |
| Responsibility change is obvious within 5 seconds | Golden-path E2E enforces the threshold and finds two persistent `当前由小雨推进` rails plus Lin Ran's release copy. |
| Same-origin synchronization within 500ms | Two-page production-build E2E measures helper acceptance to owner release state and fails at 500ms. |
| 375px has no horizontal scrolling | Browser metric assertion passes for owner and helper routes; both versioned 375×812 screenshots were visually inspected. |
| 1440×900 remains projection-readable | Initial and accepted double-phone baselines were visually inspected with all core copy, rails, controls, and boundaries visible. |
| Formal path has no typing, network wait, or scrolling | Offline golden-path E2E finds zero textboxes, zero external requests, zero page scroll, and completes after offline mode is enabled. |
| One reset restores the complete fixture | Unit tests verify five matters, one handoff, initial ownership, and recomputed relative date; every golden run ends with reset assertions. |
| Reduced motion preserves meaning | E2E checks the controller toggle, near-zero animation duration, Xiaoyu ownership, both semantic rails, and persistent release copy. |
| Golden path succeeds ten consecutive times | `npm run test:golden`: 10 passed with one worker and deterministic reset. |
| Error, empty, decline, and completion states are clear | E2E covers safe invalid token, pre-share helper empty state, respectful decline returning responsibility, acceptance, and distinct completion. |
| Targets and zoom resilience | Product and presenter controls are asserted at ≥44px; a 720×450 CSS viewport (1440×900 at 200% equivalent) completes acceptance without horizontal overflow. |
| Production/offline/local assets | E2E runs against `vite preview` after a production build; the loaded app completes offline and observed requests stay on the local origin. |
| Direct routes and SPA fallback | Production-preview E2E opens `/`, `/demo`, `/r/demo-cat-checkup`, and an invalid token directly; `vercel.json` carries the SPA rewrite artifact. |

## Decision notes

- The handoff context pack overrides the older PRD color direction: use warm
  cream, deep brown, restrained brick/coral, and warm taupe rather than purple
  or green as the primary system.
- `/demo` owns the formal presentation path; `/` and `/r/:token` remain truthful
  product views. The two phones share the same provider in one DOM.
- Completion is distinct from acceptance. Acceptance moves execution ownership;
  completion closes the action without erasing the recorded boundary.
