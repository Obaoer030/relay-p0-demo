# Relay P0 long-run context pack

## 2026-08-29 multi-perspective and Calm Tech Glass addendum

The user explicitly requires the complete workspace to demonstrate data moving
between multiple people, not only a single Lin Ran view. The workspace now has
four deterministic demo perspectives (Lin Ran, Xiaoyu, Sister, and Chen Yu), a
top-right perspective switcher, perspective-specific seeded matters, and shared
matter transitions. Switching perspective must not clone or reset data: when an
invitee accepts, declines, or completes a matter, every related perspective sees
the same updated record and activity history.

The user also explicitly replaced the previous flat Warm Editorial treatment
with a more technological Apple-inspired glass direction, then clarified that
it need not remain warm. The approved design language is **Calm Tech Glass**:

- use a light neutral canvas, steel-blue primary accent, dark navy ink, and a
  small amount of coral only for human warmth or attention;
- add translucent layered navigation, real backdrop blur, fine luminous
  borders, and restrained depth;
- keep body text and critical state surfaces sufficiently opaque for contrast;
- use glass to explain hierarchy and interaction, not as decorative noise;
- avoid the generic “AI look”: purple neon gradients, glowing orbs, sparkles,
  magic-wand or neural icons, excessive pills, gradient text, decorative grids,
  and motion without product meaning;
- preserve reduced-motion meaning and a solid-color fallback when backdrop blur
  is unavailable.

This addendum overrides the earlier prohibition on glassmorphism because it is
an explicit user decision recorded here. It does not authorize a database,
identity system, public deployment, runtime AI, or real cross-device claims.

## 2026-08-29 plain-language product copy addendum

User testing feedback rejected “接棒 / 接住” as invented product language that
people would not naturally use when asking friends or family for help. The
concept remains bounded transfer of the next-step responsibility, but all
user-facing copy now uses ordinary Chinese:

```text
记录事情 → 说清下一步 → 发给对方 → 对方确认是否负责 → 完成

待我处理 → 等待回复 → 对方处理中 → 已完成
```

- Product navigation uses “协作”, not “接棒”.
- The initiator says “想请你帮忙处理” or “发给小雨”.
- The collaborator responds “可以，我来处理” or “这次我不方便”.
- Accepted-state copy says “这一步由小雨负责”; it does not say someone has
  “接住” a matter.
- Product explanations lead with “现在谁负责下一步、做到什么算完成、哪些
  情况仍要联系发起者”.
- `handoff`, `relayed`, and `ResponsibilityRail` may remain internal code names;
  they are not exposed as vocabulary the user must learn.

This addendum overrides older user-facing “接棒 / 接住” examples in the PRD,
review notes, and the rest of this context pack. The product brand remains
Relay without a forced Chinese translation.

## 2026-08-29 interactive-full-demo addendum

The user has explicitly expanded the desired outcome beyond the 90-second P0
stage. Preserve the verified `/demo` path, but `/` must now become a complete,
freely explorable application demo with real persisted sample data, matter CRUD,
handoff management, trusted people, activity history, settings, product story,
and responsive mobile/desktop layouts. ADR-002 is the newer contract for this
expansion. It does not authorize deployment, credentials, real authentication,
or a cloud database.

> Status: Approved handoff baseline  
> Date: 2026-08-29  
> Product: Relay（接棒） / project codename She Nicest  
> Purpose: Give a fresh Codex session the current durable truth without relying on prior conversation history.

## 1. Executive contract

Build a visually polished, deterministic Web prototype for a women-focused hackathon. The prototype demonstrates a bounded responsibility handoff in ordinary life: a woman can turn a mentally held matter into a clear package, ask a trusted person to take the next action, and visibly stop being the person who must keep pushing.

The P0 is not a production collaboration platform and does not attempt to validate long-term retention, willingness to pay, or real cross-device infrastructure during the hackathon build.

### Definition of success

After the 90-second demo, a judge can answer within five seconds:

1. Who originally had to move the matter forward?
2. Who owns the next step now?
3. What exactly did the helper agree to do?
4. Which decisions still belong to the original owner?
5. Does the original owner need to keep chasing the matter?

