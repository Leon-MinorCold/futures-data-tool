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
    title: 'User Management',
    icon: 'user',
    url: '/dashboard/user-management',
    isActive: false,
  },
]
