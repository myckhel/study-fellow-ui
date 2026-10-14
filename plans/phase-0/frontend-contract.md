# Frontend session contract — proposed v2

Owner: Codex coordinator · 13 October 2026 · FE-04 · Definition only, not a runtime migration.

This contract extends the existing feature-local Zustand store and explicit storage adapter. Production remains on `studyfellow.session.v1`. No endpoint or public API is introduced. The source package is [photosynthesis.v2.json](photosynthesis.v2.json); the immutable package and its transcripts are copied into mutable playback state, never modified by learner actions.

## Identities and state

| Record | Required meaning |
| --- | --- |
| Scenario reference | `scenarioId`, `scenarioVersion`; package versions change whenever teaching, rules, or transcripts change. |
| Session | `schemaVersion: 2`, unique session ID, scenario reference, selected simulation path or null, original topic/confusion, diagnostic or skipped, inferred outcome and chosen prepared interpretation, route, current step ID, drafts, turns, attempts, route changes, clarification state, completion, next action. |
| Route entry | Stable package `stepId`; status `pending`, `current`, `completed`, or `skipped`. Insertions keep original IDs and add `addedByChangeId`. Never navigate by array position alone. Exactly one current entry until recap completion. |
| Route change | Unique ID, trigger attempt/action ID, added/skipped step IDs and authored reason. Retain history and original route. Progress counts completed active milestones; skipped teaching is visible but is not evidence of understanding. Retry belongs to the transfer milestone. |
| Drafts | One visible session composer. Internally `conversationByStepId` retains teaching/clarification text and provenance; `answerByStepId` retains response drafts for a separately displayed check. Sending feedback never erases an outstanding answer draft. No visible question/answer mode selector. |
| Turn | Unique monotonically ordered ID/sequence, role, context step ID, text, provenance, source/block references when relevant; links to attempt/clarification IDs. Transcript order and route order are separate. |
| Attempt | Unique ID, prompt step ID, kind (guided/follow-up/transfer/retry), immutable submitted text/provenance/time, assessment and uncertainty. One committed result per prompt; retry has a different prompt ID and links to the first transfer attempt. Revisit never rescores or rewrites an attempt. |
| Provenance | Origin `authored`, `seeded`, or `typed`; seeded origin additionally retains path and seed-turn ID plus `edited: boolean`. An edited seed is displayed as “Edited demo data,” never actual learner evidence. Tutor turns remain authored, including during typed sessions. |
| Clarification | `closed`, `awaiting-continue`, or `unresolved`; originating step ID and turn IDs. Any teaching feedback can start this exchange, including statements without question punctuation. Additional messages are allowed before explicit continuation. Does not itself complete or advance the step. |
| Recap | Completion versus demonstrated criteria; first and retry evidence separately, unresolved points, simulation labels, source references, one next action. Derive from immutable attempts; do not trust persisted numeric scores. |

Transient expansion, hover and scroll position remain component UI state. Current step, conversation interruption and both internal draft types are durable domain state. Restore a meaningful heading/composer focus rather than persisting DOM nodes or pixel coordinates.

## Session conversation and progressive teaching

Owner-directed revision, 13 October 2026: teaching should feel like a bidirectional tutor conversation. There is one generic “Message your tutor” composer with a Send control, underneath chronological learner/tutor turns. The current tutor message can contain structured explanations, diagrams, source links and examples. A separate “Ask a question” form and simultaneous “Your turn” answer form are removed.

During teaching, **every nonempty message is conversational feedback**, whether it is a question, an uncertainty statement, a request for an example, or an attempted explanation. Keep the original learner wording as a typed/seeded turn and respond contextually from the prepared set; never manufacture an assessed attempt or advance from that message. Unknown feedback receives an honest bounded reply at the same step. Multiple exchanges retain context and remain visible. Sending clears only the sent composer draft, preserves all turns and any stored check draft, politely announces the tutor response, and keeps focus on the composer. Empty submission creates no turn and keeps focus at the input with an adjacent validation message.

