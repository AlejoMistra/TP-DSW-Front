import { useState, useEffect, useCallback } from 'react';
import { classSessionService } from '@/features/ClassSession/api/classSessionService';
import { classScheduleService } from '@/features/classSchedule/api/classScheduleService';
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule';
import type { ClassSession } from '@/features/ClassSession/models/ClassSession';
import { parseDateString, toLocalDateString } from '@/features/ClassSession/lib/dateUtils';
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

        const [rawSessions, rawSchedules] = await Promise.all([
          classSessionService.getAll({ limit: 100 }).catch(() => [] as ClassSession[]),
          classScheduleService.getAll().catch(() => [] as ClassSchedule[]),
        ]);

        if (cancelled) return;

        const scheduleMap = new Map(rawSchedules.map((s) => [Number(s.id), s]));
        const todayStr = toLocalDateString(new Date());

        const instructorId = instructor?.id;

        // Filter sessions for this instructor (by instructorId or schedule)
        const relevantSessions = rawSessions.filter((session) => {
          if (session.status === 'CANCELLED' || session.deletedAt) return false;

          const matchInstructor =
            (instructorId && (session.instructorId === instructorId || session.instructor?.id === instructorId)) ||
            (!instructorId); // if not matched yet, will show scheduled sessions

          return matchInstructor;
        });

        const formattedList: InstructorUpcomingClass[] = [];

        for (const session of relevantSessions) {
          const sessionDateObj =
            typeof session.date === 'string'
              ? parseDateString(session.date)
              : session.date;
          const sessionDateStr = toLocalDateString(sessionDateObj);

          // Only include classes from today onwards
          if (sessionDateStr >= todayStr) {
            const sched =
              scheduleMap.get(Number(session.classScheduleId)) ||
              (session.classSchedule as ClassSchedule | undefined);

            const isToday = sessionDateStr === todayStr;
            const months = [
              'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
              'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
            ];
            const formattedDate = `${sessionDateObj.getDate()} ${months[sessionDateObj.getMonth()]}`;

            const maxCapacity = sched?.maxCapacity || 20;
            const remainingCapacity = session.remainingCapacity ?? maxCapacity;
            const currentCapacity = Math.max(0, maxCapacity - remainingCapacity);

            formattedList.push({
              id: session.id,
              classScheduleId: session.classScheduleId,
              className: sched?.name || 'Clase de Entrenamiento',
              category: sched?.category || 'General',
              startTime: session.startTime ? session.startTime.slice(0, 5) : '00:00',
              endTime: session.endTime ? session.endTime.slice(0, 5) : undefined,
              isToday,
              formattedDate,
              currentCapacity,
              maxCapacity,
              remainingCapacity,
            });
          }
        }

        // Sort chronologically: by date ascending, then startTime ascending
        formattedList.sort((a, b) => {
          if (a.isToday !== b.isToday) {
            return a.isToday ? -1 : 1;
          }
          return a.startTime.localeCompare(b.startTime);
        });

        if (!cancelled) {
          setClasses(formattedList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Error al obtener tus clases asignadas'
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
