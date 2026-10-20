import { Calendar, RotateCw, CalendarDays } from 'lucide-react';
import { SectionCard } from '@/shared/components/SectionCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { SessionItem } from '@/features/ClassSession/components/SessionItem';
import { useTodaySessions } from '../hooks/useTodaySessions';

export function TodaySessionsPanel() {
  const { sessions, loading, error, refetch } = useTodaySessions();

  return (
    <SectionCard
      title="Agenda del día"
      subtitle="Clases programadas para hoy"
      icon={Calendar}
      headerAction={{
        label: 'Cronograma completo',
        to: '/administrativo/clases',
      }
      }
    >
      {/* Loading State */}
      {
        loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/40 p-3.5"
              >
                <div className="space-y-1.5 min-w-0">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        )
      }

      {/* Error State */}
      {
        !loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 py-8 px-4 text-center">
            <Calendar className="size-6 text-destructive" />
            <p className="text-xs text-destructive">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={refetch}
              className="mt-2 h-7 gap-1.5 text-xs border-destructive/30 hover:bg-destructive/10"
            >
              <RotateCw className="size-3" />
              Reintentar
            </Button>
          </div>
        )
      }

      {/* Empty State */}
      {
        !loading && !error && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <CalendarDays className="size-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">Sin sesiones hoy</p>
            <p className="text-xs text-muted-foreground">
              No hay clases programadas para la fecha.
            </p>
          </div>
        )
      }

      {/* List State */}
      {
        !loading && !error && sessions.length > 0 && (
          <div className="space-y-2.5">
            {sessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </div>
        )
      }
    </SectionCard >
  );
}

export default TodaySessionsPanel;
