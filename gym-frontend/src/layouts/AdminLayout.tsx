import { Outlet, Link } from 'react-router-dom'

export const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navbar lateral */}
      <nav style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        width: '200px',
        borderRight: '1px solid #ddd'
      }}>
        <h2>Admin</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/admin/socios">Socios</Link>
          </li>
          <li>
            <Link to="#">Clases</Link>
          </li>
          <li>
            <Link to="#">Configuración</Link>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}
