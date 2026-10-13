import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layout'
import { NotFound, RouteError, RouteLoading } from './route-feedback'

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: RouteLoading,
    children: [
      { index: true, lazy: () => import('@/features/learning/routes/home-route') },
      { path: 'lesson', lazy: () => import('@/features/learning/routes/lesson-route') },
      { path: '*', Component: NotFound },
    ],
  },
])
