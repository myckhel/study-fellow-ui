# StudyFellow frontend roadmap and delivery tracker

**Updated:** 15 October 2026 · **Scope:** frontend product experience only · **Delivery state:** Phases 0–3 complete within their recorded boundaries, including checked transfer and browser-local v2 continuity. Phase 4 technical hardening and presentation packets are prepared, with owner-walkthrough refinements verified on 15 October; qualified biology review and learner observation remain open, rehearsal conditional and final freeze pending.

Build a convincing one-off tutoring experience: **bring a confusion → tutor proposes an outcome and route → learn through varied steps → ask without losing your place → receive a targeted adaptation → apply the idea → save a useful recap.** The interface should make instructional decisions visible, rather than rely on a presenter to explain the concept.

## Product references and planning boundaries

- [Project specification](../../../outputs/studyfellow-project-spec.md) is the current functional authority; FR and AC references below refer to its requirements and acceptance criteria.
- [Idea and layout sketch](../../../outputs/studyfellow-idea-sketch.md) guides composition. [Photosynthesis demo specification](../../../outputs/photosynthesis-demo-spec.md) remains authoritative for biology content and scoring.
- [Project memory](../../../PROJECT_MEMORY.md) records durable decisions. [Project roadmap](../../../PROJECT_ROADMAP.md) tracks the wider hackathon, research, presentation, and submission work. This file owns frontend delivery sequencing.
- The product serves professionals and secondary-school, college, and university learners. Photosynthesis is the first configured demo, not a claim of general topic coverage.
- Use prepared local scenario content and deterministic transitions. Label simulations and seeded turns clearly. No backend planning, endpoints, live AI, authentication, general uploads, or live media generation belongs in this roadmap.
- Cosmic Observatory is the existing identity: ivory reading surfaces, navy feature areas, gold actions, restrained orbital motifs. Validate composition, density, illustration, and tutor presence against concrete screens before investing in polish.

## Priorities and tracker rules

| Priority | Meaning | Scheduling rule |
| --- | --- | --- |
| P0 | Required to demonstrate the current product promise credibly | Complete before adding scenario breadth or decorative polish |
| P1 | Strengthens clarity, demonstration, or reuse after the core works | Pull only after the preceding P0 gate passes |
| P2 | Useful future enhancement with unresolved need or dependency | Outside the submission-critical path |

**Status:** `Todo`, `Doing`, `Blocked`, `Done`, `Deferred`. Mark Done only with linked acceptance evidence. Owners below are proposed roles, not assigned people; actual capacity is unknown. When starting an item, record a named owner and an evidence link or blocker in its final column. No implementation is authorized or claimed by creating this plan.

**Critical path:** FE-01 → FE-02 → FE-03/04 → FE-05/06 → FE-07/08 → FE-09/10/11 → FE-12 → FE-13 → FE-14/15 → FE-16/17/18 → FE-19/20/21. Dependencies govern order; phase dates are target windows, not staffing estimates.

## Existing foundation — preserve and extend

The repository already contains a React/TypeScript frontend with feature-based routes, theme tokens, local photosynthesis content, conservative rule-based feedback, an explanatory SVG, transfer/retry scoring, and browser-local save/resume. Primary setup now accepts topic/question and optional confusion, with prepared diagnosis/outcome/route and a scenario-driven teaching walkthrough. The main `/session` journey includes contextual clarification, adaptive checks, fresh transfer/retry, truthful recap and validated v2 continuity. Old `/legacy-start` and `/lesson` URLs redirect to the current journey; old saved bytes require confirmed recovery. Send is conversational; Check answer explicitly assesses. Earlier baseline rows and Phase 1/2 evidence retain their historical boundaries.

