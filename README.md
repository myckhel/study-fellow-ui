# StudyFellow UI

Mobile-first React frontend for the StudyFellow hackathon proof of concept.

## Git repository

This directory is an independent Git repository on branch `main`, nested inside
the hackathon workspace. The parent repository ignores this directory; run Git
commands here (or use `git -C system/study-fellow-ui` from the workspace root).
No remote is configured yet. This is not a Git submodule; converting it to one
requires a separate repository URL.

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
