import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, CalendarDays, Loader2, Check } from 'lucide-react';
import { classSessionService } from '../api/classSessionService';
import type { RecurrenceScope } from '../models/ClassSession';

interface RecurrenceScopeDialogProps {
  open: boolean;
  sessionId: number;
  actionType: 'edit' | 'cancel' | 'delete';
  onClose: () => void;
  onConfirm: (scope: RecurrenceScope) => Promise<void>;
}

export function RecurrenceScopeDialog({
  open,
  sessionId,
  actionType,
  onClose,
  onConfirm,
}: RecurrenceScopeDialogProps) {
  const [scope, setScope] = useState<RecurrenceScope>('this');
  const [loadingImpact, setLoadingImpact] = useState<boolean>(false);
  const [impact, setImpact] = useState<{ sessionCount: number; confirmedBookingsCount: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Consultar impacto cuando cambia el scope o se abre el diálogo
  useEffect(() => {
    if (!open || !sessionId) return;
    let isMounted = true;
    setLoadingImpact(true);

    classSessionService
      .getAffectedBookings(sessionId, scope)
      .then((data) => {
        if (isMounted) setImpact(data);
      })
      .catch(() => {
        if (isMounted) setImpact(null);
      })
      .finally(() => {
        if (isMounted) setLoadingImpact(false);
      });

    return () => {
      isMounted = false;
    };
  }, [open, sessionId, scope]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(scope);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionTitles = {
    edit: 'Editar clase periódica',
    cancel: 'Cancelar clase periódica',
    delete: 'Eliminar clase periódica',
  };

  const actionDescriptions = {
    edit: 'Esta clase forma parte de una serie recurrente. Seleccioná qué clases querés modificar:',
    cancel: 'Esta clase forma parte de una serie recurrente. Seleccioná qué clases querés cancelar:',
    delete: 'Esta clase forma parte de una serie recurrente. Seleccioná qué clases querés eliminar:',
  };

  const options: { id: RecurrenceScope; title: string; description: string }[] = [
    {
      id: 'this',
      title: 'Solo esta clase',
      description: 'Aplica solo a esta sesión particular. Se desvinculará de la serie como excepción independiente.',
    },
    {
      id: 'following',
      title: 'Esta y las clases siguientes',
      description: 'Aplica a esta clase y a todas las fechas futuras de la serie. Las clases pasadas no se modifican.',
    },
    {
      id: 'all',
      title: 'Todas las clases futuras',
      description: 'Aplica a todas las clases pendientes de la serie desde hoy en adelante (preserva las ya dictadas).',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-card border border-border/80 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <CalendarDays className="size-5" />
            <DialogTitle className="text-lg font-bold text-foreground">
              {actionTitles[actionType]}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {actionDescriptions[actionType]}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-2.5">
          {options.map((opt) => {
            const isSelected = scope === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setScope(opt.id)}
                className={`relative flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                    : 'border-border/60 hover:border-border hover:bg-muted/40'
                }`}
              >
                <div
                  className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="size-2.5 stroke-[3]" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {opt.title}
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {opt.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advertencia de reservas de socios afectadas */}
        {loadingImpact ? (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="size-3.5 animate-spin" />
            <span>Consultando reservas afectadas...</span>
          </div>
        ) : impact && impact.confirmedBookingsCount > 0 ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-amber-500 text-xs">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Atención: Reservas confirmadas afectadas</p>
              <p className="text-amber-500/90 mt-0.5">
                Esta acción impactará en <strong>{impact.sessionCount} clase(s)</strong> y cancelará{' '}
                <strong>{impact.confirmedBookingsCount} reserva(s) confirmada(s)</strong> de socios.
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Volver
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            variant={actionType === 'delete' ? 'destructive' : 'default'}
            className="font-semibold"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecurrenceScopeDialog;
