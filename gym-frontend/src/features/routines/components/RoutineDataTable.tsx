'use client';

import * as React from 'react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    RiArrowDownLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiArrowUpLine,
    RiDeleteBinLine,
    RiExpandUpDownLine,
    RiLayoutColumnLine,
    RiPencilLine,
    RiSearchLine,
} from '@remixicon/react';
import { Eye, Plus } from 'lucide-react';

import { cn } from '@/shared/utils/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import type { Routine } from '../models/Routine';

type RoutineDataTableProps = {
    routines: Routine[];
    onView: (routine: Routine) => void;
    onEdit: (routine: Routine) => void;
    onDelete: (id: number) => void;
    onMultipleDelete?: (ids: number[]) => void;
    loading?: boolean;
    onNew?: () => void;
    totalRoutines?: number;
};

const COLUMN_LABELS: Record<string, string> = {
    name: 'Rutina',
    difficulty: 'Dificultad',
    exercisesCount: 'Ejercicios',
};

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
    if (sorted === 'asc') return <RiArrowUpLine className="size-3.5" aria-hidden="true" />;
    if (sorted === 'desc') return <RiArrowDownLine className="size-3.5" aria-hidden="true" />;
    return <RiExpandUpDownLine className="size-3.5 text-muted-foreground/60" aria-hidden="true" />;
}