## 2. Latest confirmed decisions

These decisions are approved and do not require further confirmation:

- Product name: Relay（接棒）.
- Primary audience for the story: urban women aged roughly 25–35 who live independently, have stable income, and coordinate life matters with trusted people.
- Hero scenario: Lin Ran has a sudden business trip and asks her friend Xiaoyu to take her cat Pudding to a routine follow-up appointment.
- Core differentiation: chat tools preserve what people said; task tools preserve what I must do; Relay shows who is currently responsible for moving the matter forward.
- P0 architecture: deterministic local-first demo, not production infrastructure.
- Primary UI direction: **01 暖光杂志 / Warm Editorial**.
- Development mode: guarded autonomous long-running work with durable Git checkpoints.
- External deployment, paid services, credentials, and production claims require separate user authorization.

## 3. User and commercial framing

### Primary user: matter initiator

- A woman living independently or apart from a partner.
- Often coordinates pets, housing, travel, personal administration, health accompaniment, or distant-parent matters.
- Uses WeChat, notes, screenshots, and calendars today.
- Her pain is not only task volume. It is scattered context, repeated explanation, unclear ownership, and the need to keep remembering whether someone else acted.

### Secondary user: trusted collaborator

- Friend, partner, roommate, sibling, or parent.
- May never create a Relay account.
- Needs to understand why they were asked, the exact next action, timing, completion condition, and decisions they must not make.
- Must be able to accept, adjust, or refuse without guilt-inducing language.

### Future paying segments

- Young individual users are a plausible acquisition and personal-subscription segment.
- Dual-income couples and families may have higher long-term value but are not the only market.
- Future relationship circles include couples, roommates, siblings coordinating parent care, and families.

### Commercial assumptions that remain unvalidated

- Young people’s general willingness to pay does not prove willingness to pay for Relay.
- PDF import, school packs, OCR, AI, or other technical features are not accepted payment evidence.
- Potential pricing such as ¥39/¥69/¥99 per year is an experiment hypothesis, not a committed plan.
- The key business experiment is whether successful first handoff users create another collaborative matter within 14 days.

Do not build pricing, PDF import, school packages, or payment UI in P0.

## 4. Core product model

A Matter is not a generic to-do. It is a compact life-context package:

```text
goal + background + next action + timing + required material
+ participant + current responsibility + completion condition + decision boundary
```

Each active matter has one current next-step owner. Status and responsibility are related but must not be conflated.

Minimum responsibility states visible in the demo:

1. I need to move it forward.
2. Waiting for someone’s response.
3. Someone has taken the next step.

The helper can accept or decline. The demo’s primary path uses acceptance.

## 5. Hero fixture

Use this deterministic fixture as the canonical P0 story:

| Field | Value |
|---|---|
| id | `matter-cat-checkup` |
| title | 周六带布丁完成复诊 |
| background | 林然周五临时出差，周日晚返回 |
| appointment | Next Saturday at 09:30, recomputed on reset |
| next action | 08:40 接到布丁，09:20 前到达诊所 |
| required material | 纸质报告放在猫包侧袋 |
| completion | 布丁完成复诊并安全回家，复诊结论发给林然 |
| helper | 小雨 |
| initial owner | 林然 |
| mental load | 比较挂心 |
| demo token | `demo-cat-checkup` |

Decision boundary, shown prominently:

> 如果医生建议当日手术、住院、更改治疗方案或产生重大额外费用，请先联系林然，不替她作医疗决定。

## 6. Required demo flow

The formal path requires no typing, QR scan, network wait, or scrolling and should remain under six meaningful interactions.

1. Lin Ran’s home shows three responsibility sections.
2. The hero matter starts under “需要我推进”.
3. A deterministic preset creates or opens the matter package.
4. The confirmation surface shows next action, completion condition, and decision boundary.
5. Lin Ran selects “请小雨接住”.
6. Xiaoyu’s no-account view explains the request and boundary.
7. Xiaoyu selects “我愿意接住”.
8. Both views synchronize; the responsibility point moves to Xiaoyu and the matter appears under “已有人接住”.
9. The close shows expansion scenarios: moving, parent care, and partner collaboration.