| Capability | Baseline status | Evidence / implication |
| --- | --- | --- |
| App shell, home/setup/lesson routes, error recovery, Cosmic Observatory theme | Done foundation | [Architecture](../docs/architecture.md); reuse the stack and semantic tokens |
| Deterministic photosynthesis teaching, feedback, transfer/retry, sources | Done foundation | [Content](../src/features/learning/content/photosynthesis.ts), [lesson route](../src/features/learning/routes/lesson-route.tsx); preserve science and first-attempt evidence |
| Versioned local session, drafts, recovery, confirmed reset | Done foundation | [Session store](../src/features/learning/model/study-store.ts); new route/turn state requires new regression evidence |
| Mobile, keyboard, reduced-motion, cached offline checks | Previously verified | Recorded in project memory; rerun relevant checks after changes, do not carry forward a pass automatically |
| Subject review and actual learner observation | Outstanding | Source-backed content is not equivalent to qualified review or validated learner benefit |

## Phase 0 — Lock the experience before rebuilding

**Target:** Tuesday 13 October. **Outcome:** an agreed, compact experience and a bounded first scenario. **Why first:** the current app and revised spec differ in setup, route planning, and lesson interaction; polishing the old flow would leave that gap intact.

| ID | Priority | Deliverable and acceptance | Depends on | Proposed owner | Status / evidence |
| --- | --- | --- | --- | --- | --- |
| FE-01 | P0 | Map the spec to the existing app; document what to retain, change, and remove. Cover entry, diagnosis, inferred route, step types, clarification, adaptation, recap, and resume. | — | Codex `/root/phase0_ux` | Done — [mapping](phase-0/app-spec-map.md); [independent evidence](phase-0/evidence.md) |
| FE-02 | P0 | Produce annotated mobile and desktop compositions for entry/plan, conversational teaching, adapted route, separate check, and recap. Owner feedback is captured on density, visual hierarchy, illustration, and interaction; one revised direction is recorded. | FE-01 | Codex `/root/phase0_visual` + project owner | Done — [owner feedback and direction v2](phase-0/design-decisions.md); five paired [compositions](phase-0/index.html), including separate check; [independent recheck](phase-0/evidence.md) |
| FE-03 | P0 | Author a versioned photosynthesis package with initial confusion, diagnosis, inferred outcome, planned steps, source-linked blocks, assets, transfer rubric, and three immutable simulation paths: ready, misconception, and clarification. Preserve existing biology/scoring requirements; label review status. (FR-1–5; AC-3/10) | FE-02 | Codex `/root/phase0_ux` | Done as definition — [active scenario v2](phase-0/photosynthesis.v2.json), three complete paths validated/reviewed against revised FE-02; subject review pending (FE-16) |
| FE-04 | P0 | Define a frontend state/transition table covering step identity, added/skipped steps, separate answer and clarification drafts, ordered turns, attempts, provenance, and resume. Specify unknown-input fallback and incompatible saved-session recovery. | FE-02 | Codex `/root` | Done as definition — [state/transition contract](phase-0/frontend-contract.md) aligns with one visible session composer and separate checks; [review evidence](phase-0/evidence.md) |

**Exit gate:** the owner can see the intended experience, and every P0 behavior has a prepared example and an explicit transition. No broad UI rebuild starts without this shared reference. Subject review must be completed before presentation claims of reviewed teaching.

## Phase 1 — Bring the tutor-planned session to life

**Target:** Tuesday 13–Wednesday 14 October. **Outcome:** one learner can enter a confusion, understand the proposed route, and begin a visually varied session.

