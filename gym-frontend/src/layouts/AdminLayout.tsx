import { Outlet, Link } from 'react-router-dom'

export const AdminLayout = () => {
  return (//Mover la barra lateral pegada al margen izquierdo
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navbar lateral */}
      <nav style={{
        backgroundColor: '#f0f0f03f',
        padding: '20px',
        width: '200px',
        height: '100vh',
        top: 0,
        left: 0,
      }}>
        <h2>Admin</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/admin/socios">Socios</Link>
          </li>
          <li>
            <Link to="/admin/clases">Clases</Link>
          </li>
          <li>
            <Link to="#">Configuración</Link>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <main style={{ padding: '20px', flex: 1 }}>
        <Outlet />
      </main>
    </div >
  )
}
