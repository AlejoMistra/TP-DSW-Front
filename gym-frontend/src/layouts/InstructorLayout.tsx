import { Outlet } from "react-router-dom"
import RoleSidebar from "@/components/RoleSidebar"
import { INSTRUCTOR_LINKS } from "@/lib/sidebars"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function InstructorLayout() {
  return (
    <SidebarProvider className="p-6">
      <div className="flex h-screen">
        <RoleSidebar links={INSTRUCTOR_LINKS} title="Instructor" />

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