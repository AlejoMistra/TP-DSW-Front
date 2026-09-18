import { useNavigate } from 'react-router-dom'
import MembersDataTable from '@/features/members/components/MembersDataTable'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog'
import { useMembers } from '@/features/members/hooks/useMembers'
import { usePageTitle } from '@/shared/context/PageHeaderContext'

export default function MembersPage() {
  usePageTitle("Directorio de Socios")
  const navigate = useNavigate()
  const {
    members,
    loading,
    activeCount,
    inactiveCount,
    totalCount,
    handleDelete,
  } = useMembers()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border bg-background px-4 py-6 sm:px-6 text-center">
          <p>Cargando Socios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <MembersDataTable
          initialData={members}
          title="Listado de Socios"
          subtitle="Socios registrados en el sistema"
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          totalCount={totalCount}
          onNew={() => navigate('/administrativo/socios/nuevo')}
          onEdit={(id) => navigate(`/administrativo/socios/editar/${id}`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
