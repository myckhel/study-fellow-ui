import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layout'
import { NotFound, RouteError, RouteLoading } from './route-feedback'

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: RouteLoading,
    children: [
      {
        index: true,
        lazy: () => import('@/features/learning/routes/home-route'),
      },
      {
        path: 'start',
        lazy: () => import('@/features/learning/routes/start-route'),
      },
      { path: 'legacy-start', lazy: () => import('@/features/learning/routes/legacy-start-route') },
      { path: 'session', lazy: () => import('@/features/learning/routes/session-route') },
      {
        path: 'lesson',
        lazy: () => import('@/features/learning/routes/lesson-route'),
      },
      { path: '*', Component: NotFound },
    ],
  },
])
