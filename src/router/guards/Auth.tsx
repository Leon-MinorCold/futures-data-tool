import { useMe } from '@/services/user'
import { Navigate, Outlet, useLocation } from 'react-router'

export const AuthGuard = () => {
  const location = useLocation()
  const redirectTo = location.pathname + location.search

  const { user, loading } = useMe()

  if (loading) return null

  if (user) {
    return <Outlet />
  }

  return <Navigate replace to={`/auth/login?redirect=${redirectTo}`} />
}
