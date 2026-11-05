import { RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog'

interface ConfirmReactivateDialogProps {
  open: boolean
  title?: string
  description: string
  confirmText?: string
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export function ConfirmReactivateDialog({
  open,
  title = 'Registro Existente Encontrado',
  description,
  confirmText = 'Reactivar Registro',
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmReactivateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isLoading && onClose()}>
      <DialogContent className="max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0 mt-0.5">
              <RefreshCw className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
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
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Reactivando...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

