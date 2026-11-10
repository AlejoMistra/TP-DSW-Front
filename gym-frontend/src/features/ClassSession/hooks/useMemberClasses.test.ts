import { describe, it, expect } from 'vitest';
import { getBookingEligibility } from './useMemberClasses';
import type { Member } from '@/features/members/models/Member';
import type { Membership } from '@/features/memberships/models/Membership';

describe('getBookingEligibility', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const activeMember: Member = {
    id: 1,
    name: 'Juan',
    surname: 'Perez',
    email: 'juan@example.com',
    phone: '123456789',
    status: 'ACTIVE',
    docType: 'DNI',
    docNumber: '12345678',
    birthDate: '1990-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  const activeMembership: Membership = {
    id: 10,
    memberId: 1,
    membershipPlanId: 2,
    startDate: '2026-01-01',
    endDate: nextWeek.toISOString(),
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  it('permite reservar si el socio y la membresía están activos y vigentes para la fecha', () => {
    const result = getBookingEligibility(activeMember, activeMembership, tomorrow.toISOString().slice(0, 10));
    expect(result.canBook).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('permite reservar el mismo día que vence la membresía aun con ISO UTC midnight', () => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const todayMembership: Membership = {
      ...activeMembership,
      endDate: `${todayStr}T00:00:00.000Z`,
    };
    const result = getBookingEligibility(activeMember, todayMembership, todayStr);
    expect(result.canBook).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('bloquea reserva si el socio no existe o su estado es INACTIVE', () => {
    const inactiveMember: Member = { ...activeMember, status: 'INACTIVE' };
    const result = getBookingEligibility(inactiveMember, activeMembership, tomorrow.toISOString().slice(0, 10));
    expect(result.canBook).toBe(false);
    expect(result.reason).toBe('Cuenta inactiva');
  });

  it('bloquea reserva si el socio no tiene membresía', () => {
    const result = getBookingEligibility(activeMember, null, tomorrow.toISOString().slice(0, 10));
    expect(result.canBook).toBe(false);
    expect(result.reason).toBe('Membresía inactiva');
  });

  it('bloquea reserva si la membresía tiene estado CANCELLED', () => {
    const cancelledMembership: Membership = { ...activeMembership, status: 'CANCELLED' };
    const result = getBookingEligibility(activeMember, cancelledMembership, tomorrow.toISOString().slice(0, 10));
    expect(result.canBook).toBe(false);
    expect(result.reason).toBe('Membresía inactiva');
  });

  it('bloquea reserva si la membresía está vencida hoy', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);

    const expiredMembership: Membership = { ...activeMembership, endDate: yesterday.toISOString() };
    const result = getBookingEligibility(activeMember, expiredMembership, tomorrow.toISOString().slice(0, 10));
    expect(result.canBook).toBe(false);
    expect(result.reason).toBe('Membresía vencida');
  });

  it('bloquea reserva si la fecha de la sesión supera la fecha de vencimiento de la membresía', () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() + 5);

    const endingSoonMembership: Membership = { ...activeMembership, endDate: expiryDate.toISOString() };
    const result = getBookingEligibility(activeMember, endingSoonMembership, sessionDate.toISOString().slice(0, 10));
    expect(result.canBook).toBe(false);
    expect(result.reason).toBe('Membresía no cubre la fecha');
  });

  it('bloquea reserva si hubo un error de conexión al consultar la membresía (lookup failure)', () => {
    const result = getBookingEligibility(activeMember, null, tomorrow.toISOString().slice(0, 10), {
      membershipFetchFailed: true,
    });
    expect(result.canBook).toBe(false);
    expect(result.reason).toBe('Error al verificar membresía');
  });

  it('bloquea reserva si la fecha de la sesión es previa al inicio de la membresía (startDate futura)', () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const futureMembership: Membership = {
      ...activeMembership,
      startDate: nextWeek.toISOString(),
      endDate: nextMonth.toISOString(),
    };

    const result = getBookingEligibility(activeMember, futureMembership, tomorrow.toISOString().slice(0, 10));
    expect(result.canBook).toBe(false);
    expect(result.reason).toBe('Membresía aún no vigente');
  });
});
