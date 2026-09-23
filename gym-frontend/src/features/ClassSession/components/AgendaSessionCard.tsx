import React from 'react'
import { User, AlertCircle } from 'lucide-react'
import type { ClassSession } from '../models/ClassSession'
import { calculateEndTime } from '../lib/dateUtils'
import { cn } from '@/shared/utils/utils'

interface AgendaSessionCardProps {
  session: ClassSession
  isEditing?: boolean
  onClick?: () => void
}

export const AgendaSessionCard = React.forwardRef<HTMLDivElement, AgendaSessionCardProps>(
  ({ session, isEditing, onClick }, ref) => {
    const isCancelled = session.status === 'CANCELLED'

    // Compute end time: from API response or duration calculation
    const duration = session.classSchedule?.durationMinutes ?? 60
    const endTime = session.endTime || calculateEndTime(session.startTime, duration)
    const timeDisplay = `${session.startTime} - ${endTime}`

    const title = session.classSchedule?.name ?? 'Clase'
    const instructorName = session.instructor
      ? `${session.instructor.name} ${session.instructor.surname ?? ''}`.trim()
      : 'Sin instructor'

    const maxCapacity = session.classSchedule?.maxCapacity ?? 20
    const remaining = session.remainingCapacity ?? 0
    const occupied = Math.max(0, maxCapacity - remaining)
    const isFull = remaining <= 0

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
        className={cn(
          'group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer select-none',
          // Base styling
          'bg-card/90 hover:bg-card border-border/70 hover:border-border shadow-xs hover:shadow-md',
          // Editing state (Mockup 2 gold border)
          isEditing &&
          'border-primary bg-card ring-2 ring-primary/40 shadow-primary/10',
          // Cancelled state
          isCancelled &&
          'border-destructive/30 opacity-60 hover:opacity-80'
        )}
      >
        {/* Top line: Time & Status Badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'text-xs font-medium tracking-tight',
              isCancelled ? 'text-destructive line-through' : 'text-muted-foreground'
            )}
          >
            {timeDisplay}
          </span>

          {isCancelled && (
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive ring-1 ring-destructive/40">
              Cancelada
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mt-1.5">
          <h4
            className={cn(
              'text-sm sm:text-base font-bold text-foreground leading-snug transition-colors',
              isCancelled && 'line-through text-muted-foreground'
            )}
          >
            {title}
          </h4>
        </div>

        {/* Instructor */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3.5 shrink-0 text-muted-foreground/80" />
          <span className="truncate">{instructorName}</span>
        </div>

        {/* Bottom stats: Cupos */}
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] font-semibold uppercase tracking-wider">
          <span
            className={cn(
              isFull ? 'text-rose-400 font-bold' : 'text-muted-foreground/90'
            )}
          >
            {occupied}/{maxCapacity} Cupos
          </span>

          {isFull && !isCancelled && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
              <AlertCircle className="size-3" />
              Lleno
            </span>
          )}
        </div>
      </div>
    )
  }
)

AgendaSessionCard.displayName = 'AgendaSessionCard'

export default AgendaSessionCard
