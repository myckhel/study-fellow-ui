# Owner observation follow-up — 15 October 2026

> Historical candidate: the latest completion-feedback and motion changes, fingerprint and verification are in [Phase 4 polish](../phase-4-polish/README.md).

Six walkthrough observations led to clearer entry, questions, example controls,
Send behavior and recap labels. This is owner feedback, not target-learner or
qualified biology validation. Those external gates remain open; final freeze,
deployment and submission are not claimed.

- [Brief and behavior decisions](brief.md)
- [Actual checks and candidate evidence](evidence.md)
- [Independent review](review.md)

The previous [Phase 4 packet](../phase-4/README.md) remains historical evidence
for the earlier build. Current validation and captures belong in this directory.
Run from the frontend root: `bun run build`, then
`bun run preview --host 127.0.0.1 --port 5174 --strictPort` and open
`http://127.0.0.1:5174` in desktop Chrome. Begin with Learn now. Try photosynthesis
fills the fields; Continue opens the optional question. On answer steps, Send
checks the answer; Need help switches to questions. Continue advances separately.

Current-step Example words fill the input without replacing the session.
Start an example session contains explicit confirmed Restart actions for full
path replay. Results retain short Example answer labels and a single neutral
explanation when supplied answers were used.

To recapture the current production walkthrough without overwriting historical evidence:
`bun scripts/phase4-rehearsal.mjs --output plans/phase-4-feedback`. This defaults to interaction-only timing; add `--paced` for the prepared narration budget. Neither run is a human speaking-time measurement.
