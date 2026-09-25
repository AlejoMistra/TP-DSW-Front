import type { CreateClassSessionInput } from '../models/ClassSession'
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule'
import type { Instructor } from '@/features/instructors/models/Instructor'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog'
import { SessionForm } from './SessionForm'

interface CreateSessionDialogProps {
  open: boolean
  initialDate: string | null
  schedules: ClassSchedule[]
  instructors: Instructor[]
  onClose: () => void
  onCreate: (payload: CreateClassSessionInput) => Promise<any>
}

export function CreateSessionDialog({
  open,
  initialDate,
  schedules,
  instructors,
  onClose,
  onCreate,
}: CreateSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Agendar clase
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Programá una nueva clase seleccionando el tipo, día y profesor.
            </DialogDescription>
          </div>
        </DialogHeader>

        <SessionForm
          mode="create"
          initialDate={initialDate}
          schedules={schedules}
          instructors={instructors}
          onClose={onClose}
          onSubmit={onCreate}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateSessionDialog
