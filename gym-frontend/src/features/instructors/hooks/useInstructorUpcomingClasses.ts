import { useState, useEffect, useCallback } from 'react';
import { classSessionService } from '@/features/ClassSession/api/classSessionService';
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule';
import {
  parseDateString,
  toLocalDateString,
} from '@/features/ClassSession/lib/dateUtils';
import { useCurrentInstructor } from './useCurrentInstructor';

export interface InstructorUpcomingClass {
  id: number;
  classScheduleId: number;
  className: string;
  category: string;
  startTime: string;
  endTime?: string;
  isToday: boolean;
  formattedDate: string;
  rawDate: Date;
  currentCapacity: number;
  maxCapacity: number;
  remainingCapacity: number;
}

export function useInstructorUpcomingClasses() {
  const { instructor, loading: instructorLoading } = useCurrentInstructor();
  const [classes, setClasses] = useState<InstructorUpcomingClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchSessions = async () => {
      if (instructorLoading) return;

      try {
        setError(null);

        // 1. Obtiene directamente las sesiones del instructor autenticado vía /api/classSessions/me
        const mySessions = await classSessionService.getMine();

        if (cancelled) return;

        const todayStr = toLocalDateString(new Date());
        const formattedList: InstructorUpcomingClass[] = [];

        for (const session of mySessions) {
          if (session.status === 'CANCELLED' || session.deletedAt) continue;

          const sessionDateObj =
            typeof session.date === 'string'
              ? parseDateString(session.date)
              : new Date(session.date);
          const sessionDateStr = toLocalDateString(sessionDateObj);

          // Incluir únicamente clases de hoy en adelante
          if (sessionDateStr >= todayStr) {
            const sched = session.classSchedule as ClassSchedule | undefined;

            const isToday = sessionDateStr === todayStr;
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
            const formattedDate = `${sessionDateObj.getDate()} ${months[sessionDateObj.getMonth()]}`;

            const maxCapacity = sched?.maxCapacity || 20;
            const remainingCapacity = session.remainingCapacity ?? maxCapacity;
            const currentCapacity = Math.max(
              0,
              maxCapacity - remainingCapacity,
            );

            formattedList.push({
              id: session.id,
              classScheduleId: session.classScheduleId,
              className: sched?.name || 'Clase de Entrenamiento',
              category: sched?.category || 'General',
              startTime: session.startTime
                ? session.startTime.slice(0, 5)
                : '00:00',
              endTime: session.endTime
                ? session.endTime.slice(0, 5)
                : undefined,
              isToday,
              formattedDate,
              rawDate: sessionDateObj,
              currentCapacity,
              maxCapacity,
              remainingCapacity,
            });
          }
        }

        // 2. Ordenamiento cronológico corregido:
        formattedList.sort((a, b) => {
          // a. Clases de hoy van primero
          if (a.isToday !== b.isToday) {
            return a.isToday ? -1 : 1;
          }
          // b. Fecha calendario ascendente (la más próxima primero)
          const dateDiff = a.rawDate.getTime() - b.rawDate.getTime();
          if (dateDiff !== 0) {
            return dateDiff;
          }
          // c. Mismo día: ordenar por hora de inicio ascendente
          return a.startTime.localeCompare(b.startTime);
        });

        if (!cancelled) {
          setClasses(formattedList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error al obtener tus clases asignadas',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchSessions();

    return () => {
      cancelled = true;
    };
  }, [instructorLoading, instructor?.id, reloadKey]);

  return {
    classes,
    loading: instructorLoading || loading,
    error,
    refetch,
  };
}

export default useInstructorUpcomingClasses;
