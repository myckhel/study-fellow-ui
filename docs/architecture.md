# Frontend architecture

StudyFellow is a client-rendered React + TypeScript app built with Vite and Bun.
It is intended to help professional learners and secondary-school, college, and
university students who struggle with a specific concept or topic. The current
hackathon build uses static photosynthesis content as one demo fixture, not as
the full product audience or subject range. The architecture is feature-based
and keeps the hackathon slice small. No backend endpoints or authentication are implemented. One versioned local
session is persisted through an explicit storage adapter inside the learning
store.

## Structure

```text
src/
  main.tsx                       # browser bootstrap and global CSS
  app/
    providers.tsx                # application provider composition
    query-client.ts              # one server-state cache and its defaults
    router.ts                    # route table and lazy feature imports
    layout.tsx                   # skip link, navigation feedback, scroll restore
    route-feedback.tsx           # initial loading, route error, not-found recovery
  features/
    learning/
      routes/                    # home, setup and lesson route modules
      components/                # lesson preview and answer form
      content/photosynthesis.ts  # typed, attributed lesson configuration
      model/study-store.ts       # session, transitions, storage validation and persistence
  shared/
    ui/Brand.tsx                 # domain-independent brand link
    theme/                       # Ant Design token bridge and theme provider
    api/http-client.ts           # Axios transport for future backend integration
  index.css                      # Tailwind import, tokens and global styles
```

Dependencies flow from `app` to `features` to `shared`. Shared code must not
import application or feature code; features must not import application code.
ESLint checks these layer imports. Use `@/` imports across layers and relative
imports within a feature. Keep features independent; compose multiple features
in `app` rather than importing one feature’s internals into another.

Route modules are feature entry points: they export `Component` for React Router.
Avoid broad barrel exports, generic service/repository hierarchies, and empty
feature folders. Extract shared abstractions after a real second use appears.

## Routing and resilience

React Router Data Mode owns navigation, lazy route modules, pending feedback,
scroll restoration and route error recovery. The route table knows the URL
shape before importing page code. `/`, `/start` and `/lesson` are separate dynamic imports;
unknown URLs show a recoverable not-found page. Failed imports/rendering errors
reach the root route error boundary; a full reload can recover stale assets.
Lesson access without a session redirects to setup. Resume restores the current
stage and draft when browser storage is available. Navigation, pagehide,
beforeunload and hidden-document events flush pending drafts.

Keep the initial shell lightweight. Lazy route files create page boundaries,
but shared Ant Design/Motion dependencies can still be large. Measure emitted
chunks and actual requests before claiming a bandwidth improvement. Do not
silence bundle warnings or force vendor chunking without evidence.

Measured after the foundational learning slice (13 October 2026): main JS
624.36 kB, home 4.33 kB, setup 16.38 kB, lesson 12.01 kB, and shared chunks
139.96 kB (minified). Total app JS is approximately 797.04 kB, compared with the
prior architecture baseline of 941.21 kB; removing unused route Motion imports
reduces the shared route payload. No dependencies or external assets were added.
The main chunk still triggers Vite's large-chunk warning. PWA precaching includes
11 entries totaling 797.84 KiB, so lazy routes do not reduce total precache cost.

Deployment must serve `index.html` for client routes such as `/lesson`, while
serving actual asset files normally. The PWA caches built app assets. Cached revisits work offline after online
service-worker activation; first visits require a connection. LocalStorage owns
answer persistence independently. No offline API mutations or synchronized
progress exist, and external source pages require network access.

## State ownership

| State | Owner | Examples |
| --- | --- | --- |
| Transient UI | React component state | expanded explanation, source notes, clarification prompt |
| Shared client/domain state | Feature-local Zustand store | one session, drafts, diagnostic and immutable attempts |
| Server data | TanStack Query | future lessons and assessments from a real API |
| Navigable state | React Router URL | page, future shareable lesson/filter parameters |
| Durable local state | Explicit localStorage adapter | validated resume snapshot, storage status and confirmed reset |

Do not copy query responses into Zustand. Session answer drafts intentionally live
in feature state so interruption can be recovered. Draft writes are debounced
250ms; committed transitions flush immediately. Queries use a 60-second stale
window, one retry and no automatic focus refetch; mutations do not retry.

### Session and assessment boundary