## 7. Required screens and components

### Product screens

- Lin Ran “Today” home with three responsibility sections.
- Matter creation/confirmation sheet using a preset utterance.
- Handoff preview that names Xiaoyu and the exact shared context.
- No-account route `/r/demo-cat-checkup` for Xiaoyu.
- Accepted/held state for Lin Ran.

### Demo-only stage

Route `/demo` presents two phones in one DOM and one state source:

- Lin Ran phone on the left.
- Xiaoyu phone enters or becomes active after sharing.
- Presenter-only stage controls: initial, shared, accepted, completed, reset, viewpoint, reduced motion.
- Stage controls are never part of production navigation.

### Shared core components

- `ResponsibilityRail`: Lin Ran and Xiaoyu labels, two endpoints, movable active point, persistent semantic state text.
- `MatterCard`: title, timing/status, next owner, essential boundary.
- `BoundaryNotice`: visually prominent but calm.
- `HandoffSheet` or equivalent contained confirmation surface.
- `DemoController`: legal whole-state transitions only.

## 8. Approved UI direction: Warm Editorial

The user selected Direction 01 and asked the entire product to proceed in that style.

### Emotional goal

Warm, adult, editorial, trustworthy, and emotionally safe. The experience should feel like a calm lifestyle publication helping someone put down mental load—not like enterprise project management, a children’s chore chart, a medical portal, or a generic pastel AI app.

### Initial token direction

These are implementation starting points, not immutable pixel specifications:

```text
Canvas / warm cream: #FFF8F0
Primary ink / deep brown: #3D2925
Muted text / warm taupe: #846F68
Brick-coral accent: #B84F4B
Soft rose surface: #ECD2C8
Warm divider: #E4D2C6
```

- Display typography may use a locally available serif/Song-style stack.
- Body, labels, controls, and dense content use a highly readable sans-serif stack.
- Use asymmetric but restrained card corners, for example one slightly tighter corner, to create editorial personality.
- Use warm illustrations or simple locally packaged avatars sparingly.
- Avoid decorative script fonts for functional text.
- Avoid relying on pink to communicate “for women”.

### Hierarchy

- The opening sentence carries emotional framing but must not push core actions below the fold.
- Responsibility sections must be scannable at a glance.
- The hero matter card is the dominant actionable surface.
- Decision boundaries are never hidden in secondary details.
- On desktop projection, phone content must remain readable from a distance.

### Motion

- Responsibility transfer: approximately 680ms, purposeful and easy to narrate.
- Ordinary feedback: approximately 160–240ms.
- Xiaoyu phone may slide or resolve into focus after sharing.
- With `prefers-reduced-motion`, remove positional motion but preserve filled-point change, labels, and status copy.
- No looping decoration, background particle field, or gratuitous glass effects.

## 9. P0 technical architecture

Approved chain:

```text
React + TypeScript + Vite
→ Context/useReducer (or equivalently small deterministic store)
→ localStorage persistence
→ BroadcastChannel same-origin tab synchronization
→ /demo two-phone stage
```

### Required implementation behavior

- `seedVersion` controls fixture migration.
- Reset recomputes relative dates and restores the complete fixture.
- State transitions must be legal whole-state transitions, not isolated CSS changes.
- Same-origin tabs synchronize within 500ms under normal local conditions.
- The production build works without network access for the golden path.
- Add Vercel SPA rewrite configuration only as a build artifact; do not deploy without authorization.

### Explicit P0 exclusions

- Supabase, database schema, authentication, RLS, Edge Functions, Realtime.
- Runtime AI generation or parsing.
- Real cross-device synchronization.
- Real medical records, addresses, phone numbers, or external PDFs.
- Payments, analytics, notifications, calendar integration, or contact access.

Stretch work may begin only after every P0 acceptance item is green and the user separately authorizes it.

## 10. Quality and acceptance contract