| ID | Priority | Deliverable and acceptance | Depends on | Proposed owner | Status / evidence |
| --- | --- | --- | --- | --- | --- |
| FE-05 | P0 | Replace goal-first setup with topic/question plus optional confusion. Make prepared sample entry immediate; at most one focused diagnostic follow-up, with unsure/skip. Unsupported topics explicitly offer the sample without pretending to generate a lesson. (FR-1; AC-1) | FE-03/04 | UX + frontend | Done — [implementation and checks](phase-1/evidence.md); [independent approval](phase-1/review.md). New checks/summary remain explicitly unassessed previews; v2 save deferred. |
| FE-06 | P0 | Show a plausible precomputed outcome and compact route. Allow correction of the interpretation; supported corrections select a prepared alternative, unsupported ones explain the boundary and retain input. No required custom-goal field or schedule setup. (FR-2; AC-2) | FE-05 | Frontend + content | Done — [implementation and checks](phase-1/evidence.md); [independent approval](phase-1/review.md). New checks/summary remain explicitly unassessed previews; v2 save deferred. |
| FE-07 | P0 | Build the session composition: one-off mode, compact route, dominant current-step canvas, calm tutor voice, one generic session chat composer, and relevant response actions. Show learner checks separately on explicit continuation. On phones, the route collapses without obscuring the current step or controls. | FE-02/04/06 | Visual design + frontend | Done — [implementation and checks](phase-1/evidence.md); [independent approval](phase-1/review.md). New checks/summary remain explicitly unassessed previews; v2 save deferred. |
| FE-08 | P0 | Render distinct explanation, diagram, worked-example, learner-prompt, mini-lesson, and recap blocks from scenario data. Essential teaching has text equivalents; images carry alt text, captions, and provenance; factual claims have nearby source access. (FR-3/5; AC-4/9) | FE-03/07 | Frontend + visual design | Done — [implementation and checks](phase-1/evidence.md); [independent approval](phase-1/review.md). New checks/summary remain explicitly unassessed previews; v2 save deferred. |

**Exit gate:** from a clean start, a judge sees why the tutor chose an outcome, what it plans to teach, and how the teaching surface changes. The flow is usable on a phone and clearly identified as a prepared demo.

## Phase 2 — Prove clarification and adaptation

**Target:** Wednesday 14 October. **Outcome:** the UI behaves like an interruptible tutor, with visible responses to learner evidence. This phase carries the strongest uniqueness and engagement proof.

| ID | Priority | Deliverable and acceptance | Depends on | Proposed owner | Status / evidence |
| --- | --- | --- | --- | --- | --- |
| FE-09 | P0 | Respond to learner messages inline through one session composer; questions, statements and uncertainty all support contextual clarification. Preserve current step, plan, internal check draft, and scroll/focus context. Unknown feedback explains the demo limit. Teaching and checks remain sequential; continuation is explicit. (FR-3; AC-5) | FE-04/08 | Frontend + content | Done — contextual Send, exact draft/help restoration, explicit continuation and bounded fallback; [evidence](phase-2/evidence.md), [independent approval](phase-2/review.md). |
| FE-10 | P0 | Add targeted example/prerequisite steps for misconception or partial evidence; make the route change visible with a concise reason and ask a different follow-up. Unclear answers request clarification instead of optimistic scoring. (FR-4; AC-6) | FE-03/04/08 | Frontend + content | Done — guided/follow-up assessment, targeted support, visible route-change reasons and conservative ambiguity handling; [evidence](phase-2/evidence.md), [approval](phase-2/review.md). |
| FE-11 | P0 | Demonstrate a ready path that skips redundant teaching, plus unsure/another-example actions. Keep outcome intact, preserve first attempts separately from retries, and prevent timer-based or accidental advancement. (FR-3/4) | FE-10 | Frontend | Done within Phase 2 — ready skips redundant teaching, unsure/example actions, immutable first attempts and explicit advancement; transfer/retry scoring stays FE-13. [Evidence](phase-2/evidence.md), [approval](phase-2/review.md). |
| FE-12 | P0 | Add an unobtrusive demo path selector/reset and replay all three paths end to end. Seeded turns, authored tutor responses, and actual typed input remain distinguishable; editing seeded input does not erase its origin. Unknown free text cannot silently become a scripted success. (AC-3/8) | FE-09/10/11 | Frontend + product | Done within approved Phase 2 boundary — three editable example paths reach unchecked transfer/summary previews, retained example origin and confirmed replacement. Assessed end-to-end completion awaits FE-13. [Evidence](phase-2/evidence.md), [approval](phase-2/review.md). |

**Exit gate:** the same scenario visibly follows three distinct paths. A clarification does not lose work; a misconception changes the route; readiness avoids repetition. A presenter does not repair state manually or claim live AI. **Met for the approved Phase 2 boundary:** three paths replay through working clarification/adaptation into unchecked transfer/summary previews. Assessed end-to-end completion remains FE-13.

