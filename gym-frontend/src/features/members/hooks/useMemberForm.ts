import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberFormSchema, type MemberFormValues } from '../models/memberFormSchema';
import type { Member } from '../models/Member';

export function useMemberForm(member?: Member) {
  return useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: member?.name ?? '',
      surname: member?.surname ?? '',
      email: member?.email ?? '',
      phone: member?.phone ?? '',
      docType: member?.docType ?? 'DNI',
      docNumber: member?.docNumber ?? '',
      birthDate: member?.birthDate ? new Date(member.birthDate) : undefined,
      status: member?.status ?? 'ACTIVE',
    },
  });
}