“Your turn” is a **separate check step**, reached only by explicit Continue from teaching. Show its current prompt and conversation, rather than explanation, response form and future checks all at once. Use the same session composer, now in the check's context. First recognize supported clarification/help/uncertainty statements and questions, including “I still don’t understand”; these remain conversational and unscored. Otherwise accept only clearly recognized responses against that prompt's conservative rules. Unknown or ambiguous text asks for clarification without a silent pass or automatic next step. Explicit unresolved continuation can preserve an uncertain attempt. Material/partial answers can change the future route only after committing an actual check attempt. No punctuation, separate question field or intent selector is required to communicate with the tutor.

Teaching/check boundaries are not conversation resets: retain ordered history and provenance; each turn carries its context step ID. A compact route is a map, not a set of simultaneous exercises. Prior conversation may be disclosed, but the current teaching/check stays dominant. Demo illustrations of typed feedback remain authored responses, never live AI claims.

## Composer dock and response content

Owner layout revision: keep the generic composer anchored at the bottom of a viewport-height session. Put relevant action buttons above its text-input row, and keep Send inline with the textarea. The textarea grows with its draft, up to a bounded height (approximately 160px or less on short screens), then scrolls internally. Clearing/sending shrinks it. Reserve layout space for the dock; never overlay sources, teaching, replies or controls.

The current teaching and conversation occupy a separate keyboard-accessible scroll region. Preserve existing content blocks in chronological position; a reply may append an authored example/diagram/text block associated with its turn and step. Showing supplementary content does not replace prior teaching or advance the route. Additional factual blocks retain source references and text equivalents. In this preview, responses are prepared, not generated live.

Maintain the reader's scroll position when they are reviewing earlier content. Only follow new replies automatically when already near the end; otherwise provide a new-reply cue. Textarea expansion changes available reading height without moving the dock below the viewport. Dynamic viewport sizing and safe-area padding keep the composer available on phones. Preserve input focus, reduced-motion parity, per-context drafts and ordered history across teaching/check transitions.

## Transition table

All transitions validate prerequisites before committing, append relevant turns/history, update the next useful action, and flush immediately. Draft typing uses the existing 250ms debounce. No timers advance the session.

