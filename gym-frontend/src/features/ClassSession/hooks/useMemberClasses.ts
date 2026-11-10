import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { classSessionService } from '../api/classSessionService';
import { classBookingService } from '@/features/classBooking/api/classBookingService';
import { classScheduleService } from '@/features/classSchedule/api/classScheduleService';
import type {
  MemberClassSession,
  ClassBooking,
  ClassDateOption,
  ClassCategory,
} from '../models/ClassSession';
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule';

import { memberService } from '@/features/members/api/memberService';
import type { Member } from '@/features/members/models/Member';
import { membershipService } from '@/features/memberships/api/membershipService';
import type { Membership } from '@/features/memberships/models/Membership';
import { parseDateString, toLocalDateString } from '../lib/dateUtils';

export interface MembershipAlertInfo {
  type: 'error' | 'warning';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function generateNextDays(count: number = 7): ClassDateOption[] {
  const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  const result: ClassDateOption[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateNum = String(d.getDate()).padStart(2, '0');
    const fullDate = `${year}-${month}-${dateNum}`;

    result.push({
      day: days[d.getDay()],
      date: String(d.getDate()),
      fullDate,
      month: months[d.getMonth()],
      isToday: i === 0,
      active: i === 0,
    });
  }

  return result;
}

export function getBookingEligibility(
  member: Member | null,
  membership: Membership | null,
  sessionDateRaw: string | Date,
  options?: { membershipFetchFailed?: boolean },
): { canBook: boolean; reason?: string } {
  if (options?.membershipFetchFailed) {
    return { canBook: false, reason: 'Error al verificar membresía' };
  }
  if (!member || member.status !== 'ACTIVE') {
    return { canBook: false, reason: 'Cuenta inactiva' };
  }
  if (!membership || membership.status !== 'ACTIVE') {
    return { canBook: false, reason: 'Membresía inactiva' };
  }

  const now = new Date();
  const membershipExpiry =
    typeof membership.endDate === 'string'
      ? parseDateString(membership.endDate)
      : new Date(membership.endDate);
  membershipExpiry.setHours(23, 59, 59, 999);

  if (membershipExpiry < now) {
    return { canBook: false, reason: 'Membresía vencida' };
  }

  const sessionDate =
    typeof sessionDateRaw === 'string'
      ? parseDateString(sessionDateRaw)
      : new Date(sessionDateRaw);

  if (sessionDate > membershipExpiry) {
    return { canBook: false, reason: 'Membresía no cubre la fecha' };
  }

  return { canBook: true };
}

function normalizeDateStr(rawDate: string | Date | undefined | null): string {
  if (!rawDate) return '';
  const d = typeof rawDate === 'string' ? parseDateString(rawDate) : rawDate;
  return toLocalDateString(d);
}

export function useMemberClasses() {
  const dates = useMemo(() => generateNextDays(7), []);
  const [selectedDate, setSelectedDate] = useState<string>(
    dates[0]?.fullDate || '',
  );
  const [activeCategory, setActiveCategory] = useState<ClassCategory>('Todos');

  const [rawSessions, setRawSessions] = useState<MemberClassSession[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [membershipError, setMembershipError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setMembershipError(false);

      const startDate = dates[0]?.fullDate;
      const endDate = dates[dates.length - 1]?.fullDate;

      let membershipData: Membership | null = null;
      let membershipFetchFailed = false;

      const membershipPromise = membershipService
        .getMyMembership()
        .then((data) => {
          membershipData = data;
        })
        .catch((err: unknown) => {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            // 404 confirmado: el socio existe pero no tiene membresía
            membershipData = null;
          } else {
            // Error de red, 500, timeout, etc.
            membershipFetchFailed = true;
          }
        });

      const [
        memberData,
        _membershipResult,
        sessionsData,
        bookingsData,
        schedulesData,
      ] = await Promise.all([
        memberService.getMe(),
        membershipPromise,
        classSessionService.getAll({ startDate, endDate }).catch(() => []),
        classBookingService.getMyBookings().catch(() => [] as ClassBooking[]),
        classScheduleService.getAll().catch(() => [] as ClassSchedule[]),
      ]);

      setCurrentMember(memberData);
      setMembership(membershipData);
      setMembershipError(membershipFetchFailed);
      setBookings(bookingsData);
      setSchedules(schedulesData);

      // Schedule map
      const scheduleMap = new Map(schedulesData.map((s) => [String(s.id), s]));

      // Map sessions with enriched relations and reservation status
      const mapped: MemberClassSession[] = sessionsData.map((session) => {
        const sched =
          session.classSchedule ??
          scheduleMap.get(String(session.classScheduleId));
        const inst = session.instructor ?? null;

        const userBooking = bookingsData.find(
          (b) =>
            b.memberId === memberData.id &&
            b.classSessionId === session.id &&
            b.status === 'CONFIRMED' &&
            !b.deletedAt,
        );

        const remainingCapacity =
          session.remainingCapacity ?? sched?.maxCapacity ?? 15;

        const eligibility = getBookingEligibility(
          memberData,
          membershipData,
          session.date,
          { membershipFetchFailed },
        );

        return {
          ...session,
          classSchedule: sched,
          instructor: inst,
          remainingCapacity,
          isReserved: Boolean(userBooking),
          userBookingId: userBooking?.id ?? null,
          canBook: eligibility.canBook,
          bookingDisabledReason: eligibility.reason,
        };
      });

      setRawSessions(mapped);
    } catch {
      toast.error('Error al cargar la información de clases');
    } finally {
      setLoading(false);
    }
  }, [dates]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleToggleReservation = async (sessionId: number) => {
    if (!currentMember) {
      toast.error('No se encontró un socio activo para realizar la reserva');
      return;
    }

    if (membershipError) {
      toast.error(
        'No se puede reservar: No se pudo verificar el estado de tu membresía. Por favor reintentá la carga.',
      );
      return;
    }

    const targetSession = rawSessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    setActionLoadingId(sessionId);
    try {
      const isReserved = targetSession.isReserved;

      if (isReserved && targetSession.userBookingId) {
        await classBookingService.delete(targetSession.userBookingId);
        toast.success('Reserva cancelada con éxito');

        const eligibility = getBookingEligibility(
          currentMember,
          membership,
          targetSession.date,
          { membershipFetchFailed: membershipError },
        );

        setBookings((prev) =>
          prev.filter((b) => b.id !== targetSession.userBookingId),
        );
        setRawSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  isReserved: false,
                  userBookingId: null,
                  remainingCapacity: s.remainingCapacity + 1,
                  canBook: eligibility.canBook,
                  bookingDisabledReason: eligibility.reason,
                }
              : s,
          ),
        );
      } else {
        const eligibility = getBookingEligibility(
          currentMember,
          membership,
          targetSession.date,
          { membershipFetchFailed: membershipError },
        );
        if (!eligibility.canBook) {
          toast.error(
            eligibility.reason
              ? `No se puede reservar: ${eligibility.reason}`
              : 'No podés reservar esta clase con tu estado actual',
          );
          return;
        }

        if (targetSession.remainingCapacity <= 0) {
          toast.error('No hay cupos disponibles para esta clase');
          return;
        }

        const newBooking = await classBookingService.create({
          memberId: currentMember.id,
          classSessionId: sessionId,
        });
        toast.success('¡Reserva confirmada con éxito!');

        setBookings((prev) => [...prev, newBooking]);
        setRawSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  isReserved: true,
                  userBookingId: newBooking.id,
                  remainingCapacity: Math.max(0, s.remainingCapacity - 1),
                }
              : s,
          ),
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al procesar la reserva';
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const categories = useMemo(() => {
    const catSet = new Set<string>();
    catSet.add('Todos');

    schedules.forEach((s) => {
      if (s.category) {
        catSet.add(s.category);
      }
    });

    rawSessions.forEach((s) => {
      if (s.classSchedule?.category) {
        catSet.add(s.classSchedule.category);
      }
    });

    return Array.from(catSet);
  }, [schedules, rawSessions]);

  const filteredClasses = useMemo(() => {
    return rawSessions
      .filter((s) => {
        const matchesDate = normalizeDateStr(s.date) === selectedDate;
        const sessionCategory = s.classSchedule?.category;
        const matchesCategory =
          activeCategory === 'Todos' ||
          sessionCategory?.toUpperCase() === activeCategory.toUpperCase() ||
          sessionCategory === activeCategory;
        return matchesDate && matchesCategory;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [rawSessions, selectedDate, activeCategory]);

  // Count total sessions for the selected day regardless of category
  const selectedDayTotalSessions = useMemo(() => {
    return rawSessions.filter((s) => normalizeDateStr(s.date) === selectedDate)
      .length;
  }, [rawSessions, selectedDate]);

  const isMemberActive = currentMember?.status === 'ACTIVE';
  const isMembershipActive = Boolean(
    membership &&
      membership.status === 'ACTIVE' &&
      (typeof membership.endDate === 'string'
        ? parseDateString(membership.endDate)
        : new Date(membership.endDate)
      ).setHours(23, 59, 59, 999) >= Date.now(),
  );

  const membershipAlert = useMemo((): MembershipAlertInfo | null => {
    if (loading || !currentMember) return null;
    if (!isMemberActive) {
      return {
        type: 'error',
        title: 'Cuenta Inactiva',
        message:
          'Tu cuenta de socio se encuentra inactiva. Comunicate con administración para reactivarla.',
      };
    }
    if (membershipError) {
      return {
        type: 'error',
        title: 'Error de verificación de membresía',
        message:
          'No se pudo verificar el estado de tu membresía debido a un problema de conexión.',
        action: {
          label: 'Reintentar',
          onClick: () => {
            void loadData();
          },
        },
      };
    }
    if (!membership || membership.status !== 'ACTIVE' || !isMembershipActive) {
      return {
        type: 'warning',
        title: 'Membresía Vencida o Inactiva',
        message:
          'Tu membresía no se encuentra vigente. Por favor renovala para poder reservar clases.',
      };
    }
    return null;
  }, [
    loading,
    currentMember,
    isMemberActive,
    membershipError,
    membership,
    isMembershipActive,
    loadData,
  ]);

  return {
    dates,
    categories,
    activeCategory,
    setActiveCategory,
    selectedDate,
    setSelectedDate,
    classes: filteredClasses,
    bookings,
    loading,
    currentMember,
    membership,
    membershipError,
    isMemberActive,
    isMembershipActive,
    membershipAlert,
    selectedDayTotalSessions,
    actionLoadingId,
    handleToggleReservation,
    refreshClasses: loadData,
  };
}
