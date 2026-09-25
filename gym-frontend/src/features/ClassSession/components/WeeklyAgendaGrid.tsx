import { Plus, CalendarX } from 'lucide-react'
import type { WeekDay } from '../lib/dateUtils'
import type { ClassSession, UpdateClassSessionInput } from '../models/ClassSession'
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule'
import type { Instructor } from '@/features/instructors/models/Instructor'
import { SessionEditPopover } from './SessionEditPopover'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/utils/utils'

interface WeeklyAgendaGridProps {
  weekDays: WeekDay[]
  sessionsByDay: Map<string, ClassSession[]>
  schedules: ClassSchedule[]
  instructors: Instructor[]
  editingSession: ClassSession | null
  loading: boolean
  onSelectSession: (session: ClassSession) => void
  onCloseEdit: () => void
  onAddSessionForDay: (dateString: string) => void
  onUpdateSession: (id: number, payload: UpdateClassSessionInput) => Promise<any>
  onCancelSession: (id: number) => Promise<void>
  onRestoreSession: (id: number) => Promise<void>
  onDeleteSession: (id: number) => Promise<void>
}

export function WeeklyAgendaGrid({
  weekDays,
  sessionsByDay,
  schedules,
  instructors,
  editingSession,
  loading,
  onSelectSession,
  onCloseEdit,
  onAddSessionForDay,
  onUpdateSession,
  onCancelSession,
  onRestoreSession,
  onDeleteSession,
}: WeeklyAgendaGridProps) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      {/* 6 Columns Grid */}
      <div className="grid min-w-[900px] grid-cols-6 gap-3">
        {weekDays.map((day) => {
          const daySessions = sessionsByDay.get(day.dateString) || []

          return (
            <div
              key={day.dateString}
              className="flex flex-col rounded-2xl border border-border/60 bg-muted/10 p-2.5 min-h-[480px]"
            >
              {/* Column Header */}
              <div
                className='group flex items-center justify-between rounded-xl px-3 py-2 transition-colors mb-2.5'
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-sm font-bold tracking-tight',
                        day.isToday ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {day.dayName} {day.dayNumber}
                    </span>
                  </div>
                </div>

                {/* Quick Add button for this day */}
                <button
                  type="button"
                  onClick={() => onAddSessionForDay(day.dateString)}
                  className="rounded-lg p-1 text-muted-foreground transition hover:bg-primary hover:text-white opacity-60 group-hover:opacity-100"
                  title={`Agregar clase el ${day.dayName} ${day.dayNumber}`}
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              {/* Sessions List */}
              <div className="flex flex-1 flex-col gap-2.5">
                {loading ? (
                  // Loading skeletons
                  <>
                    <Skeleton className="h-28 w-full rounded-xl" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                  </>
                ) : daySessions.length > 0 ? (
                  daySessions.map((session) => (
                    <SessionEditPopover
                      key={session.id}
                      session={session}
                      isEditing={editingSession?.id === session.id}
                      schedules={schedules}
                      instructors={instructors}
                      onSelect={() => onSelectSession(session)}
                      onClose={onCloseEdit}
                      onSave={(data) => onUpdateSession(session.id, data)}
                      onCancelSession={() => onCancelSession(session.id)}
                      onRestoreSession={() => onRestoreSession(session.id)}
                      onDeleteSession={() => onDeleteSession(session.id)}
                    />
                  ))
                ) : (
                  // Empty day placeholder
                  <div
                    onClick={() => onAddSessionForDay(day.dateString)}
                    className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/40 p-4 text-center cursor-pointer transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <CalendarX className="size-6 text-muted-foreground/40 mb-1.5" />
                    <span className="text-sm font-medium text-muted-foreground/60">
                      Sin clases
                    </span>
                    <span className="text-xs text-amber-400/80 font-semibold mt-1">
                      + Programar
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div >
  )
}

export default WeeklyAgendaGrid
