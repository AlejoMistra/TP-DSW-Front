import { Banknote } from 'lucide-react';
import type { ExpiredMembershipItemData } from '@/features/dashboard/models/adminDashboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/utils';

export interface ExpiredMembershipItemProps {
  item: ExpiredMembershipItemData;
  onChargeClick?: (item: ExpiredMembershipItemData) => void;
  isChargeDisabled?: boolean;
  className?: string;
}

export function ExpiredMembershipItem({
  item,
  onChargeClick,
  isChargeDisabled = true,
  className,
}: ExpiredMembershipItemProps) {
  const formattedDebt = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(item.debtAmountArs);

  const expirationText =
    item.daysExpired === 0
      ? 'Vence hoy'
      : `Vencido hace ${item.daysExpired}d`;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 p-3.5 transition-colors hover:bg-muted/30',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar size="default" className="border border-border/80 bg-muted/60 shrink-0">
          {item.memberAvatarUrl && (
            <AvatarImage src={item.memberAvatarUrl} alt={item.memberName} />
          )}
          <AvatarFallback className="font-semibold text-xs text-foreground bg-secondary/80">
            {item.memberInitials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {item.memberName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            <span className={item.daysExpired > 0 ? 'text-primary font-medium' : ''}>
              {expirationText}
            </span>
            <span className="mx-1">•</span>
            <span>{formattedDebt} ARS</span>
          </p>
        </div>
      </div>

      <Button
        size="sm"
        disabled={isChargeDisabled}
        onClick={() => onChargeClick?.(item)}
        className="h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Banknote className="size-3.5" />
        Cobrar
      </Button>
    </div>
  );
}

export default ExpiredMembershipItem;

