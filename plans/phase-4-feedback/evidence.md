# Owner walkthrough follow-up — evidence

> Historical candidate: the latest completion-feedback and motion changes, fingerprint and verification are in [Phase 4 polish](../phase-4-polish/README.md).

15 October 2026 · Africa/Lagos · Technical verification passed; independent verdict in [review](review.md)

## Owner observations and resulting behavior

1. Fresh home taught photosynthesis too early: a neutral learning-journey panel now introduces the product, with topic availability and actual resume separate.
2. Try photosynthesis advanced unexpectedly: it now fills topic and empty confusion only, preserves existing confusion, confirms replacement of a different topic, and leaves explicit Continue to advance.
3. Diagnosis choices did not read as answers: a direct materials question, full-width answer statements and a separate Skip action retain the original diagnostic IDs/route mapping.
4. Example path controls unexpectedly restarted: ordinary current-step Example words only fill drafts; whole-session replay is separately labeled with Restart and confirmation.
5. Send versus Check answer was ambiguous: one Send action checks in unanswered answer mode and converses in teaching/help/after submission; explicit Continue and conservative uncertainty remain.
6. Repeated recap warning was heavy: short Example answer/edited labels and one neutral explanation preserve origin without repeating “not your understanding.”

## Ownership and acceptance

UX and visual specialists supplied read-only proposals. The coordinator merged the [brief](brief.md). One engineer owns affected runtime/tests and rehearsal-script adaptation. A separate reviewer must inspect final changes without authoring fixes. The coordinator owns this evidence and durable tracker updates.

No scientific rubric, source, scenario content, dependency or save wire-shape/version change is intended. Internal example insertion accepts validated current-step path/seed IDs; storage validates each origin independently of selected replay path so ordinary sessions can combine examples. Checks for forged/cross-step seeds, chronological evidence, route history and immutable submitted answers remain.

## Checks and corrections

- Initial focused owner-feedback checks: **16 passed**, zero failures ([log](focused-initial.txt)).
- Full development: **106 passed, 2 expected production-offline skips, zero failures** ([log](development.txt)). This run preceded the final help-mode hint/message-label correction; the affected checks and full production must cover the final copy.
- Final limited help-copy/message-label fix: **16 focused desktop/mobile checks passed**, zero failures ([log](focused-final.txt)); final lint and build passed ([lint](lint.txt), [build](build.txt)).
- Final full production: **104 passed, 4 expected development-only fault-injection skips, zero failures (3.2 minutes)** ([log](production.txt)). Both desktop/mobile cached-offline resume-and-completion checks passed; all three prepared paths and all 16 new checks passed against final bytes. No clean-run failure was hidden or retried away in this follow-up.
- Projection freshness, canonical validator (9 steps, 70 ordered turns, 8 assessments), rehearsal-script syntax and diff whitespace passed ([contracts](contracts.txt)).

Tests run with frontend text writes stopped; logs and transient captures stay in /tmp during development runs to avoid watcher reloads. Chrome executable is /Applications/Google Chrome.app/Contents/MacOS/Google Chrome, with three Playwright workers.

Independent early review identified repeated save-draft insertion duplicating
usedSeeds (invalid saved state) and post-attempt conversation buttons doing
nothing. The engineer deduplicated seed IDs and permits conversation-only examples after attempts; independent store probes and the focused mixed-origin/repeat-insertion tests rechecked both fixes. A later review caught answer-mode guidance remaining visible in Help. The engineer branched the hint, added both-direction mode assertions, and distinguishes Example message from Example answer. Final focused checks and direct independent production inspection rechecked the correction.
Expanded Example words plus multiline drafts/help/uncertainty preserve the
short-phone reading/dock geometry at 320×500 and 375×480 in the final focused regressions; no horizontal overflow or controls below the viewport. The reviewer directly measured the 320px expanded state with a 238px canvas and dock ending at 500px.

[Captures](screenshots/) include fresh production home/prefill/diagnosis at 320px and desktop, final Help mode, ordinary examples, both short-phone compound states, and ten ordered production walkthrough frames. The ordinary-example desktop review capture precedes the final copy-only label adjustment; the final Help capture and focused compound frames show corrected mode labels. No physical-phone test is claimed.

## Candidate and presentation evidence

The independent reviewer directly inspected neutral home, prefilled input, 320px diagnosis, ordinary current-step examples, mixed-origin reload and answer-versus-conversation Send. Independent final production Help inspection confirms the help hint, message labels, draft preservation and restored answer hint. The [refreshed build manifest](build-manifest.json) records the current build rather than reusing earlier Phase 4 hashes. It enumerates source/config inputs and every emitted file; it is not a complete environment/Tailwind scanning manifest.

| Measure | Current candidate | Comparison |
|---|---|---|
| Total minified app JS | 735,104 bytes | −3,764 bytes / −0.509% from previous Phase 4; −7.771% from original 797,040-byte baseline |
| Main JS | 650,772 bytes | Previous Phase 4 651,287 bytes; existing large-chunk warning retained |
| PWA precache | 12 entries / 743.01 KiB | Previous Phase 4 746.46 KiB; no device startup claim |

No added dependency, external asset, backend or save wire-shape/version. The internal useExample optional path/seed inputs and origin validation are described in architecture.md. All 40 enumerated inputs and 14 emitted artifacts were independently hash-checked.

The [updated automated production walkthrough](rehearsal-result.json) finished in **7.91 seconds of interaction-only execution**, zero page errors, exact leave/reload/resume draft restoration, checked recap and ten fresh ordered screenshots ([log](rehearsal.txt)). This is not paced narration or a new 3–5 minute human rehearsal. The earlier 210.03-second paced run remains historical; use the updated script/controls and record human delivery separately. Cached revisits require prior service-worker activation; first visits and external source pages require connectivity. Earlier Phase 4 hashes/captures remain historical and
must not be presented as measurements of this changed build.

## Outstanding external gates

Qualified biology review, 0 relevant-learner observations, human presenter timing,
physical-phone/software-keyboard and low-end performance remain outstanding.
Owner feedback and automated example results do not establish learner outcomes.
FE-20 stays conditional and FE-21 pending; no commit, outreach, deployment or
submission is authorized or performed by this follow-up.

## Handoff

Current technical evidence supersedes the earlier Phase 4 candidate. Final independent approval is recorded separately in [review.md](review.md). Owner observations are addressed, with no science/rubric change or capability expansion. Biology review and target-learner observation remain open; FE-20 conditional and FE-21 pending. The runtime build is a technical candidate, not a final freeze, deployment or submission.
