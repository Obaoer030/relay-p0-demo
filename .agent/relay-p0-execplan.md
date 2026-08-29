# Relay P0 execution plan

> Owner: main implementation session  
> Branch: `codex/relay-p0-demo-recovery` (recovery worktree; based on `feat/relay-p0-demo`)
> Status: complete — M11 text coordination Agent
> Last updated: 2026-08-29

## Outcome contract

Deliver a deterministic, mobile-first React + TypeScript + Vite demo that makes
the bounded responsibility transfer from Lin Ran to Xiaoyu immediately clear.
The current approved visual system is Relay Signal OS: a reference-driven,
original interface with floating system navigation, strict grid and data
structure, a responsibility-signal hero, and purposeful interaction feedback.
The original golden path must work offline, require no typing or network,
synchronize same-origin tabs, and pass the repository's single
`npm run verify` quality gate. The separately authorized text Agent adds an
optional MiniMax-backed, human-confirmed planning path and a single-process
shared demo room for phone/computer demonstrations.

## Boundaries

- P0 only: no database, auth, analytics, payments, PWA, production cross-device
  claims, deployment, committed credentials, or paid-service dependency. The
  authorized M11 exception is an optional server-side MiniMax text Agent; a
  labelled deterministic local engine remains usable without a key.
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

### M7 — Plain-language workflow and copy

- [x] Record the user rejection of “接棒 / 接住” in the durable context pack.
- [x] Replace invented user-facing vocabulary with ordinary request, reply,
  responsibility, and completion language across the workspace and demo.
- [x] Update automated expectations and versioned visual baselines.
- [x] Verify the revised workflow at 375×812 and 1440×900.
- [x] Run `npm run verify` and leave a green checkpoint.

### M8 — Multi-perspective shared demo and Calm Tech Glass

- [x] Record the new multi-role and glass visual decision in the context pack
  and ADR-003.
- [x] Add four deterministic user perspectives and related seed data.
- [x] Add the top-right perspective switcher across desktop and mobile.
- [x] Make invitation acceptance, decline, ownership, completion, and activity
  visible across related perspectives from one shared state source.
- [x] Apply the Calm Tech Glass visual system with accessible fallbacks and no
  generic AI-template motifs.
- [x] Add complete multi-perspective flow, responsive, offline, sync, and visual
  test evidence.
- [x] Run `npm run verify`, ten golden runs, visual QA, and leave a green commit.

### M9 — Reference-driven Relay Signal OS

- [x] Read the referenced Codex task, live V2 page, and its final design guides.
- [x] Record the new visual decision and originality boundary in ADR-004.
- [x] Replace the desktop sidebar with a floating system rail and status bar.
- [x] Build the responsibility-signal hero, mission queue, and operational
  activity panel without copying reference brands or assets.
- [x] Apply the visual system across all workspace modules and mobile layouts.
- [x] Add purposeful cursor, magnetic, route-scan, and responsibility motion
  with touch/reduced-motion fallbacks.
- [x] Regenerate and inspect 375×812 and 1440×900 evidence.
- [x] Run `npm run verify`, ten golden runs, and leave a green commit.

### M10 — Single workspace and complete matter lifecycle

- [x] Record the single-state, complete-SOP and pointer decisions in the context
  pack and ADR-005.
- [x] Remove the roadshow runtime model and project `/demo` and `/r` from
  `WorkspaceState`.
- [x] Replace raw status editing with invite, accept, adjustment, decline,
  completion-result and reopen commands.
- [x] Keep the native desktop pointer and add a high-contrast test locator.
- [x] Migrate acceptance, sync, golden-path and visual tests to the complete
  product flow.
- [x] Run `npm run verify`, ten golden runs, dual-viewport visual QA, and leave
  a green commit.

### M11 — Text coordination Agent and shared demo room

- [x] Record the authorized runtime-AI, server credential, no-voice and shared
  demo-room decisions in the context pack and ADR-006.
- [x] Define and validate the Agent plan/clarification protocol.
- [x] Add the MiniMax server proxy, `.env.example`, timeout/error handling and
  deterministic labelled fallback.
- [x] Replace new-matter-first forms with typed Agent capture, clarification,
  editable multi-step review and explicit publish confirmation.
- [x] Add server-backed cross-browser/device demo-room synchronization while
  preserving local fallback and reducer guards.
- [x] Add unit/E2E/visual evidence and leave a green checkpoint.

