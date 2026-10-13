import { QueryClient } from '@tanstack/react-query'

// One cache per browser app. Feature query keys/endpoints live with the feature.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
})
