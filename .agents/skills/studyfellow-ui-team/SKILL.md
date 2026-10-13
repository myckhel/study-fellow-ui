---
name: studyfellow-ui-team
description: "Coordinate delegated UI/UX design, frontend implementation, and independent reviewer handoff for StudyFellow frontend changes. Use for team-based frontend work; not backend-only or outreach tasks."
---

# StudyFellow UI Team

Locate the frontend root containing package.json and src/; read its AGENTS.md and docs/architecture.md. In the parent hackathon workspace, read PROJECT_MEMORY.md and the relevant outputs/studyfellow-project-spec.md, outputs/studyfellow-ux-blueprint.md, or outputs/photosynthesis-demo-spec.md; use the latest project spec when older UX framing conflicts. If those parent specs are unavailable, use the task brief and report the missing context. Keep photosynthesis as a demo fixture, not the whole audience. Preserve Cosmic Observatory tokens: navy panels, ivory reading surfaces, gold controls, local typography. Favor concise copy, one primary action, mobile-first layouts, keyboard access, visible focus, readable contrast, comfortable touch targets, and reduced motion. Never claim fixed demo feedback is adaptive AI or in-memory progress is durable resume. Stay within the assigned task and existing architecture/dependencies.


## Design direction in the team brief

Apply the frontend AGENTS.md signature design and interaction direction to every assignment. Ask the UX and visual specialists to work as expert UI/UX practitioners: smart, concise, clean, smooth, satisfying, illustrative, and recognizably StudyFellow. Merge their proposals into implementable decisions, rather than leaving these as mood adjectives.

Include a screen hierarchy, what stays visible versus disclosed, the learning purpose and text equivalent of each illustration, and a small interaction specification: trigger → visible state → feedback/motion → reduced-motion behavior. Prioritize polish on the core learning flow within the hackathon scope. Require evidence of the implemented interaction and identity as well as functional correctness.

## Execute the team

This skill coordinates real coding agents; do not stop at generating a team description. Use the available agent delegation tools (in this environment, collaboration.spawn_agent, send_message, and followup_task). If delegation is unavailable, report that independent review is outstanding; self-review cannot satisfy it.

1. Inspect the affected code and establish learner goal, current behavior, scope, and observable acceptance criteria.
2. Delegate read-only UX exploration using $studyfellow-ux-strategist and visual exploration using $studyfellow-visual-designer. Pass each agent the absolute sibling SKILL.md path, task brief, frontend root, and relevant files. Require the agent to read that skill. These can run concurrently.
3. Merge their results into one concrete implementation brief. Resolve design disagreements before edits; specify behavior, copy, responsive states, and acceptance checks. Assign a single implementation owner per file/area.
4. Delegate implementation with $studyfellow-frontend-engineer, its absolute SKILL.md path, the merged brief, and explicit file ownership. Serialize overlapping edits. Reuse available agent slots sequentially; do not exceed the environment concurrency limit.
5. Delegate review to a different agent using $studyfellow-frontend-reviewer, its absolute SKILL.md path, the brief, changed files/diff, and verification evidence. Reviewers must not author implementation changes.
6. Route blocking findings or missing evidence back to the engineer. Send the revised diff/evidence to the reviewer for re-review. If a blocker cannot be resolved, report incomplete work and the reason. Approval requires no unresolved blockers and sufficient acceptance evidence.
7. Report actual changes, checks, reviewer verdict, and limitations; update durable project memory.

Sibling role skills live beside this skill folder. Resolve paths from this SKILL.md location rather than assuming a working directory. Invoke only the relevant specialist when the user asks for a standalone audit/design task; an audit is read-only unless fixes were requested.

## Handoff packet

Include learner goal and affected flow; acceptance criteria; agreed flow/copy/tokens/responsive/motion decisions; implementation owner and changed files; relevant states covered or inapplicable; command and browser results; asset impact where relevant; known limitations; requested review. Do not invent passing evidence.
