import { HelmetData } from 'react-helmet-async'
import { QueryClient } from '@tanstack/react-query'

export const helmetData = new HelmetData({})

export const helmetContext = helmetData.context

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
    },
  },
})
