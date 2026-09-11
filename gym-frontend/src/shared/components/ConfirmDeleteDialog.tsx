import { AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog'

interface ConfirmDeleteDialogProps {
  open: boolean
  title?: string
  description?: string
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export function ConfirmDeleteDialog({
  open,
  title = '¿Confirmás eliminar este elemento?',
  description = 'Esta acción eliminará el registro del sistema y no se puede deshacer.',
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isLoading && onClose()}>
      <DialogContent className="max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/15 text-destructive shrink-0 mt-0.5">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDeleteDialog