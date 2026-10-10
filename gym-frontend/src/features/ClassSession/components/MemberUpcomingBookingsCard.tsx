import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import {
  useMemberUpcomingBookings
} from '../hooks/useMemberUpcomingBookings'

interface MemberUpcomingBookingsCardProps {
  memberId: number | null
  maxItems?: number
  className?: string
}

export default function MemberUpcomingBookingsCard({
  memberId,
  maxItems = 3,
  className,
}: MemberUpcomingBookingsCardProps) {
  const { upcomingClasses, loading } = useMemberUpcomingBookings(memberId)

  const displayedClasses = upcomingClasses.slice(0, maxItems)

  return (
    <Card
      className={`rounded-3xl border border-border/80 bg-card sm:p-6 shadow-md transition-all hover:shadow-lg ${className || ''}`}
    >
      {/* Header */}
      <CardHeader className="p-5 pb-3 md:p-4 md:pb-2">
        <CardTitle className="text-3xl tracking-tight text-foreground md:text-2xl">
          Próximas clases reservadas
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tus sesiones agendadas para entrenar
        </p>
      </CardHeader>

      <CardContent className="p-0 pt-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 p-4 animate-pulse"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-xl bg-muted/60" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-muted/60 rounded" />
                    <div className="h-3 w-24 bg-muted/40 rounded" />
                  </div>
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-5 w-12 bg-muted/60 rounded ml-auto" />
                  <div className="h-3 w-16 bg-muted/40 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/10 p-8 text-center">
            <h3 className="font-bold text-foreground text-base">
              No tenés clases reservadas
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Agenda tus próximas clases y no te pierdas ninguna sesión.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 rounded-xl text-primary hover:bg-primary/10 hover:text-primary font-bold"
            >
              <Link to="/socio/clases">Explorar clases disponibles</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedClasses.map((cls) => {
              const instructorName = cls.instructor
                ? `Profe: ${cls.instructor.name} ${cls.instructor.surname ? cls.instructor.surname[0] + '.' : ''}`
                : 'Profe asignado'

              const classNameText =
                cls.classSchedule?.name || 'Clase de Entrenamiento'
              const startTimeFormatted = cls.startTime
                ? cls.startTime.slice(0, 5)
                : '00:00'

              return (
                <div
                  key={cls.id}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/90 p-4 transition-all hover:border-primary/50 hover:bg-muted/30 hover:shadow-xs"
                >
                  {/* Left: Square Icon & Class info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-105">
                      {/* <Icon className="size-6" /> */}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-foreground text-sm sm:text-base leading-snug">
                        {classNameText}
                      </h4>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">
                        {instructorName}
                      </p>
                    </div>
                  </div>

                  {/* Right: Time */}
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-base sm:text-lg text-primary leading-tight">
                      {startTimeFormatted}
                    </p>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                      {cls.isToday ? 'HOY' : cls.formattedDate}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
