import { Outlet } from 'react-router'
import { AppSidebar } from './app-sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Header from '@/layout/header'

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
