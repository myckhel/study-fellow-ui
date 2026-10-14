# Design decisions and owner feedback

## Direction v1 — proposed, 13 October 2026

Owner selected local browser mockups during planning. Existing owner preferences: concise, illustrative, smart teaching composition; Cosmic Observatory identity; inferred outcome; compact mutable route; inline clarification. These authorize the draft, not approval of its concrete appearance.

- One dominant ivory teaching canvas; compact navy route beside it on desktop, route disclosure above it on phones. Tutor presence uses contextual authored copy without an avatar/chat sidebar.
- Four states: entry/proposed route; diagram and clarification; inserted targeted teaching; criterion-based recap. Pair 375px and 1280px compositions and check 320px separately.
- Existing semantic navy/ivory/gold tokens and local typography; no new dependencies, bitmap assets or fonts. Instructional SVG is labeled with equivalent text and sources.
- One primary action per active task; answer and question fields remain distinct. Asking retains step, route and answer draft. Continue is explicit.
- Added/skipped steps carry text labels and reasons. Seeded turns/results remain visibly simulated, including after edits.
- Step changes focus headings. Clarification preserves composer focus and politely announces responses. Reduced motion keeps equivalent static feedback; no timers advance.

## Owner feedback — captured, 13 October 2026

> teaching process should have a chat input for the session without asking for explicit question, any feedback by the user should serve as a clarifying questions. basically it should feel like a chat interface with the ai tutor where there can be bi-directional communication.
> the your turn should be in another flow without showing all sequence at once.

| Review dimension | Owner direction | Revision |
| --- | --- | --- |
| Density and hierarchy | Do not show all the sequence at once; “Your turn” belongs in another flow | Teaching contains the current tutor content and conversation. Explicit Continue opens a separate check composition. |
| Tutor interaction | Bidirectional chat with one session input; feedback need not be an explicit question | Generic session composer with Send and chronological learner/tutor turns; statements, uncertainty and requests receive contextual authored replies. |
| Draft continuity | Conversation should stay in the session | One visible input; internally retain conversation and check drafts by context, plus ordered turns/provenance. |
| Illustration | No additional diagram change requested | Keep text-complete diagram inside the tutor teaching turn, with adjacent sources. |

## Direction v2 — owner-directed revision

- Replace the two visible answer/question fields with one session chat composer. Tutor replies are part of the same conversation, with structured teaching/diagram content when useful.
- Teaching messages are feedback, not scored attempts. “I still don’t understand” and similar statements work without a question mark or an Ask action. Unknown feedback receives an honest prepared-demo boundary response at the same step.
- Remove simultaneous “Your turn”/answer form from teaching. Show checks only when the learner explicitly continues; the separate check uses the same conversational input and current prompt.
- Keep route, ordered messages and per-context drafts through conversational interruptions. Check help feedback does not silently score or complete the step.
- Preserve Cosmic Observatory tokens, phone route disclosure, focus/announcements, reduced motion, source access and seeded/typed labels.
- Preserve the original scenario package as `photosynthesis.v1.json`; the revised package is `photosynthesis.v2.json`. This is authoring versioning, not a production migration.

The owner supplied this direction; this log does not claim separate post-revision visual approval. Independent verification and the resulting artifact links are recorded in [evidence](evidence.md).


## Direction v3 — composer and content layout

Owner feedback, 13 October 2026:

> message input should be stick to bottom
> action buttons shoul be at the top of the input
> generated content should remain in ots postion and scollable. as response can determine some content to be displayed
> send button should be inlined with input and exandable as typing grows

Implementation direction: a viewport-height session with a scrollable content/conversation region and a bottom composer dock. The dock takes layout space rather than covering teaching. Current teaching blocks stay in chronological position; replies may append authored examples or other content to that same scroll region. Actions sit above the input row. Send is inline with the growing text field; growth is bounded to preserve a usable reading area, after which the input scrolls internally. Mobile uses dynamic viewport height and safe-area spacing.

Sending keeps focus in the input and shrinks it after clearing. Reading earlier content does not force a jump to the latest reply; when appropriate, offer a new-response cue. Checks remain separate, messages remain contextual, and authored/typed/seeded provenance remains visible. This is a layout revision; the active scenario package remains v2 and scientific/scoring content is unchanged. Verification is recorded in [evidence](evidence.md).
