import { useCallback, useEffect, useState } from 'react';
import type { TodaySessionItemData, ClassSessionOccupancyStatus } from '../models/adminDashboard';
import { classSessionService } from '@/features/ClassSession/api/classSessionService';
import { toLocalDateString } from '@/features/ClassSession/lib/dateUtils';

export function useTodaySessions() {
  const [sessions, setSessions] = useState<TodaySessionItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const todayStr = toLocalDateString(new Date());
        const rawSessions = await classSessionService.getAll({ date: todayStr, limit: 50 });

        if (cancelled) return;

        const mapped: TodaySessionItemData[] = rawSessions
          .filter((s) => s.status !== 'CANCELLED')
          .map((session) => {
            const maxCapacity = session.classSchedule?.maxCapacity || 0;
            const remaining = session.remainingCapacity ?? maxCapacity;
            const currentCapacity = Math.max(0, maxCapacity - remaining);

            let occupancyStatus: ClassSessionOccupancyStatus = 'AVAILABLE';
            if (remaining <= 0) {
              occupancyStatus = 'FULL';
            } else if (remaining <= 3 || (maxCapacity > 0 && currentCapacity / maxCapacity >= 0.8)) {
              occupancyStatus = 'NEARLY_FULL';
            }

            const scheduleWithName = session.classSchedule as { instructorName?: string } | undefined;
            const instructorName = session.instructor
              ? `${session.instructor.name} ${session.instructor.surname || ''}`.trim()
              : scheduleWithName?.instructorName || 'Sin asignar';

            return {
              id: session.id,
              classScheduleId: session.classScheduleId,
              className: session.classSchedule?.name || 'Clase',
              instructorName,
              startTime: session.startTime,
              endTime: session.endTime || '',
              currentCapacity,
              maxCapacity,
              occupancyStatus,
            };
          });

        setSessions(mapped);
        setError(null);
      } catch {
        if (!cancelled) {
          setError('Error al obtener la agenda de clases de hoy.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return {
    sessions,
    loading,
    error,
    refetch,
  };
}

export default useTodaySessions;
