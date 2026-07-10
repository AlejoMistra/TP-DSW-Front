export type Status = "Active" | "Invited" | "Inactive"
export type Role = "Admin" | "Editor" | "Viewer"

// Este tipo esta siendo utilizado por el mockMembers.ts y por la pagina de SociosPage1.tsx
// TODO: Unificar con el Socio model y controlar consistencia con el backend

export type Member = {
  id: string
  name: string
  initials: string
  avatar: string
  email: string
  status: Status
  role: Role
  joined: string
  nextExpiration?: string
}