`Session` includes schema/content versions, setup, goal, diagnostic, stage,
drafts, immutable attempts, completion and next action. Supported lesson stages
are diagnostic → explanation → guided → feedback → optional practice → transfer
→ optional targeted retry → recap, plus setup. The retry belongs to the same
transfer milestone so progress denominators remain stable. Completion records
finishing the flow; success requires a recognized 2/2 transfer result. There is
no cumulative counter and no finish bypass.

The `studyfellow.session.v1` snapshot is validated before use. Its versions,
primitive fields, drafts, prerequisites, canonical attempt order and reachable
stage/history combinations must match the current content. Scores are recomputed
from stored text rather than trusted. Unsupported snapshots are not silently
replaced: learners confirm reset. Storage exceptions preserve the in-memory
session and show that reload recovery is unavailable. Browser-cleared storage
and a closed tab with failed storage cannot be recovered. One browser session,
not cross-device synchronization, is the MVP boundary.

Local pure `assessGuided` and `assessTransfer` functions return categories or
criterion evidence plus uncertainty. Conservative phrase/negation/contradiction
and energy-attribution rules recognize supported wording; unfamiliar wording
asks for clarification before explicit unresolved submission. These are demo
heuristics, not general natural-language assessment. Later model integration
should adapt to this typed boundary once a real contract exists. Transfer has
prediction and energy-reasoning criteria, and one distinct retry scenario.
Returning to a submitted step shows its immutable answer and existing result.
Seeded-demo provenance remains attached even if the inserted draft is edited.

The typed photosynthesis configuration owns explanations, prompts, feedback,
source summaries and section locators. Factual teaching is labeled source-supported;
analogies and local feedback are labeled authored/supplemental. Lightweight inline
SVG illustrates energy carriers separately from matter inputs; illustrations
have visible text labels. No upload processing or content generation is claimed.

## Backend integration boundary

`shared/api/http-client.ts` configures Axios with `VITE_API_BASE_URL` (default
`/api`) and a 15-second timeout. It performs no requests by itself. Copy
`.env.example` to `.env.local` only when a backend is available. All `VITE_*`
configuration is public; never include API secrets.

When a backend contract exists, add `api/` inside the consuming feature:

1. Define response types and validate external data at the API boundary.
2. Write endpoint functions that accept an `AbortSignal` and return domain data.
3. Define feature-owned query keys/options and pass Query's signal to Axios.
4. Render loading/error/retry/empty states near the consuming UI.
5. Invalidate affected queries after successful mutations; choose retries based
   on idempotency. Keep learner-facing errors free of server diagnostics.

Do not invent endpoints or mock a live backend to fill this structure.

## Presentation foundation

Tailwind 4 CSS tokens remain the single color/font source. The theme bridge
reads those variables after global CSS loads; this implementation is browser-only.
Ant Design handles existing controls and their theme states; Tailwind handles
page composition. Motion and Ant Design respect reduced-motion preferences.
Keep date-fns and lodash-es available but import narrow utilities only when used.

## Checks and contribution workflow

- `bun run lint`: TypeScript/React rules and layer import restrictions.
- `bun run build`: type-checking, production assets and PWA generation.
- `bunx playwright install chromium`: install the browser once.
- `bun run test:e2e`: desktop/mobile flows, scoring, drafts/reload,
  storage failure, confirmed recovery, keyboard use, reduced motion and routes.
- `PLAYWRIGHT_PRODUCTION=1 bun run test:e2e --grep "production cached"` after a
  build: actual service-worker-controlled cached offline reload and resume.
- `bun run test:e2e:ui`: interactive browser test runner.

