# FE-21 — Technical candidate and freeze handoff

**Final freeze: pending.** This handoff identifies a tested technical candidate; it is not submission approval, deployment, or evidence of completed external validation. FE-16 qualified biology review and FE-17 relevant-learner observation remain open; FE-20 is conditional on content review. Human presenter timing and physical-phone/software-keyboard checks remain outstanding.

## Candidate identity and run instructions

Use [build-manifest.json](build-manifest.json) for frontend HEAD, dirty-state qualification, build-input hash and SHA-256/size of every emitted file. HEAD alone cannot reproduce uncommitted changes. The aggregate artifact hash identifies this build's bytes; compare again after changes or a rebuild. The source/config input list is not a complete build-environment or Tailwind content-scan manifest. Ignored `dist/` is generated locally and is not committed. See [evidence](evidence.md) for actual checks/browser and [rehearsal](rehearsal.md) for exact run commands, supported clean-start route and fallback.

From frontend root: `bun install --frozen-lockfile`; `bun run build`; `bun run preview --host 127.0.0.1 --port 5174 --strictPort`; open `http://127.0.0.1:5174` in desktop Chrome. This is a local run, not a published site. A future host must provide SPA fallback for client routes and serve asset paths normally; hosting verification is outside this handoff.

## Supported behavior

One English photosynthesis scenario with three example paths; optional diagnosis and prepared route/focus choices; explanation, SVG/text diagram, analogy, prompts and support steps; contextual bounded clarification; explicit conservative answer checks; route additions/skips; separate immutable first/retry and example/typed evidence; criterion-level recap and remaining uncertainty; one validated browser-local save with drafts/help/route/evidence, confirmed recovery/replacement, and in-tab learning when storage fails.

## Known limits and gate owners

| Item | Status / next owner action |
|---|---|
| Qualified biology approval | Pending; owner arranges reviewer using biology-review.md, records findings, fixes and re-review. |
| Relevant learner observations | 0; owner arranges sessions using learner-observation.md and triages consequential findings. |
| Human presentation rehearsal | Pending; presenter records actual timing/device and repeat result in rehearsal.md. Automated timing is separate. |
| Physical phone / software keyboard / low-end device | Not tested; browser viewports are simulations, not physical-device performance evidence. |
| General AI / topic coverage | No live model, uploads, generated plans, backend, accounts, sync or other topics. Limited English recognition can misunderstand valid wording. |
| Entry refinements | Setup/diagnosis/plan remains the current entry; newer conversation-first/structured-response ideas are separately scoped. |
| Saving | Starts after Begin session; setup drafts are not durable. Browser clearing or failed storage plus tab closure can lose work. No cross-device recovery. |
| Offline | Cached revisits require online activation and reload first. First visits and external source pages need connectivity. |
| Bundle | Main-chunk warning remains; compare actual totals in evidence. No low-end startup measurement or claim of speed improvement. |
| Canonical metadata | guided.advanceCriteria still says partial adds example; runtime/fallback uses energy-bridge plus follow-up. Review packet flags this non-executable historical shorthand. |
| Submission | Exact Friday 16 October cutoff/timezone unknown. Owner verifies; no submission/deployment authorized here. |

## Blocker-only change policy

From this candidate onward, accept only defects that prevent the core teaching/check/resume story, introduce material scientific error, make essential actions inaccessible, lose work, or misstate capabilities. Defer new topics, architecture changes and optional polish. Any accepted runtime/content correction requires affected regressions, lint/build, projection/package validation when applicable, updated manifest/captures, and independent re-review; scientific corrections also require qualified re-review. Do not reuse old fingerprints or test claims for a changed build.

Close FE-21 only when FE-16/17/18/19 and FE-20 prerequisites pass and the owner records the final build/version and accepts remaining disclosed gaps. Until then retain the explicit pending status. Hand this packet to the wider submission tracker without checking off submission, portal upload or deployment.
