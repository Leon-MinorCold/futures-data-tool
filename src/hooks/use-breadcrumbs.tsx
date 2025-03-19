import { useMemo } from 'react'
import { useLocation } from 'react-router'

type BreadcrumbItem = {
  title: string
  link: string
}

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard/overview': [
    { title: '仪表盘', link: '/dashboard' },
    { title: '总览', link: '/dashboard/overview' },
  ],
  '/dashboard/users': [
    { title: '仪表盘', link: '/dashboard' },
    { title: '用户管理', link: '/dashboard/users' },
  ],
  '/dashboard/futures': [
    { title: '仪表盘', link: '/dashboard' },
    { title: '期货数据管理', link: '/dashboard/futures' },
  ],
  '/dashboard/futures-transaction-tool': [
    { title: '仪表盘', link: '/dashboard' },
    { title: '期货交易系统', link: '/dashboard/futures-transaction-tool' },
  ],
  '/dashboard/futures-transaction-history': [
    { title: '仪表盘', link: '/dashboard' },
    { title: '期货交易记录', link: '/dashboard/futures-transaction-history' },
  ],
}

export function useBreadcrumbs() {
  const pathname = useLocation().pathname

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      }
    })
  }, [pathname])

  return breadcrumbs
}
