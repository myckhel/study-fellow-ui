# Phase 4 — hardening and presentation evidence

> 15 October: this packet records the earlier technical candidate. Owner-observation changes are tracked in [the follow-up packet](../phase-4-feedback/README.md); use its final fingerprint and validation for the current app.

14 October 2026 · Africa/Lagos · FE-16–21 · **Technical checks passed; independent verdict recorded in [review](review.md). External gates remain open.**

## Change and ownership

Read-only UX/visual audits retained the existing composition and identified two coverage gaps and one contrast defect. The engineer added genuine Tab/Shift+Tab traversal, successful confirmed reset/new-session/reload evidence clearing, and alpha-composited enabled-input contrast regressions. The only runtime change sets existing muted tokens for Input border and placeholder; decorative card borders, focus/hover and disabled controls retain existing behavior. No API/schema changes, dependencies, external assets, new topics, live model, commit, deployment or submission.

Engineer owns the biology/observation packets and theme/tests; coordinator owns this evidence, rehearsal/freeze/scripts and durable trackers; visual specialist owns the visual audit/pre-fix captures. Independent reviewer does not author implementation fixes. The [brief](brief.md) records acceptance and scope.

## External review and validation status

- [FE-16 packet](biology-review.md): qualified review not arranged, approval pending. Covers actual explanations, diagram/text equivalent, branches, transfer/retry and rubric; findings/re-review form is blank.
- [FE-17 script](learner-observation.md): recruitment not arranged, **0 relevant learner observations**. Facts, interpretation and assistance are recorded separately; target 2–3 if recruitment permits. No outreach was sent.
- Automated tests, presenter inputs and engineering review are not learner validation or qualified science approval. Physical-phone/software-keyboard/low-end performance testing remains outstanding.
- [FE-20 rehearsal](rehearsal.md) is conditional; [FE-21 final freeze](freeze.md) remains pending. The candidate manifest is technical evidence only.

## Actual checks

Chrome executable: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; full suites use three workers, stable focused development uses two. Suites run sequentially with separate logs.

- Initial lint/build passed before hardening. Final lint and production build after the Input change passed; main-chunk warning remains. [Final lint](lint.txt), [final build](build.txt).
- Scenario projection freshness, canonical package validator (9 steps, 70 ordered turns, 8 assessments) and diff whitespace checks passed. [Contract checks](contracts.txt).
- Initial full development: **83 passed, 2 expected production-offline skips, 1 failure**. [Initial run](development-initial.txt). The failing mobile edited-example case timed out looking for a button inside a closed disclosure. Trace inspection found a new document GET `/session` between Continue and that button lookup, followed by fresh Vite/React bootstrap, without a test-requested reload in that interval. Theme hot updates occurred earlier in the same run; exact reload initiator is unproven. Development evidence should be collected without editing frontend files, since Vite can reload the document and close native disclosures. The ready path/current transfer and saved session remained intact. This run is not claimed as a clean pass.
- Affected development: **17 passed / 1 failure** ([log](development-focused.txt)), including all **6 new desktop/mobile keyboard/reset/contrast checks passing**. The same mobile disclosure case again encountered an unsolicited development document reload while evidence files were being written. After all frontend text writes stopped, that exact test passed unchanged: **1 passed**, no failure ([stable-tree rerun](development-stable.txt)). Thus affected Phase 3 and new Phase 4 cases pass across both projects; neither earlier run is presented as clean. Final full production: **88 passed, 4 expected development-only skips, zero failures (2.8 minutes)** ([log](production.txt)). Both cached-offline desktop/mobile draft-resume-and-completion checks passed, all six new regressions passed, and the affected mobile edited-example flow passed. The four skips cover import/visual fault injection exercised in development.

## Coverage map

| Requirement | Current checks / evidence |
|---|---|
| Three paths; explicit clarification/adaptation/skips | phase2 example-path tests and current session tests; no silent success for unknown wording |
| Skipped diagnosis; unsupported input/corrections | session and learning entry helpers; unsupported-topic/correction retention test |
| Missing visual, caption/text/source retained | development session missing-visual fault injection (production skip is deliberate) |
| First/retry, example/typed and unresolved evidence | assessment, phase2/3 and learning recap tests |
| Interruptions; both drafts/help; leave/reload/resume | learning/session/phase3 persistence tests |
| Corrupt/old/unknown/unavailable storage | learning/session/phase3 recovery, cancellation and denied-storage tests |
| Route/import errors and clean restart | learning route recovery; new confirmed-reset regression validates exact clean stored evidence after reload |
| Keyboard and focus | new real Tab/Shift+Tab entry/disclosure/source/composer/Leave/resume test; existing heading handoff/Enter checks |
| Responsive, text equivalents, status labels and reduced motion | [visual audit](visual-audit.md), session 320/375/desktop and compound phone regressions |
| Contrast | token audit plus new computed alpha-composited input boundary ≥3:1 and placeholder ≥4.5:1 tests |
| Cached offline | production desktop/mobile test waits for service-worker control before disconnecting, reloads, restores draft and finishes checks |

The selected text pairs passed the focused audit; this is not complete WCAG or screen-reader certification. Pre-fix audit screenshots are explicitly historical. The independent reviewer directly probed the final production build: border and placeholder are rgb(86,97,118), placeholder opacity 1 on rgb(255,253,248), approximately 6.14:1. [Final 320px](screenshots/final-320.png), [375px](screenshots/final-375.png), [desktop](screenshots/final-1280.png) were visually inspected; widths, canvas/dock geometry and control access retain the audited layout. Final verdict is recorded separately.

## Bundle and candidate

[Build manifest](build-manifest.json) records every emitted file's bytes/SHA-256, build-input hash, frontend HEAD and dirty-state qualification. No release commit was created.

| Measure | Phase 4 candidate | Comparison |
|---|---|---|
| Total minified app JS under dist/assets | 738,868 bytes | +67 bytes / +0.009% from Phase 3 738,801; −58,172 bytes / −7.299% from original 797,040 |
| Main JS | 651,287 bytes | +67 bytes from Phase 3 651,220; existing >500kB warning |
| CSS | 24,619 bytes | Build output records actual generated stylesheet; no new font/image dependency |
| PWA precache | 12 entries / 746.46 KiB | Phase 3 745.67 KiB; this is precache volume, not device startup speed |

No new shipped external visual assets; screenshots are review artifacts outside dist. CSS is generated through the existing Tailwind build. Cached offline revisits require previous online activation/reload. First visits and external OpenStax pages require connectivity. No cross-device sync or recovery after browser-cleared storage; unavailable storage allows learning only in the open tab. Setup input is not saved until Begin session.

## Rehearsal, fallback and gate disposition

The production desktop script traverses the exact prepared route and records timed beats, screenshots and browser errors. Automated pacing and human narration are separate. The [recorded production rehearsal](rehearsal-result.json) completed in **210.03 seconds (3:30.03)** with Chrome **155.0.8059.40**, 1280×900 and reduced motion, **zero page errors**, exact restored transfer draft, checked recap and ten ordered screenshots. [Beat log](rehearsal.txt). This is automated paced execution, not a human speaking-time measurement. Independent verdict is recorded separately. Human presentation-device rehearsal remains pending. Ordered screenshots preserve the same teaching/clarification/adaptation/check/resume story.

FE-16/17 remain open; FE-18/19 technical checks pass and their approval is governed by the separate independent verdict. Reopen affected checks for later consequential external findings. FE-20 remains conditional; FE-21 pending. Confirm exact submission cutoff with the organizer; no deployment or submission is implied.
