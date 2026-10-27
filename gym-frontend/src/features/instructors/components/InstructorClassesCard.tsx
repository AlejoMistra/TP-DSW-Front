import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Calendar, CalendarDays, Users } from 'lucide-react';
import { useInstructorUpcomingClasses } from '../hooks/useInstructorUpcomingClasses';
import { Badge } from '@/shared/components/ui/badge';

interface InstructorClassesCardProps {
  maxItems?: number;
  className?: string;
}

export function InstructorClassesCard({
  maxItems = 3,
  className,
}: InstructorClassesCardProps) {
  const { classes, loading } = useInstructorUpcomingClasses();

  const displayedClasses = classes.slice(0, maxItems);

  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border border-border/80 bg-card p-2 sm:p-6 shadow-md transition-all hover:shadow-lg ${className || ''}`}
    >
      {/* Header */}
      <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3 md:p-4 md:pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl sm:text-2xl tracking-tight text-foreground">
            Mis Clases a Dictar
          </CardTitle>
          <Badge
            variant="outline"
            className="rounded-full border-primary/30 bg-primary/10 text-primary text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 shrink-0"
          >
            {classes.length} {classes.length === 1 ? 'sesión' : 'sesiones'}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Tus clases asignadas para hoy y próximos días
        </p>
      </CardHeader>

      <CardContent className="p-2 pt-1 sm:p-0 sm:pt-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 p-3 sm:p-4 animate-pulse"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <div className="size-10 sm:size-12 rounded-xl bg-muted/60" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 sm:w-36 bg-muted/60 rounded" />
                    <div className="h-3 w-20 sm:w-24 bg-muted/40 rounded" />
                  </div>
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-4 sm:h-5 w-12 bg-muted/60 rounded ml-auto" />
                  <div className="h-3 w-14 sm:w-16 bg-muted/40 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/10 p-6 sm:p-8 text-center">
            <div className="mx-auto flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
              <CalendarDays className="size-5 sm:size-6" />
            </div>
            <h3 className="font-bold text-foreground text-sm sm:text-base">
              Sin clases programadas
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              No tenés sesiones asignadas para dictar en la fecha o los próximos días.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {displayedClasses.map((cls) => {
              const isFull = cls.remainingCapacity <= 0;

              return (
                <div
                  key={cls.id}
                  className="group flex items-center justify-between gap-2.5 sm:gap-3 rounded-2xl border border-border/70 bg-card/90 p-3 sm:p-4 transition-all hover:border-primary/50 hover:bg-muted/30 hover:shadow-xs"
                >
                  {/* Left: Square Icon & Class info */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-105">
                      <Calendar className="size-5 sm:size-6" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-foreground text-xs sm:text-sm md:text-base leading-snug">
                        {cls.className}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                        <Users className="size-3 sm:size-3.5 shrink-0" />
                        <span className="truncate">
                          {cls.currentCapacity} / {cls.maxCapacity} inscriptos
                        </span>
                        {isFull && (
                          <Badge
                            variant="destructive"
                            className="text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-3.5 sm:h-4"
                          >
                            Lleno
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Time and Date badge */}
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-sm sm:text-base md:text-lg text-primary leading-tight">
                      {cls.startTime}
                      {cls.endTime ? ` - ${cls.endTime}` : ''}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                      {cls.isToday ? (
                        <span className="text-primary font-black">HOY</span>
                      ) : (
                        cls.formattedDate
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InstructorClassesCard;
