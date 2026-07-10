import type { ReactNode } from "react"

export type SidebarLink = {
  to: string
  label: string
  icon?: ReactNode
}

export const ADMIN_LINKS: SidebarLink[] = [
  { to: "/administrativo/", label: "Inicio" },
  { to: "/administrativo/clases", label: "Clases" },
  { to: "/administrativo/socios", label: "Socios" },
]

export const INSTRUCTOR_LINKS: SidebarLink[] = [
  { to: "/instructor/", label: "Inicio" },
  { to: "/instructor/rutinas", label: "Rutinas" },
  { to: "/instructor/ejercicios", label: "Ejercicios" }, 
]

export const MEMBER_LINKS: SidebarLink[] = [
  { to: "/socio/", label: "Inicio" },
  { to: "/socio/rutinas", label: "Rutinas" }, 
  { to: "/socio/clases", label: "Clases" },
]