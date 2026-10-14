# Plain learner language — implementation evidence

14 October 2026 · Africa/Lagos · Implementation owner: Codex `/root/phase1_engineer`.

The owner asked to remove visible “demo” labels and complex implementation language across the app. This pass changes learner copy, including accessible labels and dialogs, while retaining capability boundaries in everyday words. Internal identifiers and historical technical documentation remain unchanged.

## What changed

- Home now says “Get help with a confusing idea. Start with photosynthesis.” Its short-session and saved-lesson actions are distinct: “Continue session” and “Resume saved lesson.” The session plainly says it is lost on reload or tab closure.
- Entry uses “Show my plan,” “Try photosynthesis,” “Skip question,” “What you’ll learn,” “Your steps,” and “Change the focus.” Unsupported topic and focus notices retain the learner’s words without claiming a generated lesson. Technical rationale strings are replaced only in presentation with short explanations of the selected focus.
- Session removes the implementation eyebrow and repeated action hint. Blocks have simple labels; turns say “You” and “StudyFellow.” Send says the message is here and that replies/checking are not available yet. Checks plainly say answers will not be checked; summary says “What we covered” and “Your answers have not been checked.” The action is “View summary.”
- Sources remain adjacent and keyboard accessible through “Sources.” OpenStax attribution, illustration credit and review status sit inside the disclosure. Diagram caption, alt text and complete scientific explanation remain available.
- The saved lesson uses plain stage titles, score labels (“Which plant” / “Why,” “Shown” / “Not clear yet”), uncertainty help and recovery notices. Example-filled and edited example answers retain “Based on an example,” and summaries explain that these do not show what the learner understands.
- Shared loading/error recovery uses short, direct language. Necessary biology terms remain in the science text.

No route, transition, conservative assessment rule, source URL, source package, save version, validation rule or scoring criterion changed. The scientific teaching paragraphs/prompts are unchanged. The diagram’s nonessential legend says “Materials”; it retains the same scientific relationship. `learner-copy.ts` adapts stored evidence and next-action labels for display; it does not rewrite the saved assessment strings or example-origin booleans. The new in-memory acknowledgment text changed, while its state transitions stayed the same.

## Validation

| Check | Result | Evidence |
| --- | --- | --- |
| `bun run lint` | Passed on final source | Exit 0 before final build |
| `bun run build` | Passed on final source | [Build output](build.log) |
| Full production Playwright suite, desktop/mobile | **44 passed, 4 dev-only skips** | [Production output](production-checks.log) |
| Full development suite | 44 passed; 2 production-only skips; 2 obsolete heading assertions corrected | [Development output](development-checks.log) |
| Corrected saved keyboard/draft/reload cases | Passed both projects in final production suite | Old “Responsive feedback” assertion now matches “Let’s look at your answer”; no behavior change was needed |
| Missing visual and failed lazy import recovery | Passed both projects in development run | These four dev-specific cases are the final production skips |
| Canonical scenario projection freshness | Passed | Existing immutable/freshness test runs in both suites |
| `git diff --check` | Passed | Final source whitespace clean |

Commands used the existing installed Chrome option; no browser or dependency was installed:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
bun run test:e2e -- --workers=3

PLAYWRIGHT_PRODUCTION=1 \
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
bun run test:e2e -- --workers=3
```

Existing regressions now use the new accessible names. Small copy assertions were added inside existing flows to check that implementation labels do not appear in home/session/saved-example content, that examples keep their origin label, and that illustration attribution remains in Sources. Tests still exercise scores, first/retry evidence, draft/reload compatibility, corrupt/unavailable storage, reset cancellation, unchanged saved drafts during new sessions, heading/composer focus, independent scrolling, reduced motion, missing visual fallback and cached offline saved-lesson replay.

Short-phone checks include 320×500 and 375×480 with an expanded route, long answer, Back, summary action and new-message cue together. The reading canvas must remain at least 90px high, controls must fit the viewport, and input growth/shrink must preserve access. Both projects passed on final production source.

## Actual final production captures

These captures show the running app after the copy changes, not mockups.

| Screen/state | Captures |
| --- | --- |
| Home | [Desktop](screenshots/desktop-home.png), [320px](screenshots/phone-home.png) |
| Unsupported topic / retained words | [Desktop](screenshots/desktop-unsupported-entry.png), [Phone](screenshots/phone-unsupported-entry.png) |
| Changed focus / plan | [Desktop](screenshots/desktop-corrected-plan.png), [Phone](screenshots/phone-corrected-plan.png) |
| Short lesson | [Desktop](screenshots/desktop-mini-lesson.png), [Phone](screenshots/phone-mini-lesson.png) |
| Teaching and composer | [1280×900](screenshots/1280-teaching.png), [320×500](screenshots/320-teaching.png), [375×480](screenshots/375-teaching.png) |
| Separate check | [1280×900](screenshots/1280-check.png), [320×500](screenshots/320-check.png), [375×480](screenshots/375-check.png) |
| Expanded steps + long answer + reply cue | [320×500](screenshots/320-transfer-cue.png), [375×480](screenshots/375-transfer-cue.png) |
| Messages | [Desktop](screenshots/desktop-messages.png), [Phone](screenshots/phone-messages.png) |
| Example and Sources | [Desktop](screenshots/desktop-example-sources.png), [Phone](screenshots/phone-example-sources.png) |
| Unchecked summary | [Desktop](screenshots/desktop-summary-preview.png), [Phone](screenshots/phone-summary-preview.png) |
| Saved example answer label | [Desktop](screenshots/desktop-example-answer.png), [Phone](screenshots/phone-example-answer.png) |
| Saved-answer uncertainty | [Desktop](screenshots/desktop-unclear-answer.png), [Phone](screenshots/phone-unclear-answer.png) |
| Saved lesson recovery | [Desktop](screenshots/desktop-saved-recovery.png), [Phone](screenshots/phone-saved-recovery.png) |

## Bundle and limits

Main JS: **624.51kB**. Total app JS assets: **824.826kB**, about **0.054kB smaller** than the Phase 1 build (824.88kB). PWA precache: **18 entries / 829.42KiB**. No dependencies, external fonts or images were added. The existing large-main-chunk warning remains.

This wording pass does not add reply generation, answer checking or reload recovery to the new session. The separate saved lesson retains its existing checks and browser-local storage. Science review and actual learner observation remain outstanding; viewport tests do not prove every real phone/software-keyboard configuration. No commit or deployment was made.

## Changed files

- `src/app/{layout.tsx,route-feedback.tsx}`
- `src/features/learning/content/{learner-copy.ts,session-scenario.ts}`
- `src/features/learning/model/session-store.ts` (acknowledgment text only)
- `src/features/learning/routes/{home-route,start-route,session-route,legacy-start-route,lesson-route}.tsx`
- `src/features/learning/components/{SessionBlocks,SessionChrome,LessonAnswer,LessonPreview,LearningIllustration}.tsx`
- `tests/e2e/{learning,session}.spec.ts`
- This evidence, logs and screenshots.

Independent review: [review.md](review.md), written separately by the reviewer.
