import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import { RoutineDataTable } from '@/features/routines/components/RoutineDataTable';
import { RoutineDetailsDialog } from '@/features/routines/components/RoutineDetailsDialog';
import { RoutineForm } from '@/features/routines/components/RoutineForm';
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog';
import type { Routine } from '@/features/routines/models/Routine';
import { usePageTitle } from '@/shared/context/PageHeaderContext';

export default function RoutinesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
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

    // Vista activa: 'list' (tabla) o 'form' (alta/edición)
    const [view, setView] = useState<'list' | 'form'>(() =>
        searchParams.get('new') === 'true' ? 'form' : 'list'
    );
    const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            setView('form');
            setSelectedRoutine(null);
        }
    }, [searchParams]);

    usePageTitle(view === 'form' ? (selectedRoutine ? 'Editar Rutina' : 'Nueva Rutina') : 'Rutinas');

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

    const handleBack = () => {
        if (searchParams.get('new')) {
            searchParams.delete('new');
            setSearchParams(searchParams, { replace: true });
        }
        setView('list');
        setSelectedRoutine(null);
    };

    const handleFormSuccess = () => {
        if (searchParams.get('new')) {
            searchParams.delete('new');
            setSearchParams(searchParams, { replace: true });
        }
        setView('list');
        setSelectedRoutine(null);
        refetch();
    };

    // Si está en modo formulario, renderizamos la pantalla Pro-Flow
    if (view === 'form') {
        return (
            <RoutineForm
                routine={selectedRoutine}
                onBack={handleBack}
                onSuccess={handleFormSuccess}
            />
        );
    }

    // Si está en modo listado, mostramos Tabla + Modales
    return (
        <div className="space-y-6">
            <RoutineDataTable
                routines={routines}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMultipleDelete={handleMultipleDelete}
                loading={loading}
                onNew={handleNew}
                totalRoutines={routines.length}
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
