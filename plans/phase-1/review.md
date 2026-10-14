# Independent Phase 1 review

14 October 2026 · Africa/Lagos · Reviewer: Codex `/root/phase1_review`.

**Verdict: approved for FE-05–08.** No remaining blocking findings in the agreed Phase 1 teaching walkthrough. This approval does not cover Phase 2 assessment/adaptation or Phase 3 v2 persistence.

## Acceptance assessed

- FE-05/06: topic and optional confusion, explicit prepared sample, one optional recall, unsure/skip, tentative precomputed outcome, ordered route, supported interpretation correction, and unsupported text retention. There is no required goal or schedule; arbitrary input does not manufacture a lesson.
- FE-07: lazy session route, independent feature-local in-memory state, compact navy desktop route and phone disclosure, separate current teaching/check surfaces, explicit navigation, one generic composer with inline Send, preserved per-step drafts, and honest open-tab resume/reset behavior. Teaching messages append typed/authored turns without assessment or advancement.
- FE-08: six data-driven block types, diagram text equivalent/caption/provenance, factual source access, conservative preview summary, and reproducible frozen projection of canonical v2 data. Canonical simulation transcripts are excluded from the runtime projection.
- Legacy boundary: copied setup matches the previous staged setup; the Phase 1 diff leaves the legacy store, assessment and content unchanged. Legacy lesson redirects to `/legacy-start`; saved/corrupt v1 records remain separate from the new walkthrough.

## Findings fixed and re-reviewed

1. **Blocking, resolved — `/session`, worked example / `SessionBlocks.tsx`:** the authored analogy contained factual statements but empty block source references hid available step sources. Implementation now combines block and step references. Reviewer directly opened the example disclosure and verified both OpenStax links; regression coverage verifies source access.
2. **Blocking, resolved — `/session`, 320px header:** brand and header controls previously clipped Reset. Compact mobile sizing now keeps Reset's right edge at 304px within a 320px viewport. Directly verified.
3. **Blocking, resolved — `/session`, short-phone composer/route:** long input, an expanded route, wrapped summary actions and the reply cue could leave only 40–86px for reading; empty input could retain its expanded height. Final bounded textarea, compact actions/cue, explicit empty height and short-screen route cap preserve reading space. Direct final 320×500 compound transfer state has a 106px reading region and dock ending exactly at 500px; its heading is fully visible. Send clears input, shrinks it below 60px and preserves focus. Regression covers the combined state at 320×500 and 375×480.

## Evidence and verification

Reviewer independently read the actual Phase 1 diff and affected routes, store, content projection, block renderer, styles and tests against repository guidance, project memory/spec and the revised Phase 0 contract. Reviewer authored no implementation fixes.

Direct installed-Chrome checks exercised 320×500, 375×480 and 1280×900 geometry, reduced-motion emulation, expanded route/long draft, transfer plus reply cue, header boundaries, Send focus/clearing/shrink, source disclosure and keyboard Tab from composer to Send. Final phone compound geometry and the supplied production desktop summary screenshots were visually inspected.

Supplied logs were inspected: full desktop/mobile dev regressions **46 passed / 2 production-only skipped**; final production session and cached-offline legacy checks **22 passed / 2 dev-only fault-injection skipped**; final lint/build passed. The missing-visual fallback is supported by passed dev regression evidence, not an independent reviewer fault injection. Valid legacy draft preservation and corrupt-save isolation are supported by test evidence plus source review. Final bundle evidence records 824.88kB total JS, +27.84kB (+3.49%) against the recorded baseline, with no added dependencies or bitmap assets.

The final affected dev run had one unexplained 1280px full reload that cleared ephemeral state. Its isolated rerun passed, and both final production 1280 cases passed. The trigger remains unconfirmed; this review does not claim it was fixed. It is a disclosed development limitation rather than a reproduced production acceptance blocker. See [implementation evidence and logs](evidence.md).

## Limits and subsequent review

Real-device software keyboards/browser chrome, qualified biology review and learner observation remain unverified. The existing main-chunk warning remains. Source links require a connection; cached offline verification applies after service-worker activation. Phase 1 messages are bounded authored acknowledgments, checks/summary are unassessed previews, and new state intentionally does not survive reload or tab closure.

Re-review is required when contextual replies, assessment/adaptive transitions, simulation playback or v2 persistence are introduced. That review must verify typed/seeded provenance, immutable attempts, first/retry evidence, conservative unknown-input handling, internal conversation/check draft continuity and old-save recovery against the fuller v2 contract.
