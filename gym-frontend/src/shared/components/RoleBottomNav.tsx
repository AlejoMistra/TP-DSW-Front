import { NavLink } from "react-router-dom"
import type { SidebarLink } from "@/config/navigation"
import { cn } from "@/shared/utils/utils"

const navItemBaseClass =
  "flex h-16 min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium uppercase tracking-wider transition-colors"

type RoleBottomNavProps = {
  links: SidebarLink[]
}

export default function RoleBottomNav({ links }: RoleBottomNavProps) {
  const totalItems = links.length

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/70 backdrop-blur-lg md:hidden">
      <div
        className="mx-auto grid h-16 max-w-7xl items-stretch pb-[env(safe-area-inset-bottom)]"
        style={{ gridTemplateColumns: `repeat(${totalItems}, minmax(0, 1fr))` }}
      >
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.endsWith("/")}
              className={({ isActive }) =>
                cn(navItemBaseClass, isActive && "text-primary font-bold")
              }
            >
              {Icon ? <Icon className="h-5 w-5" /> : null}
              <span>{link.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
