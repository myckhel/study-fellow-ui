# Frontend architecture

StudyFellow is a client-rendered React + TypeScript app built with Vite and Bun.
The architecture is feature-based and keeps the hackathon learning slice small.
No new dependencies, backend endpoints, authentication, or persistence are introduced.

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
      routes/                    # dashboard and lesson route modules
      components/                # lesson preview and answer form
      content/photosynthesis.ts  # static, attributed demo content
      model/study-store.ts       # shared learning client state
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
shape before importing page code. `/` and `/lesson` are separate dynamic imports;
unknown URLs show a recoverable not-found page. Failed imports/rendering errors
reach the root route error boundary; a full reload can recover stale assets.
A reload also discards current in-memory answers/progress.

Keep the initial shell lightweight. Lazy route files create page boundaries,
but shared Ant Design/Motion dependencies can still be large. Measure emitted
chunks and actual requests before claiming a bandwidth improvement. Do not
silence bundle warnings or force vendor chunking without evidence.

Measured after this refactor: main JS ~611 kB, home ~156 kB, shared learning
chunk ~149 kB, and lesson ~26 kB (minified). The earlier single JS chunk was
~878 kB; total JS is now ~941 kB because Data Mode adds routing capabilities.
The ~611 kB main chunk still triggers Vite’s warning. PWA precaching includes
all these assets, so route splitting does not reduce its total cache/download.

Deployment must serve `index.html` for client routes such as `/lesson`, while
serving actual asset files normally. The PWA caches built app assets; it does
not provide answer persistence, offline API mutations, or synchronized progress.

## State ownership

| State | Owner | Examples |
| --- | --- | --- |
| Transient UI | React component state | expanded note, current answer, submitted flag |
| Shared client/domain state | Feature-local Zustand store | session-only completed lesson count |
| Server data | TanStack Query | future lessons and assessments from a real API |
| Navigable state | React Router URL | page, future shareable lesson/filter parameters |
| Durable local state | Future explicit persistence adapter | resume snapshot with version/migration/reset |

Do not copy query responses into Zustand. Do not put every form keystroke into
a global store. Queries use a 60-second stale window, one retry, and no automatic
window-focus refetch; mutations have no automatic retries. These are initial
low-bandwidth defaults, to override per endpoint when its semantics require it.

The current lesson feedback is fixed demo text, not AI assessment. “Save and
leave” still only navigates home; the current refactor preserves that shell
behavior. Implement actual save/resume as a separate vertical slice with an
explicit storage status and recovery for unavailable/corrupt browser storage.

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
- `bun run test:e2e`: desktop/mobile routing, lesson behavior, direct links,
  not-found recovery and failed lazy import recovery.
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