## Phase 3 — Close the loop and preserve continuity

**Target:** Wednesday 14–Thursday 15 October. **Outcome:** the learner can see what they demonstrated, what remains uncertain, and where to return.

| ID | Priority | Deliverable and acceptance | Depends on | Proposed owner | Status / evidence |
| --- | --- | --- | --- | --- | --- |
| FE-13 | P0 | Integrate a fresh transfer task and criterion-level feedback into the scenario experience. Recap separates completion from demonstrated understanding, initial from retry results, simulated from learner evidence, and includes unresolved points, source, and one next action. (FR-4/6; AC-7/10) | FE-12 | Content + frontend | Done — fresh transfer/retry criteria, separate immutable results, truthful recap and independent remaining uncertainty; [evidence](phase-3/evidence.md), [approval](phase-3/review.md). |
| FE-14 | P0 | Extend local persistence to scenario/version, inferred outcome, changed route, current step, both draft types, turns, attempts, provenance, and recap. Reload during clarification/adaptation restores a coherent session; incompatible old snapshots have explicit recovery. (FR-6) | FE-04/13 | Frontend | Done — validated v2 snapshot, ordered evidence, both drafts/help context, immediate/debounced saves and explicit old/corrupt recovery; [evidence](phase-3/evidence.md), [approval](phase-3/review.md). |
| FE-15 | P0 | Make resume the secondary home action with topic, last useful step, and next action. Saved/not-saved state is accurate; leaving flushes drafts; reset/switch warns before replacing the single saved session. Storage failures permit learning in the open tab. | FE-14 | UX + frontend | Done — single resume action, useful step/next action, truthful save status, flushed Leave and confirmed replacement; in-tab failure recovery; [evidence](phase-3/evidence.md), [approval](phase-3/review.md). |

**Exit gate:** complete a fresh-transfer check, leave mid-session, reload, and resume without losing the learner's place or misrepresenting results. Local continuity remains distinct from accounts or cross-device sync. **Met:** final desktop/mobile production and cached-offline resume pass; separate independent approval recorded.

## Phase 4 — Validate, harden, and freeze the demo

**Target:** Thursday 15 October; Friday 16 October is submission contingency, not planned feature capacity. Exact submission cutoff/timezone is unknown. **Outcome:** a credible, repeatable demonstration and reviewable frontend evidence.

| ID | Priority | Deliverable and acceptance | Depends on | Proposed owner | Status / evidence |
| --- | --- | --- | --- | --- | --- |
| FE-16 | P0 | Obtain qualified review of photosynthesis explanations, diagrams, branches, transfer task, and rubric; fix material errors. Record reviewer, date, changes, and remaining limits. | FE-03/13 | Content reviewer + product | Doing — Codex prepared packet; owner arranges external review, pending — [biology packet](phase-4/biology-review.md). No qualified approval claimed. |
| FE-17 | P0 | Observe a small number of relevant learners, targeting 2–3 if recruitment permits. Check unaided entry, inferred-plan comprehension, finding clarification, understanding adaptation/feedback, and resume. Record hesitation and fix the most consequential issues. If unavailable, record the gap; teammate walkthroughs are usability checks, not learner validation. | FE-15 | UX + product | Doing — Codex prepared script; owner arranges recruitment, pending; 0 learner observations — [script and recording form](phase-4/learner-observation.md). |
| FE-18 | P0 | Verify three paths, skipped diagnosis, unsupported input, missing asset, first/retry evidence, interruption, corrupt/unavailable storage, route errors, and clean restart. Run lint/build and meaningful interaction regressions; link results. | FE-15; fixes from FE-16/17 | Frontend + reviewer | Done for current technical scope — Codex phase4_engineer/coordinator; independent phase4_reviewer approved after fixes. Latest completion-feedback/motion candidate: focused development16 and fault recovery4 passed; full production120 passed/4 expected skips/zero failures and independent approval recorded in [current evidence](phase-4-polish/evidence.md), [current review](phase-4-polish/review.md). Lint/build/contracts passed. Recheck later external findings. |
| FE-19 | P0 | Check 320/375px and desktop layouts, keyboard/focus, readable contrast, accessible labels, text equivalents, non-color status, and reduced motion. Measure added assets/bundle against recorded 797.04 kB total JS baseline; verify cached offline replay after activation and honest first-visit/source-link limits. Fix blockers; document remaining limitations. | FE-18 | UX + frontend + reviewer | Done for focused technical scope — current home/entry/examples/Send, 320/375px compound states, keyboard, contrast, labels and cached offline verified. [Latest evidence](phase-4-polish/evidence.md), [approval](phase-4-polish/review.md); [initial contrast audit](phase-4/visual-audit.md). Physical phone/full accessibility audit remain gaps. |
| FE-20 | P0 | Rehearse a 3–5 minute demonstration: confusion → inferred route → diagram → clarification → adaptation → fresh check → resume. Keep alternative path entry quick; prepare screenshots/recording fallback, credits, and a concise Codex build/iteration record. | FE-16/18/19 | Product + presenter | Conditional — [updated controls, captures and walkthrough](phase-4-polish/README.md); current automated interaction run 2.73s/zero errors, not human delivery. Historical paced run 210.03s. Qualified content review and human presenter rehearsal pending. |
| FE-21 | P0 | Freeze the frontend, fix only demonstration blockers, and record the build/version, supported behavior, known limits, and run instructions. Hand off to the wider submission tracker; no deployment or submission is implied by this item. | FE-20 | Frontend + product | Pending — [technical candidate/freeze handoff](phase-4/freeze.md); no final freeze, deployment or submission claimed. |

