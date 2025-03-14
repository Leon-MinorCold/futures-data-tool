import { NavItem } from '@/types/nav'

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    children: [],
  },
  // {
  //   title: 'Account',
  //   url: '#',
  //   icon: 'billing',
  //   isActive: false,
  //   children: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'users',
  //     },
  //   ],
  // },
  {
    title: '用户管理',
    icon: 'users',
    url: '/dashboard/users',
    isActive: false,
    permission: ['admin'],
  },
  {
    title: '期货相关',
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
        title: '交易系统',
        icon: 'employee',
        url: '/dashboard/futures-transaction-tool',
        isActive: false,
      },
      {
        title: '交易记录',
        icon: 'employee',
        url: '/dashboard/futures-transaction-history',
        isActive: false,
      },
    ],
  },
]
