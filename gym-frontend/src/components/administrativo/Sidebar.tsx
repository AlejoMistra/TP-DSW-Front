import { NavLink } from 'react-router-dom'

const links = [
  { to: '/administrativo', label: 'Dashboard' },
  { to: '/administrativo/clases', label: 'Clases' },
  { to: '/administrativo/socios', label: 'Socios' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <nav className="flex flex-col gap-1 p-4">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end                          // evita que /administrador matchee todo
            className={({ isActive }) =>
              isActive
                ? 'bg-accent text-accent-foreground rounded px-3 py-2'
                : 'px-3 py-2 rounded hover:bg-muted'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}