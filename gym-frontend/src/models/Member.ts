export type Status = "Activo" | "Inactivo"
export type Role = "Basico" | "Plus" | "Premium"

// Este type esta siendo utilizado por el mockMembers.ts y por la pagina de SociosPage1.tsx
// TODO: Unificar con el Socio model y controlar consistencia con el backend

export type Member = {
  id: string
  name: string
  initials: string
  avatar: string
  email: string
  status: Status
  plan: Role
  joined: string
  nextExpiration?: string
}