## M11 checkpoint — Text coordination Agent and shared demo room

- Completed outcome: the new-matter route now starts with a text-first Agent
  conversation. It asks one focused clarification when needed, produces an
  editable multi-step plan with real seeded owners, and creates actual matters
  only after explicit human confirmation. Manual creation remains available.
- Trust boundary: the browser never receives the MiniMax credential and never
  treats a draft as accepted work. Server output is schema-validated; provider
  timeout, malformed output, and missing credentials use a visibly labelled
  deterministic local demo engine rather than pretending AI succeeded.
- Shared-room outcome: a single running Relay Node server now shares the same
  reducer-valid workspace over SSE and HTTP between separate phone and computer
  browsers. LocalStorage, BroadcastChannel, storage events, and local-only
  fallback remain intact; active perspective and reduced-motion preference stay
  device-local.
- Evidence: final `npm run verify` passed lint, strict TypeScript, 7 unit tests,
  production build, and 20 Chromium E2E tests. Tests cover Agent clarification,
  zero mutation before confirmation, three real created matters, human ownership
  acceptance, and isolated phone/computer browser contexts sharing a room.
- Reliability evidence: `npm run test:golden` passed both the complete product
  path and offline path across ten consecutive repetitions (20/20). The Agent
  creation plus isolated device synchronization suite also passed ten
  consecutive repetitions (20/20).
- Visual evidence: regenerated and inspected the Agent composer at 1440×900 and
  375×812. The desktop two-panel plan layout and mobile single-column capture
  keep labels, manual fallback, starter prompts, bottom navigation, and publish
  boundary readable with no horizontal overflow.
- Changed files: ADR-006, context pack, docs and environment template; Vite and
  standalone Node middleware; Agent protocol, UI and styles; workspace room
  synchronization and plan metadata; unit, E2E and visual tests/baselines.
- Unresolved risk: no live MiniMax call can be verified until the user supplies
  a key. The shared room is intentionally in-memory and single-process: it is
  appropriate for one hackathon demo server, not production persistence,
  authentication, access control, multi-instance deployment, or conflict
  resolution.
- Next concrete goal: after the user fills `.env.local`, restart the server and
  run one credentialed MiniMax smoke test. Do not commit the key.

## M10 checkpoint — Single workspace and complete matter lifecycle

- Completed outcome: removed the separate roadshow reducer/provider/screens and
  made `WorkspaceState` the only runtime truth. `/demo` enters the complete
  workspace and `/r/demo-cat-checkup` is a focused, no-account projection of
  the same `ws-cat-checkup` record.
- SOP outcome: new matters choose self-processing or a real invite; forms no
  longer expose raw status or owner mutation. The legal flow now includes
  accept, request adjustment, edit-and-reconfirm, decline, completion result,
  and creator reopen, with activity records for every transition.
- Desktop test outcome: the native cursor is no longer hidden. A high-contrast
  locator labelled “指针” follows the exact pointer coordinates on fine-pointer
  devices; touch and reduced-motion modes suppress the overlay safely.
- Evidence: final `npm run verify` passed lint, strict TypeScript, 6 unit tests,
  production build, and 18 Chromium E2E tests. Browser tests prove complete
  CRUD/SOP flow, four perspectives, invalid-token privacy, 500ms same-origin
  synchronization, offline completion, reduced motion, pointer fallback, and
  responsive overflow behavior.
- Reliability evidence: `npm run test:golden` passed 20/20 executions (the
  complete no-typing product path and offline path repeated ten times).
- Visual evidence: regenerated and inspected 1440×900 complete-demo/workspace
  views and 375×812 workspace/public-collaboration views. Navigation, main
  actions, decision boundary and user switching are readable with no horizontal
  overflow.
- Changed files: ADR-005 and context pack; runtime provider/routes; workspace
  types/reducer/persistence/seed; matter editor/detail/share/settings; pointer
  interaction/CSS; unit, acceptance, golden, workspace and visual tests.
- Unresolved risk: same-origin local data is still a deliberate P0 boundary;
  real cross-device accounts and conflict resolution require a separately
  authorized backend. No production claim is made.
- Next concrete goal: none inside the approved P0 contract. Preserve this green
  checkpoint until deployment or production infrastructure is separately
  authorized.

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

### 2026-08-29 — Plain-language workflow and copy

