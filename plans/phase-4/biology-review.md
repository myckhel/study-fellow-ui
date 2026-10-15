# FE-16 — Qualified biology review packet

Prepared: 14 October 2026 (Africa/Lagos). **Status: prepared; qualified review not arranged or completed.** This packet is an inventory and recording form, not scientific approval. Do not close FE-16 until a qualified reviewer has checked the current build, corrections are resolved, and any changed content is re-reviewed.

## Material and review record

- Canonical package: [photosynthesis.v2.json](../phase-0/photosynthesis.v2.json), scenario `photosynthesis`, version `2`. Review its `steps`, `teachingNotes`, `clarifications`, `fallbackExamples`, `simulationPaths`, `transferCheck`, and `review` fields. The package currently records `pending-qualified-biology-review`.
- Runtime projection: [phase1-scenario.json](../../src/features/learning/content/phase1-scenario.json). Check it is current using `bun scripts/derive-phase1-scenario.mjs --check`.
- Scenario authority: [photosynthesis specification](../../../../outputs/photosynthesis-demo-spec.md). Review the running `/start` → `/session` journey as well as JSON: displayed feedback and rule-based assessment can differ from the authored simulation expectation.
- Audience: secondary-school biology learners; English only. The intended product audience is broader. This review does not establish Nigerian curriculum alignment, multilingual quality, learner usability, durable learning, or general assessment validity.

| Record | Complete at review |
|---|---|
| Reviewer name / internal reference | Pending |
| Relevant biology qualification, teaching experience, and learner level | Pending |
| Date and timezone | Pending |
| Build fingerprint / commit and local changes | Pending |
| Scenario version and projection freshness result | Pending |
| Browser / route reviewed | Pending |
| Material actually examined; any exclusions | Pending |
| Overall verdict | Pending: approve / approve after recorded corrections / further review needed |
| Unresolved scientific or age-level limits | Pending |

## Review sequence

Mark each row **not reviewed / acceptable / correction required**, with a finding ID for any concern. Judge scientific accuracy, age-level wording, and risk of a misleading inference. Do not infer approval from source links or automated checks.

| Item | Current material to examine | Reviewer check | Result / finding ID |
|---|---|---|---|
| Diagnosis and inferred route | Optional question: “Which are matter inputs the plant uses: water, carbon dioxide, or light energy?”; `matter`, `light`, `unsure`, `skipped`; outcome “Explain how light helps plants make sugar”; supported energy/materials focus | Is the matter/energy distinction sound? Is diagnosis tentative rather than a mastery claim? Skipping must not imply failure. | Not reviewed |
| `core` explanation | Chlorophyll captures light; light-dependent reactions store energy in chemical carriers supporting carbohydrate building from carbon dioxide; light is energy, water/CO₂ are matter inputs | Check scientific simplification and terminology; ensure light is not portrayed as matter becoming sugar. | Not reviewed |
| `energy-flow` diagram | `LearningIllustration.tsx#EnergyFlow`: Light → Chemical energy carriers → Sugar built from CO₂; water participates, oxygen released; caption “Energy and matter play different roles in photosynthesis.” | Check arrow meaning, energy versus matter labels, omission of detailed chemistry, visible text and text equivalent. This is StudyFellow's authored SVG, not an OpenStax image. Check missing-visual fallback communicates the same claim. | Not reviewed |
| `example` | Materials-and-energy building analogy; explicitly “not the full chemistry” | Is the analogy helpful without suggesting water/CO₂ alone are a complete account of sugar-building chemistry? | Not reviewed |
| `guided` | Plant with enough water/CO₂ absorbs light: “What role does light play in helping the plant build sugar?” | Check prompt, expected energy-to-sugar connection, and response-specific feedback. | Not reviewed |
| `matter-energy` | Light supplies energy, not matter becoming sugar; water/CO₂ are matter inputs | Check misconception correction and whether runtime follow-up requires an explicit, accurate distinction. | Not reviewed |
| `energy-bridge` and `follow-up` | Bridge connects captured light to chemical energy for sugar building. New prompt quotes “Sunlight is a material the plant turns into food.” | Is the fresh check sufficient? Verify quoted misconception is not confused with the learner's endorsed answer; unknown or contradictory reasoning must remain uncertain. | Not reviewed |
| Clarification | `light-to-sugar`: “Does light turn into sugar?”; “Light sounds like food”; “I still don’t understand”; another-example and unknown-question fallbacks | Check each supported reply, no false general knowledge claims, and preservation of current step/answer. Unsupported questions must not produce invented biology. | Not reviewed |
| Teaching notes | Simplified equation uses sugar, often represented as glucose; direct Calvin-cycle carbohydrate product is G3P used to make glucose/other carbohydrates | Check the glucose/G3P distinction and whether explanation level is appropriate. Do not imply glucose is made directly in one step. | Not reviewed |
| Limiting conditions | Light is limiting; water, CO₂, temperature and other conditions suitable | Check that claims concern sugar-production **rate**, not total stored sugar, all environments, or unconditional “more light is better.” | Not reviewed |
| Transfer and retry | Prompts and rubric below; targeted help; first/retry kept distinct | Check comparability, answer key, feedback correctness, and honest unresolved outcomes. | Not reviewed |
| Recap | Prediction and reasoning separately; remaining energy/matter gap; next step; first/retry and supplied/typed evidence distinguished | Ensure completion and supplied examples do not imply demonstrated understanding or learning effectiveness. | Not reviewed |

