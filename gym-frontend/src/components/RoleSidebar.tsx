import React from "react"
import { NavLink } from "react-router-dom"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { SidebarLink } from "@/lib/sidebars"

export default function RoleSidebar({
  links,
  title,
  children,
  defaultOpen = true,
}: {
  links: SidebarLink[]
  title?: React.ReactNode
  children?: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen">
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="px-3 py-2 flex items-center justify-between">
            <div className="font-semibold">{title ?? "App"}</div>
            <SidebarTrigger />
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
          </SidebarContent>

          <SidebarFooter className="px-3 py-2">
            {/* footer: avatar, logout, etc. */}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}