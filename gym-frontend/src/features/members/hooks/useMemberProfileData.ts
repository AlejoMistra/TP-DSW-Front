import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { memberService } from '@/features/members/api/memberService';
import type { Member } from '@/features/members/models/Member';
import type { MemberFormValues } from '@/features/members/models/memberFormSchema';

export function useMemberProfileData() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const requestMember = async () => {
      try {
        const memberData = await memberService.getMe();

        if (cancelled) {
          return;
        }

        setMember(memberData);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : 'Error al cargar tus datos';

        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void requestMember();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (data: MemberFormValues) => {
    try {
      setSaving(true);

      const updatedMember = await memberService.updateMe({
        email: data.email,
        phone: data.phone ?? null,
      });

      setMember(updatedMember);
      toast.success('Tus datos fueron actualizados correctamente');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar tus datos';

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return {
    member,
    loading,
    saving,
    error,
    handleSubmit,
  };
}
