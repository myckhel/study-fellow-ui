import { createBrowserRouter, redirect } from 'react-router'
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
      { path: 'legacy-start', loader: () => redirect('/') },
      { path: 'session', lazy: () => import('@/features/learning/routes/session-route') },
      {
        path: 'lesson',
        loader: () => redirect('/'),
      },
      { path: '*', Component: NotFound },
    ],
  },
])