### Branches to inspect in the running build

Use all three prepared paths (`ready`, `misconception`, `clarification`) for reproducibility, then separately type your own answers. Supplied examples demonstrate behavior only. In addition inspect these cases:

- Sound guided energy-to-sugar explanation: the redundant example can be skipped.
- “Light provides energy.”: partial evidence adds `energy-bridge` and `follow-up`.
- Light-as-material response: `matter-energy` and a different `follow-up` check are inserted.
- Unfamiliar, contradictory, or unsupported wording: clarification is requested; no silent success. Explicit continuation with unresolved evidence must remain unresolved in recap.
- Clarification during teaching or a check: reply does not score or advance; an answer draft remains available.

Canonical `guided.advanceCriteria` contains older shorthand about partial evidence adding an example; `fallbackExamples.partial-guided`, the `energy-bridge` step, and current runtime use the bridge plus follow-up. Review the actual route and record any conflicting scientific expectations rather than treating simulation metadata as authority over runtime scoring.

### Fresh transfer, different retry, and answer key

**First transfer (`transfer`):** “Two similar plants have the same suitable water, carbon dioxide, and temperature. Plant B is moved to much dimmer light; light is now limiting. Which plant makes sugar faster? Explain why using light energy.”

**Retry (`retry`):** “Two similar seedlings have suitable water, carbon dioxide, and temperature. Seedling C is under a brighter lamp; seedling D is shaded. Light is limiting for D. Which seedling makes sugar faster, and how does captured light energy explain the difference?”

| Criterion | First transfer | Retry | Points |
|---|---|---|---|
| Prediction | Plant A has the higher sugar-production rate | Seedling C has the higher sugar-production rate | 1 |
| Energy reasoning | Dimmer light means less captured light energy and less energy supporting sugar building | Same causal connection applied to shaded D versus brighter C | 1 |

2/2 is success on this bounded check; prediction without energy reasoning is 1/2, not a pass. Keep the first answer/result even after retry. Inspect targeted explanations for missing prediction, missing energy reasoning, and unresolved matter confusion. Check the conservative English pattern rules in [assessment.ts](../../src/features/learning/model/assessment.ts) and [session-assessment.ts](../../src/features/learning/model/session-assessment.ts): a correct answer outside recognized wording can remain unclear. Record such cases verbatim without calling the assessor validated.

### Sources to inspect

These are the package's existing references, not newly verified scientific approval:

- [OpenStax Biology 2e, 8.1 Overview of Photosynthesis](https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis), “The Two Parts of Photosynthesis”, Figure 8.7: matter inputs, carbohydrate production, oxygen release, G3P teaching note.
- [OpenStax Biology 2e, 8.2 The Light-Dependent Reactions of Photosynthesis](https://openstax.org/books/biology-2e/pages/8-2-the-light-dependent-reactions-of-photosynthesis), “How Light-Dependent Reactions Work”: light capture and chemical energy carriers.

Open source links need connectivity; local summaries are not a full offline copy of OpenStax. Distinguish sourced summaries from the authored analogy, feedback, prompts, diagram, and simulated learner turns.

## Findings, corrections, and re-review

Duplicate for each finding. Leave unused fields blank; do not fabricate review evidence.

| Field | Entry |
|---|---|
| Finding ID / severity (blocks instruction / material improvement / wording) | |
| Reviewer / date | |
| Exact step, block, response or diagram label | |
| Current text or reproducible input | |
| Concern and supporting reference / section | |
| Required correction | |
| Implementation owner / changed files | |
| Resolution and tested build fingerprint | |
| Re-reviewer / date / material checked | |
| Re-review verdict and residual limit | |

FE-16 closes only after a qualified reviewer records a verdict, blocking findings are corrected and re-reviewed, and the canonical package/projection and durable evidence reflect that actual review. Independent frontend approval is a separate gate and does not substitute for biology expertise.
