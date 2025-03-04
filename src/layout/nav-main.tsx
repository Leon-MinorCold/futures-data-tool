import { ChevronRight } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Link, useLocation } from 'react-router'
import { navItems } from '@/constants'
import { Icons } from '@/components/ui/icons'
import { useAuthStore } from '@/store/auth'

export default function NavMain() {
  const pathname = useLocation().pathname
  const user = useAuthStore((state) => state.user)

  const role = user?.role ?? 'admin'

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarMenu>
        {navItems
          .filter((item) => !item.permission || item.permission.includes(role))
          .map((item) => {
            const Icon = item.icon ? Icons[item.icon] : Icons.logo
            const open =
              item.isActive ||
              !!item.children?.find((sub) => sub.url === pathname)

            if (item?.children && !!item.children.length) {
              const filteredChildren = item.children.filter(
                (sub) => !sub.permission || sub.permission.includes(role)
              )

              if (filteredChildren.length === 0) return null

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={open}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {filteredChildren.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.url}
                >
                  <Link to={item.url}>
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
