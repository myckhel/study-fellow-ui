# Phase 2 — implementation and validation evidence

14 October 2026, Africa/Lagos. Implements FE-09–12 in the existing photosynthesis session. Independent review is recorded separately in `review.md`; implementation ownership does not constitute approval.

## Working behavior

- Contextual prepared replies cover light/food, energy/materials, chlorophyll, uncertainty, and another example. Unknown messages—including unrelated messages containing a topic keyword—receive a plain limit and supported options. Send never assesses, changes the route, or advances. In check mode it keeps the answer draft.
- One composer uses separate answer/conversation drafts. Need help and Return to answer preserve exact text and typed/example origin. Recognized Check answer appends ordered learner/tutor turns, keeps a frozen attempt, shows feedback and route-change reason, and waits for Continue. Completed checks remain conversational on revisit.
- Sound guided answers visibly skip the redundant example. Material misconceptions add energy/materials plus a distinct follow-up; partial energy answers add the energy bridge and follow-up. Unknown/contradictory text keeps its draft; explicit Continue with help commits uncertain evidence and targeted support. Stable entries and attempt guards prevent duplicate checks/steps. Original route and linked route-change history remain available in state.
- Follow-up assessment reuses the unchanged legacy guided assessor, with a conservative matter-distinction boundary. Original text is retained; only clearly attributed quoted statements can be excluded from interpretation. Negated matter claims, energy/matter reversals, missing distinction, and explicit trailing denial ask for clarification rather than claiming success.
- Collapsed Example paths lives above the heading in the canvas. Ready, Misconception and Clarification provide editable learner seeds one action at a time through ordinary Send/Check/Continue actions. Seed/path/turn identity and edited flags remain attached. Confirmed replacement/reset can be cancelled without losing work. The frozen generated projection includes relevant authored clarification/fallback/branch data and learner seeds, excluding scripted transfer scores, retry assessment and assessed recap turns.
- Transfer and summary remain honest unchecked previews. Guided evidence is checked; the new-situation answer is not. No new storage, API, dependency, asset, deployment or commit. Existing local v1 lesson data and assessment remain intact.

## Validation

Commands use installed Chrome via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`, three Playwright workers. Assertion deadlines remain unchanged; the overall test budget is 60 seconds for longer replay/reload paths.

- [`bun run lint`](lint.log): passed. [`bun run build`](build.log): passed, with the existing large-main-chunk warning. `git diff --check`: passed. Generator freshness and recursively frozen canonical data are verified by the session suite.
- Full development suite: 63 passed, 2 expected production-cache skips, 1 compound 375×480 layout failure. That regression exposed 74px reading space with long edited example, uncertainty actions and expanded route. Final CSS keeps 44px controls, caps long textareas on short screens, uses a compact independently scrolling route and moves New reply out of the dock into a reading-area overlay. The corrected affected suite passed 39 of 40 checks; one installed-Chrome scrolling timeout happened on Begin session before reaching the session. Its isolated rerun passed (1/1), with no further runtime change. All four compound checks passed after correction. See [full development log](development-full.log), [corrected suite log](development-corrected.log), and [isolated rerun](development-isolated.log).
- Final full production suite: **62 passed, 4 expected skips** (development-only import/visual fault injection), no failures. Both cached-offline legacy resume checks passed. See [production log](production.log). All three example paths and final 320/375 compound layouts passed in both projects.
- An earlier exploratory run during implementation had stale test expectations, per-test 30-second total deadlines and hot-reload interruptions. It is not final validation evidence. Those issues were corrected before the frozen validation run above.
- Coverage: ready/material/energy/unclear branches, contradictory wording, explicit unresolved continuation, quoted follow-up and negated matter assertions, route history and frozen first attempts, repeated checks/revisits, exact answer-draft restoration, unknown keyword messages, all three replay paths, edited example identity, cancellation, source links, text fallback, saved legacy drafts, corrupt/failing storage, legacy assessment and offline cached resume.
- Browser sizes include 320×500, 375×480 and 1280×900, keyboard heading/composer focus, earlier reading position and New reply cue, reduced motion, no horizontal overflow, and independently scrolling content above an entirely visible dock.

## Bundle and scope limits

Final app JS assets total 839,718 bytes (839.72 kB), up 14.84 kB / 1.80% against the recorded Phase 1 824.88 kB. Main JS is 624.51 kB; session route 10.92 kB; session store/projection 22.98 kB. PWA precache: 18 entries, 844.18 KiB. No dependencies or external assets were added; the existing main-chunk warning and total precache download cost remain.

FE-12 replay evidence reaches transfer/summary previews through real Phase 2 transitions. Assessed end-to-end completion awaits FE-13; this phase supplies neither transfer scoring nor evidence-based completed recap nor durable v2 saving. Replies and assessments are bounded English rules and authored content, not general model generation. Biology teacher review and real learner observation remain outstanding. Reload/closed tab loses the new session, while the separate existing saved lesson stays intact.

## Browser evidence

- Three replay route changes: [Ready desktop](screenshots/desktop-phase2-ready-route.png), [Misconception desktop](screenshots/desktop-phase2-misconception-route.png), [Clarification desktop](screenshots/desktop-phase2-clarification-route.png).
- Honest previews: [Ready summary](screenshots/desktop-phase2-ready-summary.png), [Misconception summary](screenshots/mobile-phase2-misconception-summary.png), [Clarification summary](screenshots/mobile-phase2-clarification-summary.png).
- Final compound phone captures: [320×500](screenshots/desktop-phase2-320-compound.png), [375×480](screenshots/desktop-phase2-375-compound.png). Independent direct probes: [320](screenshots/phase2-review-fixed-320.png), [375](screenshots/phase2-review-fixed-375.png), [desktop ready](screenshots/phase2-review-desktop-ready.png).
