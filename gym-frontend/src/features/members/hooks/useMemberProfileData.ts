import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { memberService } from '@/features/members/api/memberService'
import type { Member } from '@/features/members/models/Member'
import type { MemberFormValues } from '@/features/members/models/memberFormSchema'

export function useMemberProfileData(memberId: number | null) {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(memberId !== null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(
    memberId === null
      ? 'No se encontró el socio autenticado'
      : null,
  )

  useEffect(() => {
    if (!memberId) {
      return
    }

    let cancelled = false

    const requestMember = async () => {
      try {
        const memberData = await memberService.getMemberById(memberId)

        if (cancelled) {
          return
        }

        setMember(memberData)
        setError(null)
      } catch (err) {
        if (cancelled) {
          return
        }

        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar tus datos'

        setError(message)
        toast.error(message)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void requestMember()

    return () => {
      cancelled = true
    }
  }, [memberId])

  const handleSubmit = async (data: MemberFormValues) => {
    if (!memberId) {
      toast.error('No se encontró el socio autenticado')
      return
    }

    try {
      setSaving(true)

      const updatedMember = await memberService.update(memberId, {
        email: data.email,
        phone: data.phone ?? null,
      })

      setMember(updatedMember)
      toast.success('Tus datos fueron actualizados correctamente')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al actualizar tus datos'

      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return {
    member,
    loading,
    saving,
    error,
    handleSubmit,
  }
}