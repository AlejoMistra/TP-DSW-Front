import { Outlet } from "react-router-dom"
import RoleSidebar from "@/components/RoleSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ADMIN_LINKS, INSTRUCTOR_LINKS, MEMBER_LINKS } from "@/lib/sidebars"

const roleLinksMap = {
  admin: ADMIN_LINKS,
  instructor: INSTRUCTOR_LINKS,
  member: MEMBER_LINKS,
}

const roleTitleMap = {
  admin: "Administrativo",
  instructor: "Instructor",
  member: "Socio",
}

export default function RoleLayout({
  role,
}: {
  role: "admin" | "instructor" | "member"
}) {
  const links = roleLinksMap[role]
  const title = roleTitleMap[role]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RoleSidebar links={links} title={title} />

        <SidebarInset className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">{title}</span>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>

          <footer className="border-t px-4 py-3 text-center text-sm text-muted-foreground">
            © 2026 Gym Management
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}