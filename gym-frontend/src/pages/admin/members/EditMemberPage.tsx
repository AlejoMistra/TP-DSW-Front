import { useNavigate } from 'react-router-dom'
import BreadCrumb from '@/shared/components/BreadCrumb'
import { Button } from '@/shared/components/ui/button'
import MemberForm from '@/features/members/components/MemberForm'
import { useEditMember } from '@/features/members/hooks/useEditMember'
import { usePageTitle } from '@/shared/context/PageHeaderContext'

export default function EditMemberPage() {
  usePageTitle("Editar Socio")
  const navigate = useNavigate()
  const { id, member, loading, handleSubmit } = useEditMember()

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Editar Socio' },
          ]}
        />
        <div className="rounded-xl border bg-background px-4 py-6 sm:px-6 text-center">
          <p>Cargando datos del Socio...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Editar Socio' },
          ]}
        />
        <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          No se encontró el miembro.
        </div>
      </div>
    )
  }

  const memberName = `${member.name} ${member.surname}`

  return (
    <div className="space-y-4">
      <BreadCrumb
        crumbs={[
          { label: 'Socios', href: '/administrativo/socios' },
          { label: memberName, href: `/administrativo/socios/${id}` },
          { label: 'Editar' },
        ]}
      />

      <div>
        <MemberForm member={member} onSubmit={handleSubmit} />
      </div>

      <section className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/administrativo/socios/${id}`)}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button type="submit" form="member-form" className="w-full sm:w-auto">
          Guardar cambios
        </Button>
      </section>
    </div>
  )
}