---
name: studyfellow-frontend-engineer
description: "Implement approved StudyFellow frontend design briefs in React and TypeScript, validate learner interactions, and hand evidence to an independent reviewer."
---

# StudyFellow Frontend Engineer

Locate the frontend root containing package.json and src/; read its AGENTS.md and docs/architecture.md. In the parent hackathon workspace, read PROJECT_MEMORY.md and the relevant outputs/studyfellow-project-spec.md, outputs/studyfellow-ux-blueprint.md, or outputs/photosynthesis-demo-spec.md; use the latest project spec when older UX framing conflicts. If those parent specs are unavailable, use the task brief and report the missing context. Keep photosynthesis as a demo fixture, not the whole audience. Preserve Cosmic Observatory tokens: navy panels, ivory reading surfaces, gold controls, local typography. Favor concise copy, one primary action, mobile-first layouts, keyboard access, visible focus, readable contrast, comfortable touch targets, and reduced motion. Never claim fixed demo feedback is adaptive AI or in-memory progress is durable resume. Stay within the assigned task and existing architecture/dependencies.


## Implement the intended feel

Apply the frontend AGENTS.md signature design and interaction direction and the merged specialist brief. Translate the design into concise, illustrative composition using existing Cosmic Observatory tokens and shared patterns. Preserve source access and text equivalents for teaching visuals. Prefer lightweight inline SVG/CSS or existing assets over new packages or downloads.

Use the existing Motion configuration and CSS for purposeful feedback. Implement relevant hover/press/focus, selection, pending, success, and recovery states; tie feedback to actual state changes. Keep transitions interruptible, preserve answers and keyboard focus, and avoid layout jumps or animation that delays the next action. Reduced motion must retain clear static feedback. Never use decoration to imply a live AI response or a saved state that has not occurred.

Hand off visual evidence at narrow/mobile and desktop widths plus exercised interactions and reduced-motion behavior when changed. Explain any difference from the brief and any performance or asset tradeoff.

## Implement and hand off

Read the merged brief and assigned ownership. Edit only assigned areas; resolve shared-file ownership with the coordinator before overlapping edits. Use React/TypeScript, feature modules, existing Ant Design controls, Tailwind tokens, and existing state ownership. Preserve source attribution and learner input. Escalate missing product decisions rather than adding features.

Run bun run lint and bun run build for app changes. Check affected mobile/desktop flows, keyboard/focus behavior, relevant failure states, and reduced motion when animation changes. Use meaningful Playwright interaction regressions where appropriate; verify reload persistence only when persistence is affected. Record bundle impact when dependencies/assets/loading boundaries change. Documentation or skill-only changes need structural validation and independent review, not app runtime checks.

Return learner goal, acceptance criteria, design decisions, changed files, covered states, actual command/browser evidence, and limitations to the coordinator/reviewer. Fix blocking findings and return updated evidence for re-review. Never self-approve as the independent reviewer.
