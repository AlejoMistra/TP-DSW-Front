import { AlertTriangle, RotateCw, CheckCircle2 } from 'lucide-react';
import { SectionCard } from '@/shared/components/SectionCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { ExpiredMembershipItem } from '@/features/memberships/components/ExpiredMembershipItem';
import { useExpiringMemberships } from '../hooks/useExpiringMemberships';

export function ExpiredMembershipsPanel() {
  const { items, loading, error, refetch } =
    useExpiringMemberships();

  return (
    <SectionCard
      title="Membresias Vencidas"
      subtitle="Membresías vencidas para cobrar"
      icon={AlertTriangle}
      headerAction={{
        label: 'Todas las membresías',
        to: '/administrativo/socios'
      }}
    >
      {/* Loading State */}
      {
        loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/40 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-44 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        )
      }

      {/* Error State */}
      {
        !loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 py-8 px-4 text-center">
            <AlertTriangle className="size-6 text-destructive" />
            <p className="text-xs text-destructive">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={refetch}
              className="mt-2 h-7 gap-1.5 text-xs border-destructive/30 hover:bg-destructive/10"
            >
              <RotateCw className="size-3" />
              Reintentar
            </Button>
          </div>
        )
      }

      {/* Empty State */}
      {
        !loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <CheckCircle2 className="size-8 text-emerald-500" />
            <p className="text-sm font-medium">Al día</p>
            <p className="text-xs text-muted-foreground">
              No hay cuotas vencidas pendientes en este momento.
            </p>
          </div>
        )
      }

      {/* List State */}
      {
        !loading && !error && items.length > 0 && (
          <div className="space-y-2.5">
            {items.map((item) => (
              <ExpiredMembershipItem key={item.id} item={item} />
            ))}
          </div>
        )
      }
    </SectionCard >
  );
}

export default ExpiredMembershipsPanel;
