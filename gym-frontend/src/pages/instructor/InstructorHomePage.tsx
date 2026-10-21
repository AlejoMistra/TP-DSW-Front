import {
  ClipboardList,
  Dumbbell,
  PlusCircle,
  Plus,
} from 'lucide-react';
import { usePageTitle } from '@/shared/context/PageHeaderContext';
import { QuickActionCard } from '@/shared/components/QuickActionCard';
import { useCurrentInstructor } from '@/features/instructors/hooks/useCurrentInstructor';
import { InstructorClassesCard } from '@/features/instructors/components/InstructorClassesCard';
import { InstructorRoutinesSummaryCard } from '@/features/instructors/components/InstructorRoutinesSummaryCard';

export default function InstructorHomePage() {
  usePageTitle('Inicio');

  const { instructor, loading } = useCurrentInstructor();

  const quickActions = [
    {
      title: 'Nueva Rutina',
      description: 'Diseñar plan para socios',
      icon: PlusCircle,
      to: '/instructor/rutinas?new=true',
    },
    {
      title: 'Mis Rutinas',
      description: 'Gestión y edición de rutinas',
      icon: ClipboardList,
      to: '/instructor/rutinas',
    },
    {
      title: 'Banco de Ejercicios',
      description: 'Catálogo y grupos musculares',
      icon: Dumbbell,
      to: '/instructor/ejercicios',
    },
    {
      title: 'Nuevo Ejercicio',
      description: 'Alta de ejercicio al sistema',
      icon: Plus,
      to: '/instructor/ejercicios?new=true',
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-44 sm:w-48 bg-muted/60 rounded-xl animate-pulse" />
          <div className="h-4 w-56 sm:w-72 bg-muted/40 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="h-64 rounded-3xl border border-border/60 bg-muted/20 animate-pulse" />
          <div className="h-64 rounded-3xl border border-border/60 bg-muted/20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 pb-4">
      {/* Saludo y Encabezado de Bienvenida */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground font-normal">
            {instructor?.name && instructor?.surname
              ? `¡Hola ${instructor.name} ${instructor.surname}!`
              : instructor?.name
                ? `¡Hola ${instructor.name}!`
                : '¡Bienvenido de nuevo!'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Panel de control para tus clases y rutinas de entrenamiento
          </p>
        </div>
      </div>

      {/* Grid Principal: Clases a dictar y Resumen de Rutinas */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 items-start">
        {/* Widget de Clases a Dictar */}
        <InstructorClassesCard />

        {/* Tarjeta de Resumen de Rutinas y Ejercicios */}
        <InstructorRoutinesSummaryCard />
      </div>

      {/* Accesos Rápidos */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg tracking-tight text-foreground font-medium">
          Accesos Rápidos
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              to={action.to}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
