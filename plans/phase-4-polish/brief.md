# Completion feedback and motion — 15 October 2026

Owner asks for broad-product home copy, decisive successful-step feedback, restrained animations for listed/new content, plain answer-check language, and a recap that feels complete after success. This is presentation hardening of the existing configured journey, not a new subject, assessor, backend or mastery claim.

## Behavior and copy

- Home lead: “Get help with a confusing idea, one clear step at a time.” Remove subject-specific marketing from home/How it works. Keep an actual saved session's topic and explain current topic coverage at setup rather than branding the product around the fixture.
- Render a reusable feedback presentation derived from each immutable attempt. Keep canonical stored feedback/turn text, scoring, route/history, version and storage validation unchanged. Older saves get the new presentation without migration.
- Certain sound guided/follow-up: success check and “Step complete,” with a short explanation of the connection demonstrated. Certain full transfer/retry: “Check complete,” with a plain sentence saying the answer chose the right plant and explained how light helps it make sugar. For examples refer to “This example answer,” retaining origin/edited labels.
- Partial: “One part is clear,” name what is correct and what to add. Zero or misconception: supportive targeted correction. Uncertainty takes precedence over score and never gets a success cue. Submission and continuation remain separate, preserving drafts/help/focus.
- Recap criteria become “Which plant makes sugar faster” and “How light energy helps,” with “Clear” / “Needs another look” and plain explanations rather than raw Prediction/Energy reasoning/Shown terminology.
- Latest certain full transfer and no unresolved guided explanation: positive “Session complete”; next section “Keep exploring (optional),” with optional source reading. The same objective completion applies to example answers, without claiming the learner personally demonstrated understanding.
- Full transfer with unresolved guided explanation: “Session finished,” acknowledge final comparison is complete and name the earlier explanation needing attention. Retain targeted review. Partial/uncertain final result: neutral finish and specific next action. Keep first and retry evidence separate; successful retry can close the check without rewriting the first answer.

## Motion specification

Existing CSS/WAAPI or Motion only; no new asset/dependency. Plan rows on reveal: 180ms opacity/4px upward entrance, 35ms stagger capped 140ms. First live forward entry of session blocks: 180ms, 30ms stagger capped 90ms. New adaptive route entries: 180ms/35ms stagger. New tutor replies: 160ms/4px. New definite success: restrained 180ms accent; persistent check/label/border provides the meaning. Recap arrival uses calm gold progress feedback; green requires a complete certain check and no unresolved explanation.

Use an in-memory route-instance seen registry keyed by session, step, turn and attempt. Initialize it from existing session content on mount, including completed/current steps and historical routes/turns/attempts. Re-baseline on replacement. Mark events seen before animation. No result replay on reload, Leave/resume, Back, review, draft edits or unrelated rerenders. Step entrance must distinguish first forward progress from revisiting. No whole-session/canvas/composer remount by step; focused headings stay outside animated wrappers.

No continuous motion, confetti, scaling celebrations, height/layout animation, delayed navigation, exit waits or forced smooth scrolling. Preserve focus/follow-scroll and the new-reply cue. Controls remain usable immediately. Reduced motion renders the same static result immediately without translation/stagger; WAAPI must honor the preference explicitly.

## Ownership and checks

UX/visual specialists provide read-only proposals; coordinator merges decisions. One engineer owns runtime/tests and rehearsal-script text assertions; coordinator owns documents/evidence/fingerprint/trackers. A different reviewer must approve after corrections.

Check typed/example full success, partial/uncertain, retry improvement, successful transfer with unresolved earlier explanation, saved feedback byte compatibility, no subject marketing on fresh home, actual animation behavior versus reduced motion, no replay on reload/revisit, rapid input/navigation, focused headings/composer, preserved scroll/drafts, and 320×500/375×480 dock geometry. Run meaningful focused checks then appropriate full regressions, lint/build, canonical freshness/validator. Keep frontend text writes stopped during development checks. Current build/captures supersede previous candidates; external biology/learner/human/device gates and final freeze remain open.
