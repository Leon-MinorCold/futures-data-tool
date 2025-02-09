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
        icon: 'userPen',
      },
    ],
  },
  {
    title: 'Users',
    icon: 'user',
    url: '/dashboard/users',
    isActive: false,
  },
  {
    title: 'Futures',
    icon: 'employee',
    url: '/dashboard/futures',
    isActive: false,
  },
]
