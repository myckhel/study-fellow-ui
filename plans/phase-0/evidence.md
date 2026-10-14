# Phase 0 acceptance and verification

13 October 2026 · Coordinator `/root` · Independent reviewer `/root/phase0_review`

## Acceptance matrix

| Requirement | Prepared evidence | Status |
| --- | --- | --- |
| FE-01: all eight areas, retain/change/remove | [App/spec map](app-spec-map.md), inspected current routes/store/assessors | Done; independently reviewed |
| FE-02: five paired annotated compositions | [Browser board](index.html), numbered per-state notes, [15 captures](screenshots/) at 320/375/1280px | Done; owner feedback captured and direction v2 implemented/rechecked |
| FE-03: versioned complete scenario | [Active JSON package](photosynthesis.v2.json): nine stable steps, six block types, sources, asset/text fallback, G3P/conditions, rubric, 70 turns across three full paths | Done as definition; independently reviewed against v2; biology review pending |
| FE-04: identities, turns, drafts, provenance, resume | [Contract](frontend-contract.md), transcript events and fallbacks | Done as definition; independently reviewed against v2; runtime v2 not implemented |
| Unknown/skip/partial/retry examples | Skipped diagnosis in clarification path; unsupported topic/question and partial/unknown answer examples; misconception path preserves first 1/2 and different retry 2/2 | Authored walkthrough evidence; not production regressions |
| Clarification preserves work | Transcript draft/ask/response/explicit-return events; interactive preview preserves text and current step | Preview checked; future reload behavior specified only |
| Explicit adaptation | Transcript insertion/skip reason and trigger identities; adapted composition added-step label/reason | Prepared evidence; production route remains fixed |
| Owner feedback and resulting revision | [Decision log](design-decisions.md) | Done: exact feedback and v2 revision recorded; no separate post-revision approval claimed |

## Initial direction checks (historical)

- Coordinator ran `bun plans/phase-0/verify-package.mjs`: PASS, nine stable steps, 68 ordered/provenanced turns and eight assessments match existing production rules. Validated source and step references, route insertion/skip identity, clarification step/draft preservation, complete paths and isolation of mutable copies. The independent reviewer reran it successfully. This validates authored data, not a production scenario runner.
- Preview author ran JavaScript syntax check and 15 Playwright checks using installed Chrome: all four states have no overflow at 320/375/1280, zero page errors, clarification retains draft, explicit return precedes advancement, keyboard route disclosure, source access, reduced-motion parity, unsupported topic retention and board selectors. These initial captures were superseded by the v2 revision; current captures are linked below.
- Independent reviewer directly verified all twelve width/state combinations, paired board frames, keyboard route disclosure, 3px focus/44px controls, clarification preservation and return focus, heading focus after step change, unknown-question fallback and reduced motion. Visually inspected mobile and desktop captures and manually walked all three transcripts against the contract.
- Coordinator visually inspected phone teaching and desktop adaptation. Opened and verified the review board in the connected Chrome browser for owner review.
- `bun run lint`: PASS after artifact creation. `bun run build`: PASS. Main JS 624.36 kB; total app JS approximately 797.04 kB; PWA precache 797.84 KiB. These match the recorded production foundation. Existing large-main-chunk warning remains. Preview files are outside the production entry/build and precache.

## Independent verdict and corrections

**Initial verdict: approved for prepared-draft review. Revised direction: approved after owner-feedback implementation and independent recheck.** The owner-feedback/revision deliverable is satisfied; this does not assert a separate post-revision approval or scientific review.

Corrected during review: two current route entries, clarification prematurely advancing to recap, unsuitable seeded retry wording, missing explicit continuations and duplicate continuation in the misconception transcript, partial-route definition and supported-correction/next-step wording. Mobile diagram labels stack for readability. Sources remain beside authored teaching. These corrections are technical revisions, not a substitute for FE-02 owner feedback.

Remaining limits: no qualified biology review, target-learner observation, runtime inferred-plan renderer, dynamic route playback, v2 persistence or storage migration. Mockups deliberately do not assess typed answers or save sessions. The full production regression suite was not rerun because production code was not edited; the build/lint and bounded data/preview checks cover this change.

