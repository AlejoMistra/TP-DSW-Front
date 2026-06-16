import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import RoleSidebar from "@/components/RoleSidebar"
import { SOCIO_LINKS } from '@/lib/sidebars'

export default function InstructorLayout() {
  return (
    <SidebarProvider className="p-6">
      <RoleSidebar links={SOCIO_LINKS} title="Socio">
        <header>
          <SidebarTrigger />
        </header>
        <main className="h-full">
          <Outlet />
        </main>
        <footer>Footer</footer>
      </RoleSidebar>
    </SidebarProvider>
  )
}