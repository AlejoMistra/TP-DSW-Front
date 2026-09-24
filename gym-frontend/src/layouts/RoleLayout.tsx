import { Outlet, useNavigate } from "react-router-dom"
import RoleBottomNav from "@/shared/components/RoleBottomNav"
import RoleSidebar from "@/shared/components/RoleSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { ROLE_NAVIGATION, type AppRole } from "@/config/navigation"
import { Bell, Settings, CircleUser, LogOut } from "lucide-react"
import { ThemeToggle } from "@/shared/components/ThemeToggle"
import { PageHeaderProvider, usePageHeader } from "@/shared/context/PageHeaderContext"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"

function RoleLayoutContent({ role }: { role: AppRole }) {
  const { links, title } = ROLE_NAVIGATION[role]
  const { title: headerTitle } = usePageHeader()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const systemName = "MyGymManager"

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RoleSidebar links={links} title={systemName} />

        <SidebarInset className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="hidden md:inline-flex" />
            <span className="text-2xl font-medium">{headerTitle || `Portal ${title}`}</span>
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Settings className="h-5 w-5 text-muted-foreground" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <CircleUser className="h-6 w-6" />
                    <span className="sr-only">Menú de usuario</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email || 'Usuario'}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        Rol: {role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </main>

          <footer className="border-t px-4 py-3 pb-20 text-center text-sm text-muted-foreground md:pb-3">
            © 2026 Gym Management
          </footer>

          <RoleBottomNav links={links} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default function RoleLayout({
  role,
}: {
  role: AppRole
}) {
  return (
    <PageHeaderProvider>
      <RoleLayoutContent role={role} />
    </PageHeaderProvider>
  )
}