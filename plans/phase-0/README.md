# Phase 0 experience package

13 October 2026 · Prepared frontend definition · Production app unchanged

## Review the screens

From the frontend root run `bun run dev --host 127.0.0.1`, then open [the local review board](http://127.0.0.1:5173/plans/phase-0/index.html). The board contains five paired phone/desktop views: entry, conversational teaching, adapted teaching, separate check, and recap. Open a single composition to inspect it at your actual browser width, including 320px. It uses authored/seeded photosynthesis examples, not live AI or actual saved learner results.

## Artifacts and ownership

| Item | Artifact | Owner | Gate |
| --- | --- | --- | --- |
| FE-01 | [Current app → target mapping](app-spec-map.md) | Codex UX specialist | Mapping and independent review |
| FE-02 | [Review board](index.html), [feedback record](design-decisions.md) | Codex visual/frontend specialist; owner supplies taste feedback | Owner feedback captured; direction v2 implemented and independently checked |
| FE-03 | [Active versioned photosynthesis package](photosynthesis.v2.json) | Codex UX/content specialist | Definition complete against revised FE-02; biology review pending |
| FE-04 | [Frontend state/transition contract](frontend-contract.md) | Codex coordinator | Definition complete against revised FE-02 |
| Evidence | [Acceptance and verification](evidence.md) | Codex coordinator; independent reviewer | Actual checks recorded separately from proposed behavior |

The production assessment/store and routes are retained. This directory specifies their later extension and contains a standalone visual preview. No v2 session migration or new production tutoring behavior ships in this phase.

## Recorded revision and next step

The owner requested bidirectional chat through one session input, accepting feedback without an explicit question, and a separate “Your turn” flow. Direction v2 implements that request: teaching contains structured tutor content and learner/tutor exchanges; explicit Continue opens a separate check using the same generic composer. The route and per-context drafts remain intact. The bottom composer dock has actions above an expanding text-input row with inline Send; teaching and response content scroll independently. Unknown feedback stays conversational without a silent success or advancement.

The feedback and resulting revision are recorded in [design decisions](design-decisions.md), with [independent evidence](evidence.md). FE-01–04 are complete as an experience-definition package. This records the owner-directed revision, not a separate claim of post-revision visual approval. The original [v1 scenario](photosynthesis.v1.json) remains archived; v2 is the active package for the next build phase.

Next: implement Phase 1 against this reference. Qualified biology review and actual learner observation remain separate outstanding gates; engineering review does not satisfy them. No new production tutoring, v2 persistence or migration is claimed by these artifacts.