## Owner-directed revision v2 — verified

Owner feedback: one session chat input; any feedback can clarify; teaching should feel like bidirectional tutor chat; “Your turn” should be a separate flow. The exact message and resulting decisions are in [design-decisions.md](design-decisions.md).

- Teaching/adapted compositions now have one generic Message your tutor/Send composer, chronological typed learner and authored tutor turns, and no simultaneous answer field or explicit Ask form. Non-question feedback stays at the current teaching step. Explicit Continue opens the separate check; Back preserves each context's draft and prior exchanges. Typed strings render as text, including markup-like content.
- Preview author verified 19 browser checks with zero page errors and refreshed 15 state/width screenshots. Independent reviewer directly verified all five states at 320/375/1280px, single input, multiple exchanges, same-step retention, keyboard Send/composer focus, safe text rendering, reduced motion, check heading focus, unknown-check fallback, and draft/history retention on Back/Continue.
- Coordinator reran `bun run lint` and `git diff --check` after the revision: PASS. Production files and dependencies were unchanged, so the prior successful build remains applicable.
- Active package `photosynthesis.v2.json` validates nine stable steps, 70 ordered/provenanced turns and eight assessments matching the unchanged production rules. Its clarification path now includes teaching feedback plus a separate check interruption preserving a response draft. Original v1 remains unchanged and its 68-turn validator also passes. Science/rubric unchanged; authored interaction version changes are explicit.
- Revised [phone teaching](screenshots/teaching-375.png), [desktop teaching](screenshots/teaching-1280.png), and [separate check](screenshots/check-1280.png) show the current direction. The coordinator visually inspected the revised compositions; independent reviewer inspected mobile teaching and desktop check.

**Independent v2 verdict: approved; no remaining blockers.** FE-01–04 are complete as definition/review deliverables. Remaining science, learner-validation and runtime limits above are still applicable.

## Handoff

Use the revised mapping, v2 scenario and frontend contract for Phase 1. Keep checks sequential and the single session composer contextual. Implement the contract in production before claiming actual dynamic route playback or v2 resume. No additional permission gate is invented for the completed owner-directed revision.


## Owner layout revision v3 — bottom composer

Owner requested a bottom-anchored message input, actions above it, inline Send and input growth, with response-dependent content kept in a scrollable region. The preview now uses a viewport-height session, a reserved composer dock and separate keyboard-accessible teaching/conversation scroll region. Text input expands upward to a bounded 160px/24% viewport cap, then scrolls internally and shrinks on Send. Mobile uses dynamic viewport height and safe-area spacing; preview frames are 812px (phone) and 900px (desktop).

Typed “show another example” appends a labeled authored analogy to the conversation without replacing the original teaching or advancing the step. Earlier reading position stays stable; a new-reply cue offers a jump when the reader is away from the bottom. Actions remain above the inline input/Send row.

Author verification: 18 geometry/interaction checks passed, including all 15 state/width combinations (320/375/1280), pinned dock during content scroll, input growth/cap/shrink, short 320×500/320×600/375×600 layouts, focus, safe text rendering, original-content retention and appended example. Fifteen screenshots refreshed. Coordinator inspected [phone teaching](screenshots/teaching-375.png) and [desktop teaching](screenshots/teaching-1280.png). Scenario v2 validation remains PASS (9 steps/70 turns/8 assessments); no semantic package/science change. Production remains unchanged.

**Independent verdict: approved.** Reviewer directly verified 15 teaching/adapted/check geometry cases at 320×812, 375×812, 1280×900, 320×500 and 375×480: dock within viewport, content/dock boundaries meet without overlap, actions above inline Send, bounded expansion/shrink, append-only requested example preserving original teaching and reading scroll, new-reply cue/jump, keyboard focus, unknown-check behavior and draft round trips. Corrected an inherited desktop grid-column rule on phones and re-reviewed it. Coordinator lint and diff-whitespace checks passed. Real-device virtual keyboard behavior was not exercised; short responsive viewports were checked.
