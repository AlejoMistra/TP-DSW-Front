import { Outlet } from "react-router-dom"
import RoleSidebar from "@/components/RoleSidebar"
import { INSTRUCTOR_LINKS } from "@/lib/sidebars"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function InstructorLayout() {
  return (
    <SidebarProvider className="p-6">
      <RoleSidebar links={INSTRUCTOR_LINKS} title="Instructor">
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