- Completed outcome: removed “接棒 / 接住” and related invented vocabulary from
  every user-facing product and demo surface. The canonical flow is now “记录事情
  → 说清下一步 → 发给对方 → 对方确认是否负责 → 完成”, with visible states
  “待我处理 / 等待回复 / 对方处理中 / 已完成”. The collaborator responds with
  “可以，我来处理” or “这次我不方便”, and accepted copy says exactly who is
  responsible for the next step.
- Product-story outcome: the in-app explanation now distinguishes Relay from
  chat using ordinary questions: what needs doing, who is responsible, what
  counts as done, and when the initiator must be contacted again. The context
  pack and demo spec record this language decision as the newest contract.
- Evidence: `npm run verify` passed lint, strict typecheck, 16 unit tests,
  production build, and 15 Chromium E2E tests. Same-origin synchronization,
  offline behavior, reduced motion, invalid tokens, responsive navigation, and
  matter CRUD remain green. `npm run test:golden` passed 10/10 consecutive runs.
- Visual evidence: regenerated and inspected seven versioned baselines at
  375×812 and 1440×900. The longer natural-language headings and buttons remain
  readable without clipping or horizontal overflow; the mobile helper page
  keeps the request, exact action, contact condition, and response buttons in
  one clear view.
- Changed files: user-facing workspace/demo screens and shared components,
  workspace seed/reducer copy, acceptance/golden/visual tests, visual baselines,
  product documentation, and this execution plan.
- Unresolved risk: none introduced by the copy revision. Internal TypeScript
  names such as `handoff` and `relayed` remain intentionally unchanged because
  they are not exposed to users.
- Next concrete goal: none within this revision; preserve the green checkpoint.

### 2026-08-29 — Multi-perspective shared demo and Calm Tech Glass

- Completed outcome: added four switchable perspectives (林然、小雨、姐姐、
  陈宇), fourteen deterministic matters, related activity records, and a
  top-right desktop/mobile perspective control. Every perspective reads and
  updates one shared reducer state; switching roles never duplicates or resets
  a matter.
- Flow evidence: browser tests prove distinct per-role datasets, invitation from
  林然 to 小雨, acceptance, visibility from both sides, completion by the active
  owner, and decline returning responsibility to the creator. Matter creation,
  editing, persistence, search, activity, and module navigation remain covered.
- Visual outcome: replaced the earlier warm-only surface treatment with Calm
  Tech Glass: neutral canvas, steel blue, dark navy, restrained coral warmth,
  translucent navigation/key layers, opaque content cards, text-first status
  semantics, and backdrop-filter fallbacks. Purple neon, glowing AI orbs,
  gradient text, magic/sparkle motifs, and decorative motion are absent.
- Evidence: final `npm run verify` passed lint, strict typecheck, 18 unit tests,
  production build, and 18 Chromium E2E tests. The suite includes 500ms
  same-origin synchronization, offline completion with zero external requests,
  reduced motion, invalid tokens, ≥44px controls, and 200%-equivalent layout.
  Final `npm run test:golden` passed 10/10 consecutive deterministic runs.
- Visual evidence: regenerated and inspected nine versioned baselines. Desktop
  1440×900 and mobile 375×812 cover 林然 and 小雨 overviews, matter lists,
  the helper request, and both demo states. No horizontal overflow, clipped
  controls, unreadable status, or hidden perspective switcher was observed.
- Changed files: workspace model/seed/reducer/persistence and perspective
  selectors; app shell, switcher, overview, matters, collaboration, detail,
  people, activity, editor, and settings screens; Calm Tech Glass styles;
  browser/unit/visual tests and baselines; ADR-003, context pack, and this plan.
- Unresolved risk: this remains a no-auth local demo. Browser tabs on one origin
  synchronize, but separate physical devices do not share data without a later
  authorized backend and identity/security phase. Public deployment and a
  WeChat Mini Program were not started.
- Next concrete goal: none within the authorized local-demo scope; preserve this
  green checkpoint until deployment or real cross-device data is separately
  authorized.

### 2026-08-29 — Reference-driven Relay Signal OS

- Completed outcome: rebuilt the complete workspace around the supplied
  `NEON LOOP OS / V2` quality reference. Desktop now uses a floating module
  rail and local-sync status bar; the overview uses large display typography,
  an original responsibility-signal orbit, live user nodes, a task signal,
  completion ring, operational metrics, task queue, and shared-progress panel.
