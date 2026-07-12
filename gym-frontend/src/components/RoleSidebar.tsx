import React from "react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import type { SidebarLink } from "@/lib/sidebars"

// TODO: Acomodar el tamaño de los iconos y el texto cuando la sidebar está colapsada. Actualmente el texto sobresale y los iconos se ven muy chicos.

type RoleSidebarProps = {
  links: SidebarLink[],
  title?: React.ReactNode,
  footer?: React.ReactNode,
}

export default function RoleSidebar({
  links,
  title = "App",
  footer,
}: RoleSidebarProps) {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between px-3 py-2">
        <div className="font-semibold">{title}</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.to}>
              <SidebarMenuButton asChild>
                <NavLink to={link.to} end={link.to.endsWith("/")}>
                  {link.icon ? <link.icon /> : null}
                  <span>{link.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </Sidebar>
  )
}