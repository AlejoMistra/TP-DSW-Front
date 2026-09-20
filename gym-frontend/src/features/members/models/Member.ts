import type { PaymentMethod } from '@/features/payments/models/Payment';

export type { PaymentMethod };

export type Status = 'ACTIVE' | 'INACTIVE';
export type DocType = 'DNI' | 'PASAPORTE';

export type Member = {
  id: number;
  name: string;
  surname: string;
  docType: DocType;
  docNumber: string;
  birthDate: string;
  email: string;
  phone: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateMemberInput = {
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  docType: DocType;
  docNumber: string;
  birthDate: string;
  status: Status;
  membershipPlanId: number;
  payment?: {
    amount: number;
    method: PaymentMethod;
  };
};

export type UpdateMemberInput = Partial<
  Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

