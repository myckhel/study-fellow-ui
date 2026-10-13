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

The current routes are `/` (learning dashboard) and `/lesson` (photosynthesis lesson shell). The adaptive response branches, transfer-question scoring, and durable resume behavior are not implemented yet. The lesson uses the owner's chosen scenario; it should receive a biology review before learner-facing use.

## Cosmic Observatory theme

`src/index.css` is the canonical token source (`@theme static`, Tailwind 4).
Use semantic utilities such as `bg-ivory`, `bg-surface`, `text-ink`,
`text-muted`, `border-line`, `font-display`, and `shadow-observatory`.
`src/theme.ts` reads those CSS variables in the browser and maps them to
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
complete dark mode. Existing lesson behavior remains a prototype.
