import {
  RiDeleteBinLine,
  RiPencilLine,
} from '@remixicon/react'
import { Plus } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'

import type { Instructor } from '@/features/instructors/models/Instructor'

type InstructorsDataTableProps = {
  instructors: Instructor[]
  loading: boolean
  onEdit: (instructor: Instructor) => void
  onDelete: (id: number) => void
  onAddNew?: () => void
  totalInstructors?: number
}

export default function InstructorsDataTable({
  instructors,
  loading,
  onEdit,
  onDelete,
  onAddNew,
  totalInstructors,
}: InstructorsDataTableProps) {
  async function handleDelete(instructor: Instructor) {
    await onDelete(instructor.id)
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            Listado de Instructores
          </h2>

          <p className="text-sm text-muted-foreground">
            Instructores registrados en el sistema.
          </p>
          {totalInstructors !== undefined && (
            <div className="pt-1">
              <Badge variant="secondary" className="px-2.5 py-0.5 text-xs">
                Total de instructores: {totalInstructors}
              </Badge>
            </div>
          )}
        </div>

        {onAddNew && (
          <Button onClick={onAddNew} className="w-full sm:w-auto">
            <Plus className="mr-1 size-3.5" aria-hidden="true" />
            Nuevo instructor
          </Button>
        )}
      </div>

      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
              <TableHead className="h-10 pl-4 text-left text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Nombre
              </TableHead>

              <TableHead className="h-10 pl-4 text-left text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Apellido
              </TableHead>

              <TableHead className="h-10 pl-4 text-left text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Email
              </TableHead>

              <TableHead className="h-10 pl-4 text-left text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Teléfono
              </TableHead>

              <TableHead className="h-10 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  Cargando instructores...
                </TableCell>
              </TableRow>
            ) : instructors.length > 0 ? (
              instructors.map((instructor) => (
                <TableRow
                  key={instructor.id}
                  className="border-b border-border transition-colors duration-100 last:border-b-0 hover:bg-muted/30"
                >
                  <TableCell className="py-3 pl-4 font-medium">
                    {instructor.name}
                  </TableCell>

                  <TableCell className="py-3">
                    {instructor.surname}
                  </TableCell>

                  <TableCell className="py-3 text-muted-foreground">
                    {instructor.email}
                  </TableCell>

                  <TableCell className="py-3 text-muted-foreground">
                    {instructor.phone || 'Sin teléfono'}
                  </TableCell>

                  <TableCell className="py-3 text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        title="Editar"
                        onClick={() => onEdit(instructor)}
                      >
                        <RiPencilLine aria-hidden="true" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        className="cursor-pointer"
                        title="Eliminar"
                        onClick={() => handleDelete(instructor)}
                      >
                        <RiDeleteBinLine aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No hay instructores cargados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}