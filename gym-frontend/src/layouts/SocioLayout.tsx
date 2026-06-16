import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import RoleSidebar from "@/components/RoleSidebar"
import { SOCIO_LINKS } from '@/lib/sidebars'

export default function InstructorLayout() {
  return (
    <SidebarProvider className="p-6">
      <div className="flex h-screen">
        <RoleSidebar links={SOCIO_LINKS} title="Socio" />
        <SidebarInset className="flex-1">
          <header>
            <SidebarTrigger />
          </header>
          <main className="h-full">
            <Outlet />
          </main>
          <footer>Footer</footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}