export function RoutineDataTable({
    routines,
    onView,
    onEdit,
    onDelete,
    onMultipleDelete,
    loading,
    onNew,
    totalRoutines,
}: RoutineDataTableProps) {
    const isMobile = useIsMobile();
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'name', desc: false }]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [data, setData] = React.useState(routines);

    React.useEffect(() => {
        setData(routines);
    }, [routines]);

    const columns: ColumnDef<Routine>[] = [
        {
            id: 'select',
            enableSorting: false,
            enableHiding: false,
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? 'indeterminate'
                                : false
                    }
                    onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
                    aria-label="Seleccionar todas"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                    aria-label={`Seleccionar ${row.original.name}`}
                />
            ),
        },
        {
            accessorKey: 'name',
            enableHiding: false,
            header: ({ column }) => (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-mx-1 inline-flex items-center gap-1 rounded-none px-1 text-sm font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                    Rutina
                    <SortIcon sorted={column.getIsSorted()} />
                </button>
            ),
            cell: ({ row }) => {
                const routine = row.original;
                return (
                    <div className="flex min-w-0 w-full items-center justify-start gap-3 text-left">
                        <div className="min-w-0 text-left">
                            <p className="truncate text-base leading-tight font-medium" title={routine.name}>
                                {routine.name}
                            </p>
                            {routine.description && (
                                <p className="truncate text-sm text-muted-foreground" title={routine.description}>
                                    {routine.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'difficulty',
            header: () => (
                <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    Dificultad
                </span>
            ),
            cell: ({ row }) => {
                const diff = row.original.difficulty;
                return (
                    <Badge variant="secondary" className="text-sm">
                        {diff === 'BEGINNER' && 'Principiante'}
                        {diff === 'INTERMEDIATE' && 'Intermedio'}
                        {diff === 'ADVANCED' && 'Avanzado'}
                    </Badge>
                );
            },
        },
        {
            id: 'exercisesCount',
            header: () => (
                <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    Ejercicios
                </span>
            ),
            cell: ({ row }) => {
                const count = row.original.routineExercises?.length ?? 0;
                return <span className="text-sm font-semibold">{count}</span>;
            },
        },
        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            header: () => (
                <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    Acciones
                </span>
            ),
            cell: ({ row }) => (
                <div className="flex justify-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        title="Ver detalle"
                        onClick={() => onView(row.original)}
                    >
                        <Eye aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        title="Editar"
                        onClick={() => onEdit(row.original)}
                    >
                        <RiPencilLine aria-hidden="true" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon-sm"
                        className="cursor-pointer"
                        title="Eliminar"
                        onClick={() => onDelete(row.original.id)}
                    >
                        <RiDeleteBinLine aria-hidden="true" />
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getRowId: (row) => row.id.toString(),
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 8 } },
    });

    React.useEffect(() => {
        setColumnVisibility((prev) => {
            if (Object.keys(prev).length > 0) return prev;
            return isMobile ? { description: false } : {};
        });
    }, [isMobile]);

    const nameFilter = (table.getColumn('name')?.getFilterValue() as string) ?? '';
    const selectedCount = table.getFilteredSelectedRowModel().rows.length;
    const pageCount = table.getPageCount();

    function handleRemove() {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);
        onMultipleDelete?.(selectedIds);
        table.resetRowSelection();
    }

    if (loading) {
        return <div className="text-center py-8">Cargando rutinas...</div>;
    }

    if (routines.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No hay rutinas registradas</div>;
    }

    return (
        <section className="w-full">
            <div className="w-full">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-0 flex-1 sm:w-auto sm:flex-none">
                            <RiSearchLine
                                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <Input
                                type="search"
                                value={nameFilter}
                                onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                                placeholder="Buscar rutina..."
                                className="w-full sm:w-56 pl-8 text-sm"
                            />
                        </div>
                        {totalRoutines !== undefined && (
                            <Badge variant="secondary" className="px-2.5 py-0.5 text-sm">
                                Total: {totalRoutines}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="shrink-0 h-8">
                                    <RiLayoutColumnLine className="size-3.5" aria-hidden="true" />
                                    Columnas
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Filtrar Columnas</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(checked) => column.toggleVisibility(checked === true)}
                                            >
                                                {COLUMN_LABELS[column.id] ?? column.id}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {onNew && (
                            <Button className="shrink-0" onClick={onNew}>
                                <Plus className="mr-1 size-3.5" />
                                Nueva Rutina
                            </Button>
                        )}
                    </div>
                </div>

                {selectedCount > 0 && (
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/40 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground tabular-nums">
                                {selectedCount} {selectedCount === 1 ? 'rutina seleccionada' : 'rutinas seleccionadas'}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => table.resetRowSelection()}
                            >
                                Limpiar
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={handleRemove}
                        >
                            <RiDeleteBinLine className="size-3.5" aria-hidden="true" />
                            Eliminar
                        </Button>
                    </div>
                )}

                <div className="border border-border bg-card">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-b border-border bg-muted/40 hover:bg-muted/40"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                'h-10 text-center align-middle text-sm',
                                                header.column.id === 'select' && 'w-px pl-4 text-left',
                                                header.column.id === 'name' && 'w-full pl-2 text-left',
                                                header.column.id === 'difficulty' && 'w-px whitespace-nowrap px-4 text-center',
                                                header.column.id === 'exercisesCount' && 'w-px whitespace-nowrap px-4 text-center',
                                                header.column.id === 'actions' && 'w-px whitespace-nowrap px-4 text-center'
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() ? 'selected' : undefined}
                                        className="border-b border-border transition-colors duration-100 last:border-b-0 hover:bg-muted/30"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    'py-3 text-center align-middle',
                                                    cell.column.id === 'select' && 'w-px pl-4 text-left',
                                                    cell.column.id === 'name' && 'w-full max-w-0 pl-2 text-left',
                                                    cell.column.id === 'difficulty' && 'w-px whitespace-nowrap px-4 text-center',
                                                    cell.column.id === 'exercisesCount' && 'w-px whitespace-nowrap px-4 text-center',
                                                    cell.column.id === 'actions' && 'w-px whitespace-nowrap px-4 text-center'
                                                )}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell
                                        colSpan={table.getVisibleFlatColumns().length}
                                        className="h-24 text-center text-sm text-muted-foreground"
                                    >
                                        No se encontraron rutinas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-end gap-4 border-t border-border bg-muted/20 px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-7"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <RiArrowLeftSLine className="size-3.5" aria-hidden="true" />
                            </Button>
                            <span className="px-1 text-sm text-muted-foreground tabular-nums">
                                Página {table.getState().pagination.pageIndex + 1} de{' '}
                                {Math.max(pageCount, 1)}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-7"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <RiArrowRightSLine className="size-3.5" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
