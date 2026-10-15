# Completion feedback and motion — evidence

15 October 2026 · Africa/Lagos · Technical candidate; external gates open.

## Owner feedback addressed

- Home introduces the broader product: “Get help with a confusing idea, one clear step at a time.” Topic availability stays in setup; an actual saved topic still appears on resume.
- Correct guided responses say “Step complete”; successful transfer says “Check complete”. A persistent check and border accompany the words. Partial/uncertain results remain calm and name the missing connection.
- “Prediction: shown. Energy reasoning: shown.” becomes “Which plant makes sugar faster” and “How light energy helps”, with Clear / Needs another look and plain sentences.
- A fully correct check with no earlier unresolved explanation ends with “Session complete” and “Keep exploring (optional)”. Sources are further reading. Example answers stay labeled; completion never claims mastery or learner improvement. A real earlier gap still appears separately even when the final comparison is correct.
- Plan lists, new teaching blocks, added route entries and tutor replies get brief entrances. Motion is 160–180 ms with small stagger and 4px movement. The input remains stationary. Back, draft edits, reload and resume do not replay success cues. Reduced motion and browsers without the animation API retain equivalent static feedback.

## Scope and ownership

Read-only UX/visual specialists proposed copy and motion; the coordinator merged the [brief](brief.md). One engineer owns runtime/tests. A separate reviewer owns [final approval](review.md). These are product-owner observations, not learner validation.

Feedback is adapted only for display. Scoring, canonical feedback strings, immutable evidence, v2 wire shape and source content remain unchanged from the prior owner-feedback candidate. Tests explicitly round-trip old stored evidence. No dependencies or assets were added.

## Checks

Checks ran sequentially: lint, build, scenario freshness, package validation, focused development, development-only failure injection, then full production. Frontend text writes stopped throughout development tests to avoid Vite document reloads; logs stayed in /tmp.

- [Lint](lint.txt), [build](build.txt), [scenario freshness and canonical validation](contracts.txt) passed (9 steps, 70 ordered turns, 8 assessments).
- [New focused development checks](development-focused.txt): **16 passed**, zero failures, desktop/mobile. Includes actual animation API/keyframe checks, reduced motion, static fallback, no replay, focus and 320×500 dock geometry, plain feedback, retry/uncertainty, example origin and unchanged stored bytes.
- [Development-only visual/import failure recovery](development-fault.txt): **4 passed**, zero failures.
- [Final full production](production.txt): **120 passed, 4 expected development-only skips, zero failures (4.0 minutes)**. All three paths, both cached-offline resume/completion checks and all16 new checks passed against final bytes. No failed run was retried away. The previous candidate's full development106 passed/2 expected skips is historical; this follow-up does not claim a second full development run.

The full production suite reuses all prior paths, skip/unsupported input, first/retry evidence, interruptions, corrupt/unavailable storage, route recovery, clean restart, keyboard, labels, contrast, non-color state, text equivalents and offline coverage. Layout checks cover 320px, 375px, short-phone and desktop. Physical-phone/software-keyboard and a full accessibility audit remain gaps.

## Build and connectivity

[Manifest](build-manifest.json) identifies enumerated source/config inputs and every emitted artifact. It is not a complete environment/content-scanner manifest; HEAD is not a release commit.

| Measure | Current candidate | Comparison |
|---|---|---|
| Total minified app JS | 740,614 bytes | −56,426 / −7.079% against original 797,040; +1,813 / +0.245% against Phase 3 738,801; +5,510 / +0.750% against prior feedback 735,104 |
| Main JS | 650,783 bytes | +11 against prior 650,772; existing chunk warning remains |
| All emitted assets | 765,864 bytes | JS + CSS; +5,913 from prior feedback 759,951 |
| CSS | 25,250 bytes | Included in artifact fingerprint |
| Precache | 12 entries / 748.78 KiB | No new external assets or dependency |

Artifact SHA-256: `10a553410e0fb52bbc0cd9e87b112abebdf1436c5133ab9a215c8249de36cb81`.
Input SHA-256: `f81a703dad8c36e083cfb3db162c0c1a3fbff71ca9694c76878dec2e69f91b79`.
Desktop Chrome **155.0.8059.40**, Bun **1.3.3**. Production preview port 5174; development port 5173. Three Playwright workers use the installed Chrome executable. Cached offline replay requires prior service-worker activation; first visits and external source pages require connectivity. No low-end device startup/performance claim.

## Presentation and freeze

The updated [automated walkthrough](rehearsal-result.json) ran in **2.73 seconds of interaction-only execution**, zero page errors, including exact draft leave/reload/resume and checked recap. This is not human speaking time. [Ten ordered fallback screenshots](screenshots/) follow confusion/plan → diagram → clarification → adaptation → support → fresh check → leave → restored draft → results → sources. The prior paced 210.03-second narration budget is historical; human 3–5 minute presentation-device rehearsal remains pending. Run/alternate-path instructions are in [README](README.md) and the previous [rehearsal guide](../phase-4/rehearsal.md); use current screenshots and mode-aware Send controls. Existing source/asset credits and Codex iteration record remain in that guide; this iteration adds presentation-only feedback and restrained motion, verified through specialist review and regressions.

Final production passed; independent scoped technical approval is recorded in [review](review.md). Qualified biology review, **0 relevant-learner observations**, human rehearsal and physical phone/software keyboard remain outstanding. FE-20 conditional; FE-21 pending. After final freeze, only demonstrated blockers should change the build, followed by focused rechecks and a new fingerprint. No outreach, second scenario, backend/live AI, deployment, submission or commit was performed.