Minimum automated command:

```text
npm run verify
```

It must cover lint, TypeScript, unit tests, production build, and Playwright E2E.

Required checks:

- Initial-to-accepted flow can be completed in under 45 seconds.
- Xiaoyu’s screen lets a viewer explain the action and prohibited decisions within 20 seconds.
- Responsibility change is visually obvious within 5 seconds after acceptance.
- Same-origin tab synchronization completes within 500ms in the test environment.
- No horizontal scrolling at 375px.
- Desktop `/demo` remains legible at 1440×900.
- Formal path has no typing, QR scan, network wait, or scrolling.
- One reset restores the complete fixture.
- Reduced-motion mode preserves complete meaning.
- Golden path succeeds ten consecutive times.
- All critical resources are locally packaged.

Visual QA must inspect screenshots, not only DOM assertions. Record important evidence in the live execution plan or a final QA report.

## 11. Git and long-run workflow

The repository was not yet initialized when this pack was created.

Expected sequence:

1. Initialize `main`.
2. Add an appropriate `.gitignore`.
3. Commit the approved documentation baseline using explicit paths.
4. Create `feat/relay-p0-demo`.
5. Create `.agent/PLANS.md` and `.agent/relay-p0-execplan.md`.
6. Scaffold the Web app and quality gates.
7. Commit only green, coherent milestones.

Suggested milestone commits:

```text
docs: establish relay demo baseline
chore: scaffold relay web app and quality gates
feat: implement deterministic relay state
feat: build bounded handoff interaction
feat: add warm editorial demo stage and motion
test: verify relay golden path and responsive views
```

Do not use destructive Git cleanup. Stop incomplete runs at the most recent green commit and update the execution plan before ending.

## 12. Session orchestration policy

The user explicitly authorized fresh sessions to keep context focused.

### Main development session

One new session owns the initialization and P0 implementation mainline. It reads this pack and repository evidence rather than importing the entire previous conversation.

### When to create another session

Create a distinct session only when the outcome changes materially:

- formal requirements reconsideration or a new product decision;
- independent code/architecture review after a green checkpoint;
- final UX/accessibility/visual QA audit;
- post-P0 Stretch Goal planning.

Do not switch sessions for ordinary milestones, bug fixes, tests, or styling iterations within the approved direction.

### Isolation rules

- Never have two sessions write to the same checkout concurrently.
- A review session is read-only unless it receives a dedicated branch/worktree.
- Requirement changes update this context pack, the PRD, Demo Spec, or an ADR before the main implementation continues.
- New sessions must state their exact desired outcome and stopping condition.

## 13. User prompt calibration preference

The user may describe needs imprecisely. Each session should:

1. Restate the effective request as “需求校准”.
2. Surface hidden assumptions that materially affect the result.
3. When later turns clarify the need, state how the earlier prompt should have been written more precisely.
4. Avoid inventing prices, market evidence, technical capabilities, or user willingness to pay.

## 14. Source documents

Read these repository documents for details rather than reconstructing them from memory:

- `docs/demo-spec.md`: canonical demo fixture, route, flow, stage, and P0 acceptance.
- `docs/adr/ADR-001-demo-first-architecture.md`: approved technical boundary and Stretch Goal gate.
- `docs/relay-prd.md`: product, market, user, JTBD, retention, commercial hypotheses, state model, detailed requirements.
- `docs/reviews/2026-08-29-hackathon-requirements-review.md`: multidisciplinary review conclusions and learning notes.
- `report-source.md`: earlier research/report source; use only when a fact is not already captured in the approved documents.

## 15. Starting instruction for a fresh session

Use this concise instruction rather than pasting the previous conversation:

> Read `AGENTS.md` and `docs/handoff/relay-p0-context-pack.md`, then complete the Relay P0 hackathon demo under guarded autonomous execution. Initialize Git safely, maintain a live ExecPlan, use Warm Editorial as the sole design language, verify every milestone before committing, and continue until all P0 acceptance criteria pass. Do not deploy, use paid services, handle credentials, or begin Stretch Goals without explicit authorization.
