import type { ClassSession, UpdateClassSessionInput } from '../models/ClassSession'
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule'
import type { Instructor } from '@/features/instructors/models/Instructor'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { AgendaSessionCard } from './AgendaSessionCard'
import { SessionForm, type SessionFormValues } from './SessionForm'
import { useIsMobile } from '@/shared/hooks/use-mobile'

interface SessionEditPopoverProps {
  session: ClassSession
  isEditing: boolean
  schedules: ClassSchedule[]
  instructors: Instructor[]
  onSelect: () => void
  onClose: () => void
  onSave: (payload: UpdateClassSessionInput) => Promise<any>
  onCancelSession: () => Promise<void>
  onRestoreSession: () => Promise<void>
  onDeleteSession: () => Promise<void>
}

export function SessionEditPopover({
  session,
  isEditing,
  schedules,
  instructors,
  onSelect,
  onClose,
  onSave,
  onCancelSession,
  onRestoreSession,
  onDeleteSession,
}: SessionEditPopoverProps) {
  const isMobile = useIsMobile()

  const handleFormSubmit = async (values: SessionFormValues) => {
    await onSave({
      classScheduleId: values.classScheduleId,
      instructorId: values.instructorId,
      date: values.date,
      startTime: values.startTime,
    })
  }

  // On Mobile: Render simple card and open a Dialog
  if (isMobile) {
    return (
      <>
        <AgendaSessionCard
          session={session}
          isEditing={isEditing}
          onClick={onSelect}
        />

        <Dialog open={isEditing} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="max-w-md p-5 bg-card border border-border">
            <DialogTitle className="sr-only">
              Editar Sesión: {session.classSchedule?.name ?? 'Clase'}
            </DialogTitle>
            <SessionForm
              mode="edit"
              session={session}
              schedules={schedules}
              instructors={instructors}
              onClose={onClose}
              onSubmit={handleFormSubmit}
              onCancelSession={onCancelSession}
              onRestoreSession={onRestoreSession}
              onDeleteSession={onDeleteSession}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // On Desktop: Anchored Popover to the AgendaSessionCard
  return (
    <Popover open={isEditing} onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger asChild>
        <div>
          <AgendaSessionCard
            session={session}
            isEditing={isEditing}
            onClick={onSelect}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-96 rounded-2xl border border-border/80 bg-card/98 p-4 shadow-2xl backdrop-blur-md"
      >
        <SessionForm
          mode="edit"
          session={session}
          schedules={schedules}
          instructors={instructors}
          onClose={onClose}
          onSubmit={handleFormSubmit}
          onCancelSession={onCancelSession}
          onRestoreSession={onRestoreSession}
          onDeleteSession={onDeleteSession}
        />
      </PopoverContent>
    </Popover>
  )
}

export default SessionEditPopover
