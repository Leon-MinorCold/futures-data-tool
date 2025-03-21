import { Icons } from '@/components/ui/icons'

export interface NavItem {
  title: string
  url: string
  disabled?: boolean
  external?: boolean
  // shortcut?: [string, string]
  icon?: keyof typeof Icons
  label?: string
  description?: string
  isActive?: boolean
  permission?: string[]
  children?: NavItem[]
}
