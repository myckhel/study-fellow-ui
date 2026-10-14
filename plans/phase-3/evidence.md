# Phase 3 — implementation and validation evidence

14 October 2026, Africa/Lagos. Implements FE-13–15. Independent review is recorded in `review.md`; implementation ownership does not constitute approval.

## Working behavior

- Explicit Check answer now assesses guided/follow-up plus fresh transfer/retry. Send remains conversational and never scores or advances. Unclear wording keeps drafts until clarification or explicit unresolved submission. A lower first result adds one different retry with targeted help; original and retry results remain immutable and separately visible.
- Recap separates finishing the flow from answer evidence, prediction from energy reasoning, and first from retry results. Edited example inputs remain labeled as examples. Sources and a concise main-idea disclosure remain available; the recap dock contains navigation instead of a composer. The latest unresolved explanation remains visible independently of a correct plant comparison; a sound follow-up clears the earlier gap. Review does not overwrite submitted answers.
- One browser-local `studyfellow.session.v2` snapshot preserves scenario/schema versions, inferred outcome, route/history, step, separate answer/conversation drafts, help/clarification context, ordered turns, attempt times and example identity. Validation checks reachable route/history and attempt ordering; assessments/feedback/recap are rebuilt from the same rules used for submission. Forged scores cannot change reconstructed results; inconsistent feedback, future attempts or reordered evidence are rejected.
- Draft saves debounce 250ms; transitions/navigation/interruption flush immediately. Saved status requires successful storage. Denied reads/writes still permit in-tab learning. Failed reset/removal retains the existing session and does not report success. A compact unsaved status/Retry stays in the dock; the full loss warning is in the reading area so short-phone controls do not crowd out the lesson.
- Home keeps Learn now primary and one secondary resume with topic, useful step and next action. Completed sessions offer a saved summary only when successfully saved; unsaved completion offers an in-tab summary. v1-only, corrupt and incompatible records require explicit recovery; cancellation retains exact bytes. No automatic migration. Retired old lesson URLs redirect without producing a second v1 save.

## Validation

Installed Chrome: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`; three Playwright workers. Suites run sequentially to avoid shared artifact collisions.

- Full development: **76 passed, 2 expected production-offline skips**, zero failures. [Log](development-final.log). After final copy/uncertainty additions, affected development checks: **36 passed, 2 expected offline skips**, zero failures. [Log](development-last.log). Final remaining-gap wording precision: **2 passed**. [Log](recap-precision.log).
- Final `bun run lint` and `bun run build`: passed. [Lint](lint.log), [build](build.log). Existing large-main-chunk warning remains. Generator `--check`, canonical package validator (9 steps/70 turns/8 assessments) and `git diff --check` passed.
- Final full production: **82 passed, 4 expected development-only skips**, zero failures. Both cached-offline saved-draft resume checks passed. [Log](production.log). The four skips cover dev import/visual fault injection, verified in development.
- Coverage carries the retired v1 browser guarantees into the current session: criterion/first-retry evidence, interruption, ambiguous answers, recovery/cancellation, storage failures, keyboard, route errors and production offline resume. Retired goal/file/time/optional-practice screens are no longer public product flows. Pure v1 boundary validation and conservative-assessment regressions remain. Existing session tests retain unsupported input/corrections, sources, missing visuals, route changes, scroll/focus, reduced motion and example-path replay.
- Additional regressions cover restored edited examples, both draft types during uncertainty/help, score recomputation, forged feedback/frontier/chronology, incomplete first → improved retry, unresolved retry, completed review/resume, pending-draft Leave, unknown snapshot versions, and independent unresolved/corrected matter explanations.
- Layout checks cover 320×500, 375×480 and desktop. An extra compound denied-save + unclear-answer phone probe found a 40px reading region/overlap; fixed by compact dock status plus reading-area warning. The final regression passes with separate scroll area, accessible Retry/help/composer and no overflow. Reviewer visually inspected these captures.

## Exploration and corrections

Early runs are not final evidence: concurrent authoring caused stale expectations/status-locator ambiguity and artifact cleanup collisions. A later full run passed 66 checks but found two bad recovery fixtures: they injected corrupt bytes into a running app whose interruption flush removed those bytes before restore. Fixtures now seed storage before bootstrap. A Leave→reload race now waits for home navigation. An intermediate rerun was interrupted deliberately before the short-phone notice fix. Final logs above distinguish these runs from verified checks.

Independent review found and rechecked feedback tampering, impossible route-frontier evidence, chronological attempt links/timestamps, uncertain-help restoration, completed Home destination, stale unchecked copy, unsaved-summary wording, and independent remaining-explanation uncertainty. No reviewer authored runtime fixes.

## Bundle and limits

Final minified app JS assets: **738,801 bytes** (738.801 kB), down 100,917 bytes / **12.02%** from Phase 2 839.718 kB. Main JS: **651.220 kB** (up from 624.51 kB); PWA precache: 12 entries / **745.67 KiB**. Retiring old route payloads reduces total emitted JS; this is not a claim of measured device startup improvement. No dependencies, external assets, backend, accounts, sync, commits or deployment were added.

Replies and assessment remain bounded English rules and prepared content. Qualified biology review, actual learner observation and real-device software-keyboard checks remain outstanding. Cached offline revisits require prior online service-worker activation; first visit and external source pages need connectivity. Browser clearing and closing an unsaved tab cannot be recovered. Phase 4 owns content/learner review and rehearsal/freeze.

## Browser evidence

Captures in [screenshots](screenshots/) include desktop/mobile first-and-retry recap, edited example recap, unresolved transfer, independent unresolved/corrected matter explanation, saved recovery, storage failure, 320px recap, and 320px compound failure geometry. Production captures replace corresponding development captures after the final run.
