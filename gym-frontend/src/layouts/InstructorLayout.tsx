import { Outlet } from "react-router-dom"
import RoleSidebar from "@/components/RoleSidebar"
import { INSTRUCTOR_LINKS } from "@/lib/sidebars"

export default function InstructorLayout() {
  return (
    <RoleSidebar links={INSTRUCTOR_LINKS} title="Instructor">
      <main className="p-6 h-full overflow-auto">
        <Outlet />
      </main>
    </RoleSidebar>
  )
}