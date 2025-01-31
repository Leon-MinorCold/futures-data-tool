import { Navigate, Outlet, useSearchParams } from 'react-router'
import { useAuthStore } from '@/store/auth'

export const GuestGuard = () => {
  const isLoggedIn = useAuthStore((state) => !!state.user)
  const [searchParams] = useSearchParams()

  const redirect = searchParams.get('redirect') ?? '/dashboard'

  if (isLoggedIn) {
    return <Navigate to={redirect} />
  }

  return <Outlet />
}
