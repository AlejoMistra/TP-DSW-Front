import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  type ClassDateOption,
  type ClassCategory,
  type MemberClassSession,
} from '../models/ClassSession';
import { classSessionService } from '../api/classSessionService';
import { classBookingService } from '@/features/classBooking/api/classBookingService';
import type { ClassBooking } from '@/features/classBooking/models/ClassBooking';
import { classScheduleService } from '@/features/classSchedule/api/classScheduleService';
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule';

import { memberService } from '@/features/members/api/memberService';
import type { Member } from '@/features/members/models/Member';
import { parseDateString, toLocalDateString } from '../lib/dateUtils';

function generateNextDays(count: number = 14): ClassDateOption[] {
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

function normalizeDateStr(rawDate: string | Date | undefined | null): string {
  if (!rawDate) return '';
  const d = typeof rawDate === 'string' ? parseDateString(rawDate) : rawDate;
  return toLocalDateString(d);
}

export function useMemberClasses() {
  const dates = useMemo(() => generateNextDays(14), []);
  const [selectedDate, setSelectedDate] = useState<string>(
    dates[0]?.fullDate || '',
  );
  const [activeCategory, setActiveCategory] = useState<ClassCategory>('Todos');

  const [rawSessions, setRawSessions] = useState<MemberClassSession[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        memberData,
        sessionsData,
        bookingsData,
        schedulesData,
      ] = await Promise.all([
        memberService.getMe(),
        classSessionService.getAll().catch(() => []),
        classBookingService.getMyBookings().catch(() => [] as ClassBooking[]),
        classScheduleService.getAll().catch(() => [] as ClassSchedule[]),
      ]);

      setCurrentMember(memberData);
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

        return {
          ...session,
          classSchedule: sched,
          instructor: inst,
          remainingCapacity,
          isReserved: Boolean(userBooking),
          userBookingId: userBooking?.id ?? null,
        };
      });

      setRawSessions(mapped);
    } catch {
      toast.error('Error al cargar la información de clases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleToggleReservation = async (sessionId: number) => {
    if (!currentMember) {
      toast.error('No se encontró un socio activo para realizar la reserva');
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
                }
              : s,
          ),
        );
      } else {
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
    selectedDayTotalSessions,
    actionLoadingId,
    handleToggleReservation,
    refreshClasses: loadData,
  };
}
