# FE-20 — Desktop Chrome rehearsal and fallback

14 October 2026 · Africa/Lagos · **Conditional: qualified biology review pending.** This packet demonstrates working frontend behavior, not learning effectiveness. Human presenter rehearsal remains to be recorded separately from automation.

## Run and prepare

From `system/study-fellow-ui`: `bun install --frozen-lockfile`, `bun run build`, then `bun run preview --host 127.0.0.1 --port 5174 --strictPort`. Open `http://127.0.0.1:5174` in desktop Chrome. Use the recorded candidate's manifest and evidence; rebuild/recheck after runtime changes. Do not use another learner's browser profile. Use a clean presentation profile or the supported confirmed Reset. No login is needed.

First visit needs connectivity. For offline presentation, visit online first, wait for service-worker activation and reload before disconnecting. External source pages still need connectivity. Keep this packet and the screenshot fallback available locally; screenshots are static evidence, not an interactive lesson. Pre-session topic/confusion/diagnostic fields are not saved before Begin session. After beginning, check actual save status before relying on reload.

## 3:30–4:00 speaking script

| Time | Action and exact input | Point to explain |
|---|---|---|
| 0:00–0:30 | Learn now; topic `photosynthesis`; optional confusion `I think light might be food for plants`; Show my plan → Skip question. Read outcome/route; Begin session. | Learner comes with a confusion; one available topic and prepared route. Diagnosis is optional. |
| 0:30–1:05 | Show diagram and text equivalent. Send `Does light turn into sugar?` | Light supplies energy while water/CO₂ supply materials. Clarification stays in context; Send does not check or advance. |
| 1:05–1:40 | Continue; answer `Light is food for plants`; Check answer. Point to Route changed. | Learner evidence changes the route; this is bounded authored content and English rules, not live AI generation. |
| 1:40–2:25 | Continue to Energy and materials; Continue; answer `Light provides energy to help build sugar. Water and carbon dioxide are materials.`; Check answer; Continue through worked example to Apply the idea. | Targeted teaching leads to a different follow-up. Original evidence remains separate. |
| 2:25–3:00 | Draft `Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.` Leave; reload home; Continue session. | The exact draft and place return from one browser-local save. No account or cross-device sync. |
| 3:00–3:30 | Check answer → View summary. Show prediction/energy evidence and Read the sources. | Completion and answer evidence are separate. These presenter answers prove behavior, not a measured learner gain. |
| 3:30–4:00 optional | Explain evidence limits and next step. | One English photosynthesis scenario, three paths; qualified biology review and learner observation are pending. Broader audience/reuse are product aims, not shipped topic coverage. |

Automation: with preview running, `bun scripts/phase4-rehearsal.mjs --paced` executes this route in an isolated profile, captures ordered screenshots, and records actual timestamps/browser/page errors in `rehearsal-result.json`. Omit `--paced` for interaction-only timing. Automated pacing does not verify a human's narration or physical presentation device.

## Quick alternatives

- Ready: reset/begin or select Ready under Example paths and confirm replacement. At Your turn, `Light provides energy to help build sugar.` skips redundant teaching. Prepared example insertion remains labeled even after editing.
- Clarification: at a check keep a draft, Need help? → `show another example` → Send → Return to answer. The draft must return unchanged. The Clarification example path supplies reproducible messages.
- Retry: answer the transfer with `Plant A makes sugar faster.`; Check answer → Continue. At A different situation, answer `Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.`; Check answer → View summary. Show separate first/retry evidence.
- For a clean restart use Reset and confirm, then re-enter. Never repair session state manually during the presentation.

## Screenshot fallback order

Use [screenshots](screenshots/) in filename order: `01-inferred-plan`, `02-diagram`, `03-contextual-clarification`, `04-adapted-route`, `05-targeted-support`, `06-fresh-check-draft`, `07-home-resume`, `08-restored-draft`, `09-recap-results`, `10-recap-sources`. Narrate the same script, saying these are captured browser states. Screenshots contain fictional presenter input. If a live action fails, switch to these materials and disclose the failure; do not imply the still images are live behavior. Existing three-path regression captures are supporting evidence; no video is required for this fallback.

Automated result: [210.03 seconds, Chrome 155.0.8059.40, zero page errors](rehearsal-result.json), with ten ordered screenshots and exact restored draft. This validates the paced browser sequence; it does not replace the human record below.

## Human rehearsal record — pending

| Presenter / date / actual device | Duration / path | Problems and corrections | Repeat result |
|---|---|---|---|
| Pending | Pending | Pending | Pending |

## Credits and Codex iteration record

- Product concept, audience, photosynthesis choice, interaction direction and simple-language decisions: project owner. Do not claim Codex originated the capstone idea.
- Scientific basis: OpenStax Biology 2e sections 8.1 and 8.2, linked beside teaching and in the biology packet. Existing authored summaries, diagram, analogy, prompts, feedback and rules are by StudyFellow; the SVG is not an OpenStax image. No new external image assets or fonts were added. Retain OpenStax's source/license attribution when distributing adapted content; see the book's license information.
- UI uses existing React/TypeScript/Vite/Bun, Ant Design, Tailwind, Zustand and PWA dependencies. This is an implementation credit, not a claim those projects endorse StudyFellow.
- Codex supported staged experience definition, authored scenario wiring, clarification/adaptation, conservative checks, local persistence, regressions and correction/re-review. See Phase 0–3 evidence/reviews for earlier iterations; Phase 4 adds review packets, missing keyboard/reset checks, accessibility/visual audit, candidate measurement and presentation fallback.
- UX and visual agents supplied read-only audits; one engineer owns hardening implementation; a different reviewer assesses the final handoff. Engineering approval cannot substitute for qualified biology review or learner observation.
