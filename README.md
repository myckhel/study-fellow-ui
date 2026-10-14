# StudyFellow UI

Mobile-first React frontend for the StudyFellow hackathon proof of concept.

## Git repository

This directory is a Git submodule of the hackathon workspace, with its own
history on branch `main`. Its remote is
`https://github.com/myckhel/study-fellow-ui.git`. Run Git commands here (or use
`git -C system/study-fellow-ui` from the workspace root).

After the remote repository is created and the UI commits are pushed, clone
the parent with `git clone --recurse-submodules <parent-repository-url>` or run
`git submodule update --init --recursive` in an existing parent checkout.

## Run locally

```sh
bun install
bun run dev
```

## Available commands

- `bun run dev` — start the Vite development server.
- `bun run build` — type-check and create a production build.
- `bun run preview` — preview the production build locally.
- `bun run lint` — run ESLint.

## Stack

- React + TypeScript + Vite
- Tailwind CSS 4 through the Vite plugin; Ant Design for selected controls
- React Router, Zustand, and TanStack Query
- Axios, date-fns, and lodash-es available for data and utility work
- Motion for React for interface transitions, configured to respect reduced-motion preferences
- `vite-plugin-pwa` for a web app manifest and generated service worker
- Playwright Test installed for browser-level checks

The routes are `/` (learning space and resume), `/start` (topic/resource,
goal and time), and `/lesson` (one focused step at a time). The preloaded
photosynthesis fixture supports optional recall, local response-specific feedback,
optional extra practice, a fresh two-criterion transfer check, one targeted retry,
and a recap that keeps first and retry results separate. This is deterministic
frontend demo behavior, with no connected model or backend. Unknown or conflicting
wording prompts clarification; rule scores are limited evidence, not AI grading.

One validated session is saved in this browser's localStorage, including setup,
answer drafts and immutable submitted attempts. Storage failure is visible and
retains the in-tab session; damaged/incompatible snapshots require a confirmed
reset. Restart and clear-progress also require confirmation. No account or
cross-device sync exists. Selecting a file records only its filename: it is not
uploaded, read or parsed. Explicitly choose the photosynthesis sample to proceed;
a topic, resource or custom goal does not generate different lesson content.

Cached production revisits work offline after the app and service worker have
loaded online. A first visit needs network access, and external OpenStax links
need a connection. The source-backed teaching should receive biology review and
learner observation before claims of instructional effectiveness.

## Architecture

The app uses feature-based modules with lazy React Router routes, composed
providers, feature-local Zustand state, a shared Query cache, and an Axios
transport boundary. See [docs/architecture.md](docs/architecture.md) for the
folder structure, state rules, backend integration, and deployment guidance.

Browser checks: `bunx playwright install chromium`, then `bun run test:e2e`.
An existing Chrome can be used through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
After `bun run build`, run `PLAYWRIGHT_PRODUCTION=1 bun run test:e2e --grep
"production cached"` to verify cached reload, resume and assessment offline.
The dev suite covers both desktop and mobile; screenshots/traces are local,
ignored test artifacts.

## Cosmic Observatory theme

`src/index.css` is the canonical token source (`@theme static`, Tailwind 4).
Use semantic utilities such as `bg-ivory`, `bg-surface`, `text-ink`,
`text-muted`, `border-line`, `font-display`, and `shadow-observatory`.
`src/shared/theme/observatory.ts` reads those CSS variables in the browser and maps them to
Ant Design global and component tokens. `ThemeProvider` supplies the theme,
context-aware Ant Design feedback, and reduced-motion preferences.

- Midnight navy: text and observatory panels; ivory: page background.
- Gold: primary actions with navy text; muted blue: orbital decoration.
- Dark blue: links/focus; darker gold: readable gold-accent text.
- System sans-serif: UI and body; local serif stack: main lesson/hero headings.
- Controls: 44px default, 48px large; 12px control and 24px card radii.
- Keep orbit arcs and star markers outside teaching text. Avoid font downloads,
  image backgrounds, and decorative animation.

Use Ant Design component tokens for shared control styling rather than local
color overrides. Use `App.useApp()` for future messages/modals so they inherit
the provider. PWA/browser metadata and the standalone SVG favicon mirror the
brand colors separately because they load before application CSS.

This foundation is a light reading theme with navy feature panels, not a
complete dark mode. Teaching illustrations use lightweight inline SVG with text labels. Prototype limitations and source details are progressively disclosed.
