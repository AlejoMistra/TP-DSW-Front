import type { ReactNode } from "react"

export type SidebarLink = {
  to: string
  label: string
  icon?: ReactNode
}

export const INSTRUCTOR_LINKS: SidebarLink[] = [
  { to: "/instructor/", label: "Inicio" },
  { to: "/instructor/rutinas", label: "Rutinas" },
  { to: "/instructor/ejercicios", label: "Ejercicios" }, 
]