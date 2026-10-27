import {
  UserPlus,
  Banknote,
  CalendarPlus,
  ShieldCheck,
} from 'lucide-react';
import { QuickActionCard } from '@/shared/components/QuickActionCard';

export interface QuickActionItemConfig {
  id: string;
  title: string;
  description: string;
  icon: typeof UserPlus;
  to?: string;
  disabled?: boolean;
}

const QUICK_ACTIONS_CONFIG: QuickActionItemConfig[] = [
  {
    id: 'new-member',
    title: 'Registrar Nuevo Socio',
    description: 'Alta inmediata de socio y membresía',
    icon: UserPlus,
    to: '/administrativo/socios/nuevo',
  },
  {
    id: 'record-payment',
    title: 'Registrar Cobro',
    description: 'Modal de cobro rápido',
    icon: Banknote,
    disabled: true,
  },
  {
    id: 'validate-access',
    title: 'Enviar recordatorios',
    description: 'Mail a socios con membresía vencida',
    icon: ShieldCheck,
    disabled: true,
  },
  {
    id: 'schedule-session',
    title: 'Programar Sesión',
    description: 'Nueva clase para el cronograma semanal',
    icon: CalendarPlus,
    to: '/administrativo/clases',
  },
];

export function QuickActionsSection() {
  return (
    <section className="space-y-3.5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Accesos Rápidos
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS_CONFIG.map((action) => (
          <QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            to={action.to}
            disabled={action.disabled}
          />
        ))}
      </div>
    </section>
  );
}

export default QuickActionsSection;