**Exit gate:** the primary and alternate paths are repeatable on the presentation device, content-review status and validation gaps are explicit, and fallback materials preserve the same story.

## Phase 5 — Expand the proof only after the core passes

**Target:** optional before freeze if all P0 gates pass; otherwise post-submission. **Outcome:** demonstrate reuse without trading away the quality of the first lesson.

| ID | Priority | Deliverable and acceptance | Depends on | Proposed owner | Status / evidence |
| --- | --- | --- | --- | --- | --- |
| FE-22 | P1 | Author a second credible scenario with a distinct learner context, diagnosis, explanatory visual, three paths, sources, reviewed content, and fresh transfer task. Existing instructional-design and catch-up contacts are research leads, not ready lessons. | FE-16/18/19; concrete topic and reviewer available | Content + product | Todo |
| FE-23 | P1 | Render the second scenario with the same frontend blocks and transitions, without a topic-specific screen fork. Verify switching/reset, resume versions, sources, and simulation labels; reuse is demonstrated by working behavior. | FE-22 | Frontend + reviewer | Todo |
| FE-24 | P1 | Add further reviewed packages toward the spec's “several scenarios” ambition only if each adds distinct instructional value and passes the same gates. Record the exact shipped count; three paths of one topic do not count as three scenarios. | FE-23 | Product + content | Todo |
| FE-25 | P1 | Refine interaction feedback: purposeful transitions, button/form states, inline turn arrival, and route-change cues. Keep motion brief, optional, and subordinate to readability; verify reduced motion and no layout jumps. | FE-19; visual direction from FE-02 | Visual design + frontend | Scoped owner-requested motion implemented in Phase 4 polish — plan items, new blocks/replies and completion cues; reduced motion and no replay checked. [Evidence](phase-4-polish/evidence.md). Further polish deferred. |

**Exit gate:** additional topics strengthen scalability evidence through actual reuse. One reviewed scenario with three excellent paths is the minimum fallback; fewer packages than the full spec asks for must be disclosed as a scope reduction.

## Later frontend backlog — outside this sprint