An installed Chrome executable can be supplied with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` instead of downloading Chromium. Test
artifacts are ignored; failure traces are retained locally.

Add new product behavior inside its feature, keep the app composition thin,
validate relevant learner flows, and update the parent `PROJECT_MEMORY.md`
for durable product/architecture changes. The UI is an independent Git submodule;
commit its changes inside this repository before updating the parent gitlink.

## References

- [React Router route objects and lazy modules](https://reactrouter.com/start/data/route-object)
- [TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Vite aliases](https://vite.dev/config/shared-options#resolve-alias)

## Phase 1 tutor-planned walkthrough (14 October 2026)

The primary home action now opens `/start`, a topic/question entry with optional
confusion, one optional diagnostic, and a precomputed outcome/route. Only exact
prepared topic/interpretation phrases are recognized; other input stays visible
and requires an explicit sample or supported-focus choice. `/session` is a lazy
route with a feature-local, in-memory `session-store.ts`. It never writes or
replaces `studyfellow.session.v1`. Home distinguishes open-tab resume from the
saved legacy lesson, which retains `/lesson`, original scoring and persistence.
The original goal-first setup is available at `/legacy-start`; existing saved
sessions keep their original versions, drafts, and assessment evidence.

`phase1-scenario.json` is a generated projection of the immutable Phase 0 v2
package. Run `bun scripts/derive-phase1-scenario.mjs` after changing the canonical
package; `--check` (also exercised by Playwright) verifies exact freshness. The
projection includes teaching, diagnosis, plan, sources, asset metadata and
review status, but omits the 70 simulation turns and unused Phase 2/3 assessment
contracts. Runtime data is recursively frozen; mutable sessions copy route IDs
and learner state. Six content kinds render from the package through
`SessionBlocks.tsx`, reusing the lightweight energy-flow illustration. Text,
caption, author provenance and nearby section links survive visual fallback.
Recap is a teaching summary preview derived from the package's core teaching;
it is not an assessed completion or a saved recap.

The session reserves a bottom dock under an independently scrollable, keyboard
accessible canvas. Desktop has a 264px navy route; phones collapse it. Dynamic
viewport height, min-height:0 flex children, safe-area padding, inline Send,
bounded textarea growth and a new-reply cue preserve usable reading space.
Step changes focus the heading; sending retains composer focus. Near-bottom
readers follow appended turns, while earlier reading receives a reply cue.
Reduced-motion media overrides preserve all static state feedback.

Phase 1 sends append typed, unassessed learner text and an authored bounded
acknowledgment; they do not interpret, score, adapt or advance. Explicit Continue
opens the next step, including separate unassessed checks. Per-step drafts and
messages survive navigation in the same tab; reload and tab closure intentionally
lose new session state. Phase 2 owns contextual replies and adaptive checks;
Phase 3 owns fresh transfer, evidence-based recap and durable v2 persistence. The existing legacy path
continues to provide its previously implemented assessment/save behavior.

Final Phase 1 production measurement (14 October): main JS 624.80 kB, total app
JS assets 824.88 kB (+27.84 kB / 3.49% against the 797.04 kB baseline).
PWA precache contains 17 entries totaling 829.47 KiB. No dependencies or external
assets were added; the main large-chunk warning remains. See
[Phase 1 implementation evidence](../plans/phase-1/evidence.md) for final
production checks, legacy regressions, actual captures and development-run caveat.

## Phase 2 clarification and adaptation

The new session now keeps independent answer/conversation drafts, immutable guided
and follow-up attempts, origin/path/seed identity (including edits), original
route IDs, stable route entries with completed/skipped status, and a route-change
history linked to triggering attempts. Send is conversational and never scores
or advances; a check-mode Send retains the answer draft. Need help switches the
same composer to conversation and Return to answer restores the draft. Completed
check destinations use conversation drafts, including when revisited.

Explicit Check answer uses the existing conservative guided assessor. A distinct
follow-up additionally requires the water/carbon-dioxide matter distinction;
clearly attributed quoted statements can be excluded from assessment, while the
original immutable text remains evidence. Unfamiliar or contradictory wording
retains its draft and asks for clarification. Only explicit Continue with help
commits uncertain evidence. Recognized feedback enters the ordered conversation;
route reasons appear beside it before Continue. Sound guided answers skip the
example; energy gaps add energy-bridge/follow-up; material or unresolved gaps add
matter-energy/follow-up. Stable IDs prevent duplicate additions and attempts.

The generated projection retains canonical clarification/fallback text, guided
branch data, and just the editable learner inputs for three example paths. It
excludes scripted transfer assessment, retry and recap results. Inputs are
inserted one action at a time; Send/Check and ordinary navigation drive the flow.
Example identity survives edits, so supplied words never become typed evidence.
The transfer and summary remain unchecked previews; there is no v2 persistence,
backend, general model generation, mastery or assessed completion claim.

Final Phase 2 measurement: main JS 624.51 kB, total app JS 839.72 kB
(+14.84 kB / 1.80% against recorded Phase 1), PWA precache 18 entries,
844.18 KiB. No dependencies/external assets were added. Short viewports bound
textarea growth and compact the expanded passive route scroll region; the New
reply control sits in the reading area so added clarification controls do not
push the dock out of view. Compound 320×500/375×480 cases include long edited
example drafts, uncertainty actions, an expanded route and reply cue. See
[Phase 2 evidence](../plans/phase-2/evidence.md) for actual final validation,
independent review and the FE-13 completion boundary.

## Phase 3 transfer and continuity (14 October 2026)

The main `/session` journey now uses explicit guided, follow-up, transfer and
retry checks. Send remains conversation only. Transfer keeps prediction and
energy-reasoning criteria separate; a lower first result inserts one distinct
retry. Unknown wording requests clarification before an explicit unresolved
submission. Immutable attempts retain example/typed origin, first/retry identity
and linked chronological turns. Recap is derived from these attempts and keeps
completion separate from demonstrated evidence. Source links and one next action
remain available; reviewing teaching does not modify results.

`session-storage.ts` owns `studyfellow.session.v2`. It validates scenario/schema
versions, outcome, known IDs, reachable route/history, drafts, origins, ordered
attempt links and completion. Assessment is rebuilt from text through the same
`session-assessment.ts` boundary used for submission. The new Zustand store
persists committed changes immediately and debounces drafts by 250ms; router
navigation, pagehide, beforeunload and hidden-document events flush drafts.
Save notices reflect actual successful writes, pending writes or storage failure.
Learning can continue in-tab when saving fails.

Home offers one secondary resume action beside the primary Learn now action.
Old `/lesson` and `/legacy-start` entry routes redirect to the current journey;
legacy assessment/validation code remains for regression coverage but its flush
cannot create a second save. A v1-only record is a recovery condition, not an
automatically migrated session. Invalid or unsupported records remain untouched
until confirmed replacement. Reset/replacement removes the single active saved
record only on confirmation; failed removal does not claim success. No accounts,
sync, server calls or additional topics are introduced. Cached app revisits can
resume offline after service-worker activation; first visits and external source
pages still require a connection.

Validation results and measurements are recorded in `plans/phase-3/evidence.md`
after the checks finish; independent review is recorded separately. Earlier
Phase 1/2 open-tab and unchecked-preview descriptions above are historical.

## Owner walkthrough refinement (15 October 2026)

The current entry example fills the topic form and waits for explicit Continue.
Diagnosis retains its original stored IDs and route decisions with clearer
question/answer wording. Home introduces the learning journey without teaching
the configured lesson before it begins.

The session now uses one visible Send action. In an unanswered check's answer
mode, Send invokes the existing conservative checker; in teaching/help or after
submission it sends conversation. Need help and Return to answer retain separate
drafts, while Continue remains the only normal step advance. Earlier descriptions
of separate Check answer and conversational Send are historical.

Current-step example words are independent of whole-session replay. The internal
`useExample(pathId?, seedId?)` action accepts only existing authored seeds for the
current step, fills the appropriate draft, and retains origin on edits. The v2
wire shape stays unchanged. Origin validation checks each path/seed/step rather
than requiring every example to belong to the selected replay path, allowing
mixed examples in one ordinary session. Route, assessment, chronology and linked
turn/attempt checks remain mandatory. Whole-session replay stays an explicit,
confirmed restart. Concise recap labels identify example versus typed answers;
example origin is not a claim of learner understanding.

See [owner-observation brief](../plans/phase-4-feedback/brief.md) and its evidence
for verification of these changes. The earlier Phase 4 candidate is historical;
use the refreshed fingerprint for the current technical build. Qualified biology
review and actual learner observation remain separate outstanding gates.


## Completion presentation and motion — 15 October 2026

`feedback-presentation.ts` maps immutable attempt evidence to short learner-facing feedback, criterion labels and recap closure. It does not modify canonical feedback, assessment, store or storage validation. Uncertainty takes priority over positive styling; successful final transfer does not erase an unresolved earlier explanation. Example origin remains visible.

`useSessionMotion.ts` uses the Web Animations API for brief new-content entrances. Route-instance refs baseline existing items on mount/replacement and remember revealed IDs, so Back, typing and persisted resume cannot replay success. Reduced-motion preference, missing API and elements without a rendered box use static rendering. Focus, input and reading-area geometry stay stable. No stored fields, dependencies or assets were added. See [polish evidence](../plans/phase-4-polish/evidence.md) for the current candidate.
