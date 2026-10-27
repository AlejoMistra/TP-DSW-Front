import type { TodaySessionItemData } from '@/features/dashboard/models/adminDashboard';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/utils';

export interface SessionItemProps {
  session: TodaySessionItemData;
  onClick?: (session: TodaySessionItemData) => void;
  className?: string;
}

const occupancyStyles: Record<string, string> = {
  FULL: 'bg-destructive/15 text-destructive border-destructive/30 font-semibold',
  NEARLY_FULL: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold',
  AVAILABLE: 'border-border/60 text-muted-foreground',
};

export function SessionItem({
  session,
  onClick,
  className,
}: SessionItemProps) {
  return (
    <div
      onClick={onClick ? () => onClick(session) : undefined}
      className={cn(
        'group flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 p-3.5 transition-colors hover:bg-muted/30',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Columna Izquierda: Horario + Clase + Instructor */}
      <div className="min-w-0 space-y-0.5">
        <span className="text-xs font-semibold text-muted-foreground tracking-tight">
          {session.startTime} - {session.endTime}
        </span>

        <h4 className="truncate text-sm font-bold text-foreground tracking-tight">
          {session.className}
        </h4>

        <p className="truncate text-xs text-muted-foreground">
          {session.instructorName.startsWith('Instructor')
            ? session.instructorName
            : `Instructor: ${session.instructorName}`}
        </p>
      </div>

      {/* Columna Derecha: Badge de Cupos Ocupados / Capacidad Total */}
      <div className="shrink-0">
        <Badge
          variant="secondary"
          className={cn(
            'text-xs px-2.5 py-1 border transition-colors',
            occupancyStyles[session.occupancyStatus] || occupancyStyles.AVAILABLE
          )}
        >
          {session.currentCapacity} / {session.maxCapacity} cupos
        </Badge>
      </div>
    </div>
  );
}

export default SessionItem;