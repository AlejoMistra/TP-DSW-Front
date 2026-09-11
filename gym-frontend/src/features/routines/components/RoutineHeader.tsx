import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

type RoutineHeaderProps = {
    totalRoutines: number;
    onNew: () => void;
};

export function RoutineHeader({ totalRoutines, onNew }: RoutineHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Rutinas</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {totalRoutines === 0
                        ? 'No hay rutinas registradas'
                        : totalRoutines === 1
                            ? '1 rutina registrada'
                            : `${totalRoutines} rutinas registradas`}
                </p>
            </div>

            <Button onClick={onNew} className="w-full sm:w-auto">
                <Plus className="size-4 mr-1.5" />
                Nueva Rutina
            </Button>
        </div>
    );
}
