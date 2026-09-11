import { useState } from 'react';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import { RoutineHeader } from '@/features/routines/components/RoutineHeader';
import { RoutineDataTable } from '@/features/routines/components/RoutineDataTable';
import { RoutineDetailsDialog } from '@/features/routines/components/RoutineDetailsDialog';
import { RoutineForm } from '@/features/routines/components/RoutineForm';
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog';
import type { Routine } from '@/features/routines/models/Routine';

export default function RoutinesPage() {
    const {
        routines,
        loading,
        refetch,
        handleDelete,
        handleMultipleDelete,
        deleteConfirm,
        setDeleteConfirm,
        confirmDelete,
        isDeleting,
    } = useRoutines();

    // Vista activa: 'list' (tabla) o 'form' (alta/edición Pro-Flow)
    const [view, setView] = useState<'list' | 'form'>('list');
    const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handleNew = () => {
        setSelectedRoutine(null);
        setView('form');
    };

    const handleEdit = (routine: Routine) => {
        setSelectedRoutine(routine);
        setView('form');
    };

    const handleView = (routine: Routine) => {
        setSelectedRoutine(routine);
        setDetailsOpen(true);
    };

    const handleFormSuccess = () => {
        setView('list');
        setSelectedRoutine(null);
        refetch();
    };

    // Si está en modo formulario, renderizamos la pantalla Pro-Flow
    if (view === 'form') {
        return (
            <RoutineForm
                routine={selectedRoutine}
                onBack={() => {
                    setView('list');
                    setSelectedRoutine(null);
                }}
                onSuccess={handleFormSuccess}
            />
        );
    }

    // Si está en modo listado, mostramos Header + Tabla + Modales
    return (
        <div className="space-y-6">
            <RoutineHeader totalRoutines={routines.length} onNew={handleNew} />

            <RoutineDataTable
                routines={routines}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMultipleDelete={handleMultipleDelete}
                loading={loading}
            />

            {/* Modal para previsualizar los ejercicios de una rutina */}
            <RoutineDetailsDialog
                routine={selectedRoutine}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />

            {/* Diálogo de confirmación de eliminación */}
            <ConfirmDeleteDialog
                open={deleteConfirm.open}
                title="¿Confirmás eliminar esta rutina?"
                description="Esta acción eliminará la rutina y todos sus ejercicios asociados del sistema."
                isLoading={isDeleting}
                onClose={() => setDeleteConfirm({ open: false, ids: [] })}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
