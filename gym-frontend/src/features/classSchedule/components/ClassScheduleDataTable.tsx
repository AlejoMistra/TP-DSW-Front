import { useState } from "react"
import { RiDeleteBinLine, RiMoreLine, RiPencilLine } from "@remixicon/react"
import { Plus } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import type { ClassSchedule } from "@/features/classSchedule/models/ClassSchedule"
import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog"

type ClassScheduleDataTableProps = {
  classes: ClassSchedule[]
  onEdit: (item: ClassSchedule) => void
  onDelete: (item: ClassSchedule) => void | Promise<void>
  title?: string
  subtitle?: string
  onAddNew?: () => void
  isLoading?: boolean
}

export function ClassScheduleDataTable({
  classes,
  onEdit,
  onDelete,
  title,
  subtitle,
  onAddNew,
  isLoading,
}: ClassScheduleDataTableProps) {
  const [itemToDelete, setItemToDelete] = useState<ClassSchedule | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      await onDelete(itemToDelete)
      setItemToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title ?? "Tipos de Clases"}</h2>
          <p className="text-sm text-muted-foreground">{subtitle ?? "Plantillas base para la programación de sesiones semanales"}</p>
        </div>

        {onAddNew && (
          <Button
            onClick={onAddNew}
            className="w-full md:w-auto md:px-5"
          >
            <Plus className="size-4" />
            Nuevo Tipo de Clase
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
              <TableHead className="h-10 pl-5 text-left font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Clase
              </TableHead>
              <TableHead className="h-10 text-center font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Categoría
              </TableHead>
              <TableHead className="h-10 text-center font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Duración
              </TableHead>
              <TableHead className="h-10 text-center font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Cupos Máximos
              </TableHead>
              <TableHead className="h-10 text-center font-bold text-xs uppercase tracking-wider text-muted-foreground">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i} className="border-b border-border">
                  <TableCell className="py-4 pl-5">
                    <div className="h-4 w-32 bg-muted/60 animate-pulse rounded" />
                    <div className="h-3 w-48 bg-muted/40 animate-pulse rounded mt-1.5" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-5 w-16 mx-auto bg-muted/60 animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-4 w-12 mx-auto bg-muted/60 animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-4 w-16 mx-auto bg-muted/60 animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-6 w-6 mx-auto bg-muted/60 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : classes.length ? (
              classes.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-border transition-colors duration-100 last:border-b-0 hover:bg-muted/30"
                >
                  {/* Nombre y descripción */}
                  <TableCell className="py-3.5 pl-5 text-left">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">
                        {item.name}
                      </span>
                      {item.description && (
                        <span className="text-sm text-muted-foreground line-clamp-1 max-w-md mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Categoría */}
                  <TableCell className="py-3.5 text-center">
                    <Badge variant="outline" className="font-medium">
                      {item.category}
                    </Badge>
                  </TableCell>

                  {/* Duración */}
                  <TableCell className="py-3.5 text-center text-sm font-medium text-muted-foreground">
                    {item.durationMinutes} min
                  </TableCell>

                  {/* Cupos */}
                  <TableCell className="py-3.5 text-center text-sm font-medium text-muted-foreground">
                    {item.maxCapacity} alumnos
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="py-3.5 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Acciones para ${item.name}`}>
                          <RiMoreLine className="size-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <RiPencilLine aria-hidden="true" className="size-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setItemToDelete(item)}
                        >
                          <RiDeleteBinLine aria-hidden="true" className="size-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-28 text-center text-sm text-muted-foreground">
                  No hay tipos de clases registrados. Hacé clic en &quot;+ Nuevo Tipo de Clase&quot; para comenzar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDeleteDialog
        open={Boolean(itemToDelete)}
        title="¿Confirmás eliminar este tipo de clase?"
        description={`Esta acción eliminará "${itemToDelete?.name}" del sistema y no se puede deshacer.`}
        isLoading={isDeleting}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default ClassScheduleDataTable