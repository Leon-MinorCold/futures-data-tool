import { useMe } from '@/services/user'
import { Navigate, Outlet, useLocation } from 'react-router'

export const AuthGuard = () => {
  // Todo: 增加根据当前role判断用户是否有权限进入当前页面
  // solutions: 根据 navItems变量判断

  const location = useLocation()
  const redirectTo = location.pathname + location.search

  const { user, loading } = useMe()

  if (loading) return null

  if (user) {
    return <Outlet />
  }

  return <Navigate replace to={`/auth/login?redirect=${redirectTo}`} />
}