| ID | Priority | Opportunity | Prerequisite for prioritization | Status |
| --- | --- | --- | --- | --- |
| FE-26 | P2 | Recurring study-plan setup, catch-up, reminders, and richer session history | Evidence of recurring need; consent and persistence behavior defined later | Deferred |
| FE-27 | P2 | Material ingestion, live tutoring/generation, account and cross-device experiences | Backend planned separately; real capabilities/contracts and failure behavior established before UI promises | Deferred |
| FE-28 | P2 | Reviewed multilingual, audio/voice, richer modality controls | Target learner need, language/content review, accessibility, and data-cost evidence | Deferred |
| FE-29 | P2 | Institutional views, long-term mastery, collaboration, payments | Validated adopter/payer workflows and trustworthy longitudinal evidence | Deferred |

## Delivery decisions and cut rules

- **Cut order if time slips:** further scenarios → second scenario → extra motion/polish. Keep inferred route, explanatory visual, inline clarification, adaptive branch, fresh transfer, truthful provenance, and local resume.
- **Scope checkpoint:** at the end of 14 October, if the Phase 2 gate is not met, stop breadth work and simplify the route renderer to the minimum blocks needed for photosynthesis. Preserve the tested assessment/storage logic rather than replacing it wholesale.
- **Freeze target:** end of 15 October in Africa/Lagos. Confirm the actual Friday cutoff in the wider project tracker; reserve submission time instead of assuming a full extra build day.
- **Capacity:** owners and estimates are unassigned. Once capacity is known, size P0 items first; do not promise all phases within the dates simply because they are listed.
- **Main risks:** unvalidated visual taste (FE-02), content review/recruitment availability (FE-16/17), saved-session migration (FE-14), brittle arbitrary-input expectations (FE-05/09/12), and bundle/device cost (FE-19). These risks affect scope and claims, not just presentation polish.
- **Judging value:** route/clarification/adaptation show Uniqueness; reusable reviewed packages and text-first design support a bounded Scalability story; implementation evidence supports Codex Usage; a rehearsed resilient story supports Presentation. The owner-provided rubric gives each 25%.

## Progress and evidence log

| Date | Change / decision | Evidence / next action |
| --- | --- | --- |
| 2026-10-13 | Created frontend-only phased tracker against the revised spec; distinguished tested foundations from planned tutor-session behavior. Backend remains a later planning task. | Next: start FE-01/02, assign owners, and lock the smallest credible photosynthesis package before rebuilding. No runtime changes or new test results in this planning pass. |
| 2026-10-13 | Started FE-01–04: mapped current app, created isolated four-state mobile/desktop review board, versioned photosynthesis package with three complete paths, and v2 state/transition contract. | [Package and run instructions](phase-0/README.md); [checks and independent draft approval](phase-0/evidence.md). FE-02 remains Doing pending owner feedback and revision; FE-03/04 conditional drafts. Production unchanged; no commit/deployment. |
| 2026-10-13 | Owner requested one bidirectional session chat input accepting any feedback, and a separate Your turn flow. Implemented revised compositions, active scenario v2 and contract; retained original v1. FE-01–04 complete as definitions. | [Exact feedback and revised direction](phase-0/design-decisions.md); [19 preview checks, 15 width/state captures, 70-turn v2 validation and independent approval](phase-0/evidence.md). Next: Phase 1 production implementation; biology/learner review remains outstanding. No separate post-revision visual approval claimed. |
| 2026-10-13 | Owner refined session geometry: bottom dock, actions above, inline Send and expanding input; response content stays in independent scroll region. Updated mockups/spec/contract and retained active scenario v2 semantics. | [Direction v3](phase-0/design-decisions.md); [layout checks](phase-0/evidence.md). Phase 0 remains definition-only; no production changes. |

| 2026-10-14 | Completed FE-05–08: topic/confusion entry, optional diagnosis, prepared corrected outcome/route, six scenario block kinds, separate checks and bottom conversational composer. Legacy assessments/v1 saves retained separately; new state is open-tab only and unassessed. | [Evidence and production captures](phase-1/evidence.md); [independent approval after source/layout fixes](phase-1/review.md). Lint/build passed; full dev 46 passed/2 skipped; final production 22 passed/2 skipped. Total JS 824.88 kB (+3.49%). Unconfirmed transient development reload recorded. Next: FE-09–12; no commit/deployment. |

