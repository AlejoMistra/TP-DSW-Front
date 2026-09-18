import { User, Clock, Users, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { type MemberClassSession, getCategoryLabel } from '../models/ClassSession'

interface ClassCardProps {
  cls: MemberClassSession
  onToggleReservation: (id: number) => void
  isSubmitting?: boolean
}

export function ClassSessionCard({ cls, onToggleReservation, isSubmitting = false }: ClassCardProps) {
  const isReserved = cls.isReserved
  const isCancelled = cls.status === 'CANCELLED'
  const maxCapacity = cls.classSchedule?.maxCapacity ?? 15
  const remainingCapacity = cls.remainingCapacity ?? 0
  const isFull = remainingCapacity <= 0 && !isReserved

  const instructorName = cls.instructor
    ? `Profe ${cls.instructor.name} ${cls.instructor.surname ?? ''}`.trim()
    : (cls.classSchedule as any)?.instructorName
      ? `Profe ${(cls.classSchedule as any).instructorName}`
      : null

  const className = cls.classSchedule?.name || 'Clase de Entrenamiento'
  const categoryLabel = getCategoryLabel(cls.classSchedule?.category)
  const duration = cls.classSchedule?.durationMinutes ?? 45
  const description = cls.classSchedule?.description

  const startTimeFormatted = cls.startTime ? cls.startTime.slice(0, 5) : '08:00'

  return (
    <Card
      className={`flex flex-col justify-between rounded-2xl border transition-all duration-200 overflow-hidden ${isReserved
        ? 'border-primary/50 bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary/30'
        : isCancelled
          ? 'opacity-60 border-border/50 bg-muted/20'
          : 'border-border/70 bg-card hover:border-border hover:shadow-md'
        }`}
    >
      <CardContent className="p-5 pb-3">
        {/* Top Badges & Time */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {isCancelled ? (
              <Badge variant="destructive" className="text-xs font-bold tracking-wider uppercase">
                Cancelada
              </Badge>
            ) : isReserved ? (
              <Badge
                className="bg-emerald-600 hover:bg-emerald-600 text-white gap-1 text-xs font-bold tracking-wider uppercase shadow-xs"
              >
                <Check className="size-3 stroke-3" />
                Reservada
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs font-bold tracking-wider uppercase bg-muted/60 border-border/60"
              >
                {categoryLabel}
              </Badge>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="text-2xl font-black tracking-tight text-foreground leading-none">
              {startTimeFormatted}
            </p>
            <p className="text-sm font-medium text-muted-foreground flex items-center justify-end gap-1 mt-1">
              <Clock className="size-3 text-muted-foreground/80" />
              {duration} min
            </p>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground leading-snug">
            {className}
          </CardTitle>
          {description && (
            <p className="text-md text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Instructor */}
        {instructorName && (
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/40 text-xs font-medium text-muted-foreground">
            <div className="flex size-6 items-center justify-center rounded-full bg-muted/60 text-foreground shrink-0">
              <User className="size-3.5" />
            </div>
            <span className="truncate">{instructorName}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-3 flex justify-between items-center gap-3">
        {/* Cupos info */}
        <div className="flex items-center gap-1.5 text-sm">
          <Users className="size-3.5 text-muted-foreground shrink-0" />
          {isCancelled ? (
            <span className="text-muted-foreground">No disponible</span>
          ) : isFull ? (
            <span className="font-semibold text-destructive flex items-center gap-1">
              <AlertCircle className="size-3" />
              Sin cupos
            </span>
          ) : (
            <span className="font-medium text-muted-foreground">
              <strong className="font-bold text-foreground">{remainingCapacity}</strong> de {maxCapacity} libres
            </span>
          )}
        </div>

        {/* Action Button */}
        {isCancelled ? (
          <Button variant="ghost" size="sm" disabled className="text-sm font-semibold">
            Cancelada
          </Button>
        ) : isReserved ? (
          <Button
            onClick={() => onToggleReservation(cls.id)}
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            className="text-sm font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Cancelando...
              </>
            ) : (
              'Cancelar Reserva'
            )}
          </Button>
        ) : isFull ? (
          <Button variant="secondary" size="sm" disabled className="text-sm font-semibold opacity-60">
            Agotado
          </Button>
        ) : (
          <Button
            onClick={() => onToggleReservation(cls.id)}
            size="sm"
            disabled={isSubmitting}
            className="text-sm font-bold px-4 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Reservando...
              </>
            ) : (
              'Reservar'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ClassSessionCard
