import { NavItem } from '@/types/nav'

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    children: [],
  },
  {
    title: 'Account',
    url: '#',
    icon: 'billing',
    isActive: false,
    children: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'users',
      },
    ],
  },
  {
    title: 'Users',
    icon: 'users',
    url: '/dashboard/users',
    isActive: false,
    permission: ['admin'],
  },
  {
    title: 'Futures',
    icon: 'employee',
    url: '#',
    isActive: false,
    children: [
      {
        title: '期货数据管理',
        icon: 'employee',
        url: '/dashboard/futures',
        isActive: false,
      },
      {
        title: 'Transaction Tool',
        icon: 'employee',
        url: '/dashboard/futures-transaction-tool',
        isActive: false,
      },
      {
        title: 'Transaction History',
        icon: 'employee',
        url: '/dashboard/futures-transaction-history',
        isActive: false,
      },
    ],
  },
]
