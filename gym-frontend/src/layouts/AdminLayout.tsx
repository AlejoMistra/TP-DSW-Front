// layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/administrativo/Sidebar'

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <Outlet />   {/* acá se renderiza SociosPage, etc */}
        </main>
        <footer>...</footer>
      </div>
    </div>
  )
}