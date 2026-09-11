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
    RiMoreLine,
    RiPencilLine,
    RiSearchLine,
} from '@remixicon/react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/shared/utils/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
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
};

const COLUMN_LABELS: Record<string, string> = {
    name: 'Rutina',
    difficulty: 'Dificultad',
    exercisesCount: 'Ejercicios',
    description: 'Descripción',
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
            cell: ({ row }) => (
                <div className="text-left font-medium text-base">
                    <p className="truncate">{row.original.name}</p>
                    {row.original.description && (
                        <p className="truncate text-xs text-muted-foreground">{row.original.description}</p>
                    )}
                </div>
            ),
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
                let variant: 'default' | 'outline' | 'destructive' = 'default';
                let customClass = '';

                if (diff === 'BEGINNER') {
                    variant = 'default';
                    customClass = 'bg-green-700 text-green-300';
                } else if (diff === 'INTERMEDIATE') {
                    variant = 'default';
                } else if (diff === 'ADVANCED') {
                    variant = 'destructive';
                }

                return (
                    <Badge variant={variant} className={customClass ? `${customClass} text-sm` : 'text-sm'}>
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
            header: () => <span className="sr-only">Acciones</span>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="Acciones">
                                <RiMoreLine className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => onView(row.original)}>
                                <Eye className="size-4 mr-1.5" />
                                Ver Detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onEdit(row.original)}
                            >
                                <RiPencilLine aria-hidden="true" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete(row.original.id)}
                            >
                                <RiDeleteBinLine aria-hidden="true" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                            className="h-8 w-full sm:w-56 pl-8 text-sm"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" className="shrink-0">
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
                                                header.column.id === 'select' && 'pl-4 text-left',
                                                header.column.id === 'name' && 'pl-2 text-left'
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
                                                    cell.column.id === 'select' && 'pl-4 text-left',
                                                    cell.column.id === 'name' && 'pl-2 text-left'
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
                                        colSpan={columns.length}
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
