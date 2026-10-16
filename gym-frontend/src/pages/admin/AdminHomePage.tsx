import { usePageTitle } from '@/shared/context/PageHeaderContext';
import { QuickActionsSection } from '@/features/dashboard/components/QuickActionsSection';
import { ExpiredMembershipsPanel } from '@/features/dashboard/components/ExpiredMembershipsPanel';
import { TodaySessionsPanel } from '@/features/dashboard/components/TodaySessionsPanel';

export default function AdminHomePage() {
  usePageTitle('Menu administrativo');

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-6 pb-6">
      {/* Accesos Rápidos de Turno */}
      <QuickActionsSection />

      {/* Paneles de Gestión (Membresías Vencidas y Agenda de Clases) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <ExpiredMembershipsPanel />
        <TodaySessionsPanel />
      </div>
    </div>
  );
}