| Event and prerequisite | State change | Visible result / continuation |
| --- | --- | --- |
| Enter supported topic or select sample | Preserve original input; resolve photosynthesis package. Sample inserts visibly seeded initial confusion. | Offer one focused matter/energy diagnosis; unsure and skip are available. |
| Enter unsupported topic | Preserve input, no invented package/outcome. | Explain one-topic demo boundary and explicitly offer photosynthesis. |
| Diagnose / unsure / skip | Store response once; choose prepared emphasis and outcome. | Show proposed route and reason, not a claim of AI generation. |
| Correct interpretation | Supported energy-versus-matter correction chooses the package alternative; unsupported text remains stored without altering package. | Updated plan or bounded explanation; explicit Start session. |
| Start accepted plan | Set first active teaching step current. | Focus step heading. |
| Continue explanation/diagram/example | Close any teaching interruption, mark current teaching complete; move to next pending step. If next is a check, replace teaching content with that prompt. Preserve history and per-step drafts. | Focus next heading. No assessment inferred from clicking Continue. |
| Submit sound guided answer | Commit attempt; skip redundant example with reason; retain outcome. | Show feedback and route change; explicit Continue to transfer. |
| Submit material misconception | Commit attempt; insert energy/matter mini-lesson and distinct follow-up before transfer. | Name added step and reason; explicit Continue to targeted teaching. |
| Submit partial energy connection | Commit attempt; insert chemical-energy bridge example and follow-up. | Explain missing connection; explicit Continue. |
| Submit unknown/contradictory/unsure answer | Keep current prompt and draft; request clarification without scoring success. | Supported answer examples are offered. Explicit “Continue with unresolved evidence” commits uncertain attempt and routes to targeted example; never an optimistic pass. Empty text is not submitted. |
| Send supported feedback during teaching | Append original learner message and contextual authored response at the same step; set awaiting-continue; preserve saved check draft, plan and current step. | Display both turns, politely announce response, return focus to the same generic composer. Permit another message; explicit Continue opens the next step/check. |
| Send clarification/help feedback during a check | Append learner message and authored response at the same check; preserve its unsubmitted response draft and route. Do not create a scored attempt. | Continue conversing in the same composer. Explicit return closes the detour without completing the check. |
| Send unknown teaching/check feedback | Append original message and bounded authored fallback; set unresolved at same step. Preserve drafts and route; no successful assessment. | Offer supported feedback examples and source notes. Never substitute seeded wording for typed content. Further messages or explicit continuation are available. |
| Send another-example / unsure feedback | Respond conversationally with one relevant prepared explanation/example at the same step. Retain original message and response; no assessed attempt or route advance. | Additional messages can clarify further. Repeated requests reuse the prepared content without duplicate route IDs. |
| Submit targeted follow-up | Commit sound or unresolved evidence; keep original attempt. | Explicit Continue along the remaining route toward fresh transfer. Unclear wording retains clarification opportunity before unresolved continuation. |
| Submit fresh transfer | Commit criterion-level result using existing conservative assessor. | 2/2 leads to recap after explicit Continue; lower or uncertain result offers targeted support plus distinct retry. |
| Submit retry | Commit separate criterion result; preserve first result. | Explicit Continue to recap; completion never becomes a mastery claim. |
| Save and leave / interruption | Flush all state/drafts; leave when requested. | Home resume names topic, current useful step and next action; unavailable storage says open-tab only. |
| Reset / switch sample/path | Require confirmation if a session exists; cancellation preserves it. | Confirmed replacement starts clean, immutable package/transcripts remain intact. |

## Persistence and recovery

Use a new `studyfellow.session.v2` snapshot for later implementation. Read v2 first; if absent and v1 exists, show incompatible-session recovery without overwriting or deleting v1. No automatic migration from stage positions: v1 lacks route and turn identities. Only confirmed reset permits removing the old record and starting v2. A corrupt/incompatible v2 also stays untouched until confirmed reset.

Validate schema/package versions, unique IDs, known step references, route reachability, legal added/skipped history, sequence ordering, draft contexts, provenance links, attempt prerequisites, and recap consistency. Recompute assessments from text using the pinned package rules; reject inconsistent persisted results. Unknown versions or missing packages produce explicit recovery, not a blank new session. Validation failure never manufactures transcript or success evidence.

Storage exceptions retain in-memory learning and accurately show not saved. Retry writes may restore ready status only after success. Navigation/pagehide/visibility flush drafts. A closed tab after storage failure and browser-cleared data remain unrecoverable. One browser-local session is supported; no accounts, sync or session history.

## Walkthrough checks for implementation

- Ready: explanation/diagram → sound guided attempt → example skipped with reason → fresh transfer → honest recap.
- Misconception: material claim → inserted mini-lesson → different follow-up → partial fresh transfer → distinct retry → first/retry recap.
- Clarification: statement feedback in teaching → learner/tutor turns at same step → additional feedback → explicit Continue opens a separate check. During a check, help feedback preserves an existing response draft; explicit return leaves the check open. Reload restores the conversation context and internal drafts.
- Skip diagnosis; supported/unsupported correction; unknown topic/question/answer; empty input; repeated example; revisit committed answer; cancel reset.
- Simulated origin survives edits and reload; ordered tutor/learner turns retain identities; replay copies cannot mutate canonical transcripts.
- Corrupt v2, incompatible v1/package version, storage denied, pending-draft leave and confirmed reset preserve honest recovery behavior.

These are acceptance specifications for later production work, not claims that the preview or current app implements v2.
