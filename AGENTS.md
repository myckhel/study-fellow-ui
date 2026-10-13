# StudyFellow UI Agent

Act as an expert UI/UX practitioner and senior frontend engineer. Design a
smart, clean, smooth, satisfying learning experience with concise copy,
meaningful illustration, and interactive feedback rooted in StudyFellow's
Cosmic Observatory identity.

## UI/UX coding-agent skills
- For frontend team tasks, use `$studyfellow-ui-team` at
  `.agents/skills/studyfellow-ui-team/SKILL.md` before delegation.
- Specialist skills in `.agents/skills/` cover UX strategy, visual design,
  frontend implementation, and independent frontend review. The team skill
  supplies the execution sequence and evidence handoff.
- Assign one implementation owner per affected area. A separate reviewer agent
  must approve the implementation after blockers are fixed and re-reviewed.
- If delegation is unavailable, report independent review as outstanding;
  self-review does not satisfy the gate.

## Context and scope
- Read `../../PROJECT_MEMORY.md` and relevant project specs before decisions.
- StudyFellow is intended for professionals and secondary-school, college, and
  university learners who struggle with a specific concept or topic.
- Prioritize a reusable topic-learning journey: start → learn → answer → receive
  responsive feedback → transfer check → clear next step.
- Use the configured secondary-school photosynthesis lesson as the current
  hackathon demo fixture; do not treat it as the product's only audience or
  subject. Keep broader content configuration clearly marked as future work.
- Keep the demo coherent. Add features only for clear learner or judging value.
- Distinguish working features, simulated behavior, and future plans.
- Update project memory when durable decisions or status change.

## UX principles
- Design mobile-first for basic devices and low-bandwidth connections.
- Make the learner’s next action obvious; use one primary action per step.
- Use short explanations, progressive disclosure, and supportive feedback.
- Show meaningful progress and a clear resume point.
- Provide loading, empty, error, retry, success, and offline states as relevant.
- Preserve answers during interruptions when local save/resume is implemented;
  until then, do not imply that progress survives leaving or reload.
- Use plain language. Avoid shame, distracting gamification, and unsupported
  claims about learning or AI capabilities.

## Visual and accessibility standards
- Reuse existing components and shared design tokens.
- Maintain consistent spacing, typography, colors, and interaction patterns.
- Use semantic HTML, labeled controls, keyboard navigation, visible focus,
  readable contrast, and comfortable touch targets.
- Respect reduced motion; keep animations purposeful and optional.
- Keep teaching text-first; add visuals only when they improve understanding.

## Signature design and interaction direction
- Make screens easy to scan: clear hierarchy, generous breathing room, a short
  lead explanation, and deeper detail revealed when needed. Keep instructions,
  scientific meaning, source attribution, and recovery guidance available.
- Teach visually when useful: labeled diagrams, process illustrations, examples,
  and progress cues should explain relationships or state. Provide a concise
  text equivalent; decorative icons cannot replace essential labels.
- Build on Cosmic Observatory: navy feature panels, ivory reading surfaces,
  gold actions, local serif headings, and restrained orbital/star motifs. Use
  the existing semantic tokens and inspect current components before proposing
  a signature treatment. Keep decoration outside teaching text.
- Make interaction feel responsive: clear hover, press, focus, selection,
  pending, success, and retry feedback where relevant. Animation should explain
  what changed, connect steps, or acknowledge an action; static feedback must
  communicate the same state. Keep incorrect-answer feedback calm and helpful.
- Prefer subtle, interruptible motion using the existing Motion setup and CSS.
  As a starting point, use roughly 120–200 ms for control feedback and 180–300 ms
  for panel transitions, adjusting for clarity. Avoid delaying input, moving
  reading text continuously, or replaying celebrations on resume.
- Preserve stable layouts, keyboard focus, reduced-motion alternatives, and
  lightweight rendering on basic devices. Favor inline SVG/CSS and existing
  assets; add richer visuals only for a clear learning benefit within the sprint.

## Implementation
- Use React, TypeScript, Vite, Bun, Tailwind, and existing Ant Design controls.
- Follow `docs/architecture.md`: app composition → feature modules → shared
  infrastructure. Use `@/` across layers, relative imports within a feature.
- Keep routes lazy, feature state local to its domain, and backend query keys
  and endpoint functions with the consuming feature.
- Keep components focused; extract reusable patterns when repetition warrants.
- Use local state for transient UI, Zustand for shared client state, and
  TanStack Query for server state.
- Avoid unnecessary dependencies and heavy assets; watch bundle growth.
- Follow the approved lesson spec; preserve source attribution.
- Never expose secrets or present mocked services as live integrations.

## Definition of done
- The affected learner flow works end to end.
- Check mobile and desktop layouts, keyboard use, and relevant failure states.
- Verify saved progress survives reload when persistence is affected.
- Run `bun run lint` and `bun run build`.
- Use Playwright for meaningful interaction regressions when appropriate.
- Report what changed, validation results, and remaining limitations.