| 2026-10-14 | Owner requested real-product wording and simple language. Updated learner labels, notices, example answers, sources and error messages; retained science, checks, saves and routes. | [Plain-language evidence](plain-language/evidence.md); [independent review](plain-language/review.md). Final production 44 passed/4 dev-only skips, lint/build passed. Future learner copy follows updated AGENTS.md. |

| 2026-10-14 | Started FE-09–12 under the approved Phase 2 plan: explicit answer checks, contextual Send/help, visible adaptive route and editable example paths. Transfer scoring/recap and persistence stay Phase 3; newer entry/envelope spec refinements are outside this change. | UX/visual exploration complete; implementation and independent review pending. FE-12 replay stops at unchecked transfer/summary previews until FE-13. |

| 2026-10-14 | Completed FE-09–12 within approved Phase 2 boundary: contextual replies, explicit guided/follow-up checks, immutable evidence, adaptive route reasons and three editable example paths. Independent reviewer approved after matter-negation and short-phone geometry fixes. | [Evidence/logs/captures](phase-2/evidence.md), [review](phase-2/review.md). Lint/build passed; final production 62 passed/4 expected skips, zero failures. JS 839.718 kB (+1.80% against Phase 1), no new dependencies/assets. Next FE-13–15; no commit/deployment. |

| 2026-10-14 | Completed FE-13–15: checked transfer/retry, evidence-based recap including independent unresolved explanations, and one validated browser-local v2 save/resume. Old saves recover only through confirmed replacement; no migration or parallel save flow. | [Evidence](phase-3/evidence.md), [independent approval](phase-3/review.md). Final production 82 passed/4 expected dev-only skips; lint/build passed. App JS 738.801 kB (-12.02% against Phase 2), main 651.220 kB; no dependencies/assets, commit or deployment. Next Phase 4 content/learner review and hardening/rehearsal. |

| 2026-10-14 | Started approved Phase 4 hardening/rehearsal. Prepared qualified-biology and learner-observation packets without outreach; desktop Chrome is presentation target. Visual audit identified faint enabled Input borders/placeholders, corrected with existing theme tokens; added genuine keyboard traversal and successful reset/reload regressions. | [Brief](phase-4/brief.md), [evidence](phase-4/evidence.md). Final lint/build/contracts passed; production 88 passed/4 expected skips/zero failures; all six new keyboard/reset/contrast checks passed. Paced automated rehearsal 210.03s, zero page errors; candidate JS 738.868 kB (+67 bytes from Phase 3). [Review](phase-4/review.md). Development watcher/reload failures and unchanged stable rerun are recorded honestly. FE-16/17 open, FE-20 conditional, FE-21 pending. |

| 2026-10-15 | Addressed owner walkthrough: neutral home overview, sample prefill with explicit continuation, answer-like diagnostic options, current-step examples separated from Restart, owner-confirmed mode-aware Send and concise recap labels. Mixed canonical example origins resume without changing schema. | [Brief](phase-4-feedback/brief.md), [evidence](phase-4-feedback/evidence.md), [review](phase-4-feedback/review.md). Full development 106 passed/2 expected skips; final focused 16 passed after help-copy fix; final production 104 passed/4 expected skips/zero failures, both cached-offline resumes. Lint/build/contracts passed. JS 735.104 kB / main 650.772 kB; no dependencies/science change, commit/deployment/submission. Owner feedback is not learner validation; FE-16/17 open, FE-20 conditional, FE-21 pending. |

| 2026-10-15 | Addressed owner completion-feedback/motion observations: broader home lead, plain criterion sentences, decisive correct-answer cues, optional further reading after all-clear recap, brief new-content/list/reply entrances with static reduced-motion and no resume replay. | [Current evidence](phase-4-polish/evidence.md), [independent review](phase-4-polish/review.md). Display-only adapters preserve canonical content/scoring/storage; focused development16 and dev-only fault4 passed, lint/build/contracts passed. Current total/main JS740.614/650.783kB, precache748.78KiB. Final full production120 passed/4 expected skips/zero failures; both cached-offline checks passed and independent approval recorded. External gates unchanged. |