- Originality outcome: reused design grammar rather than assets. Relay contains
  no PICO, NL/OS brand, event copy, game module, generated image, remote font,
  or reference-specific illustration. ADR-004 records this boundary.
- Interaction outcome: fine-pointer devices receive a precise signal cursor,
  low-amplitude magnetic primary controls, route-scan transitions, moving
  responsibility signals, and slow orbit motion. Touch devices keep native
  interaction; reduced-motion disables the cursor, scanning, orbit rotation,
  and moving signals while preserving labels and final responsibility state.
- Responsive outcome: mobile is independently directed with a compact header,
  bottom navigation, acid-lime create action, horizontally scannable metric
  strip, vertically staged responsibility visual, and single-column modules.
  Empty collaboration columns no longer inherit desktop height.
- Evidence: final `npm run verify` passed lint, strict typecheck, 18 unit tests,
  production build, and 19 Chromium E2E tests. New coverage asserts the Signal
  OS shell, reference-asset absence, reduced-motion fallback, mobile navigation,
  and zero horizontal overflow. `npm run test:golden` passed 10/10.
- Visual evidence: regenerated and manually inspected nine baselines at
  1440×900 and 375×812 for 林然/小雨 overview, matter lists, helper request,
  and both demo states. Browser inspection also covered desktop matters and
  people, mobile matters and collaboration, cursor state, and magnetic motion.
- Changed files: `src/app/AppShell.tsx`, new
  `src/app/SignalInteractionLayer.tsx`, `src/screens/WorkspaceOverview.tsx`,
  the Relay Signal OS section in `src/styles.css`, workspace/visual tests and
  baselines, ADR-004, context pack, docs index, and this plan.
- Unresolved risk: the visual system is intentionally more expressive and adds
  CSS weight, but uses no remote/runtime assets and preserves the local P0
  architecture. Real multi-device data and public deployment remain out of
  scope.
- Next concrete goal: none within this visual rebuild; preserve the green
  checkpoint until the user separately authorizes deployment or production
  infrastructure.

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
| Four user perspectives share one state | Workspace E2E asserts distinct seeded counts for 林然、小雨、姐姐、陈宇, then proves acceptance and completion remain visible after switching back and forth. |
| Top-right switcher works on desktop and mobile | Versioned 1440×900 and 375×812 screenshots include the current role control; E2E switches all four roles and checks the resulting headings and data. |
| Reference quality without copied identity | ADR-004 and workspace E2E require the Relay Signal OS shell while asserting that PICO and NL/OS are absent; all runtime assets remain local. |
| Signal motion degrades safely | Workspace E2E emulates reduced motion and verifies the signal cursor is hidden and route scan has no animation; touch layouts use native pointer behavior. |
| Targets and zoom resilience | Product and presenter controls are asserted at ≥44px; a 720×450 CSS viewport (1440×900 at 200% equivalent) completes acceptance without horizontal overflow. |
| Production/offline/local assets | E2E runs against `vite preview` after a production build; the loaded app completes offline and observed requests stay on the local origin. |
| Direct routes and SPA fallback | Production-preview E2E opens `/`, `/demo`, `/r/demo-cat-checkup`, and an invalid token directly; `vercel.json` carries the SPA rewrite artifact. |
| Text Agent preserves human control | E2E proves incomplete text causes a focused clarification, no matter is created before confirmation, the editable plan then publishes three reducer-backed matters, and another person must still accept her invitation. |
| Missing/failed MiniMax stays truthful | Unit/API tests validate the response schema; the server reports `local-demo` and the UI labels the deterministic fallback instead of presenting it as a live provider result. |
| Phone and computer share the demo room | Ten repeated E2E runs use isolated browser contexts, accept an invitation from the phone context, and observe the owner change from the computer context within one second. |
| MiniMax credential stays server-side | `.env.example` contains only names/defaults, `.env.local` is ignored, browser code contains no API key, and the provider call is implemented only in server middleware. |

## Decision notes

- The explicit reference-driven decision in ADR-004 supersedes ADR-003 as the
  primary visual language. Relay Signal OS adopts the reference's layout and
  interaction grammar through original product-specific components and assets.
- `/demo` owns the formal presentation path; `/` and `/r/:token` remain truthful
  product views. The two phones share the same provider in one DOM.
- Completion is distinct from acceptance. Acceptance moves execution ownership;
  completion closes the action without erasing the recorded boundary.
