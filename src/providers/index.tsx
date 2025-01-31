import { Outlet } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { helmetContext, queryClient } from '@/lib/provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthRefreshProvider } from '@/providers/auto-refresh'

export const Providers = () => (
  <HelmetProvider context={helmetContext}>
    <QueryClientProvider client={queryClient}>
      <AuthRefreshProvider>
        <ThemeProvider>
          <Outlet />
          <Toaster expand richColors position="top-center" />
        </ThemeProvider>
      </AuthRefreshProvider>
    </QueryClientProvider>
  </HelmetProvider>
)
