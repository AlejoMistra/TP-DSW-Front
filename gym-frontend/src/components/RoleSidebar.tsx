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
  SidebarInset,

  SidebarMenuSkeleton
} from "@/components/ui/sidebar"
import type { SidebarLink } from "@/lib/sidebars"

export default function RoleSidebar({
  links,
  title,
  children,
}: {
  links: SidebarLink[]
  title?: React.ReactNode
  children?: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <div className="flex h-screen">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="px-3 py-2 flex items-center justify-between">
          <div className="font-semibold">{title ?? "App"}</div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {links.map((l) => (
              <SidebarMenuItem key={l.to}>
                <SidebarMenuButton asChild>
                  <NavLink to={l.to} end>
                    {l.label}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="px-3 py-2">
          {/* footer: avatar, logout, etc. */}
          SidebarFooter
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1">
        {children}
      </SidebarInset>
    </div>
  )
}