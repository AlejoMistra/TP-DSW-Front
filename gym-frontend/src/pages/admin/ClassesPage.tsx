import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type {
  ClassSchedule,
  CreateClassScheduleInput,
} from "@/features/classSchedule/models/ClassSchedule"
import { classScheduleService } from "@/features/classSchedule/api/classScheduleService"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs"
import ClassScheduleDataTable from "@/features/classSchedule/components/ClassScheduleDataTable"
import ClassScheduleDialog from "@/features/classSchedule/components/ClassScheduleDialog"
import WeeklyAgendaTab from "@/features/ClassSession/components/WeeklyAgendaTab"

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state for create/edit ClassSchedule
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null)

  const loadClasses = useCallback(async () => {
    setLoading(true)
    try {
      const data = await classScheduleService.getAll()
      setClasses(data)
    } catch (err: any) {
      toast.error("Error al cargar tipos de clases", {
        description: err?.message || "No se pudo conectar con el servidor.",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  // Open Dialog for Create
  function handleOpenCreate() {
    setEditingSchedule(null)
    setIsScheduleDialogOpen(true)
  }

  // Open Dialog for Edit
  function handleOpenEdit(item: ClassSchedule) {
    setEditingSchedule(item)
    setIsScheduleDialogOpen(true)
  }

  // Submit Handler (Create or Update)
  async function handleSubmitSchedule(data: CreateClassScheduleInput) {
    try {
      if (editingSchedule) {
        await classScheduleService.update(editingSchedule.id, data)
        toast.success("Tipo de clase actualizado", {
          description: `${data.name} fue modificado exitosamente.`,
        })
      } else {
        await classScheduleService.create(data)
        toast.success("Tipo de clase creado", {
          description: `${data.name} fue creado exitosamente.`,
        })
      }
      await loadClasses()
    } catch (err: any) {
      toast.error("Error al guardar tipo de clase", {
        description: err?.message || "Ocurrió un error inesperado.",
      })
      throw err
    }
  }

  // Delete Handler
  async function handleDeleteSchedule(item: ClassSchedule) {
    try {
      await classScheduleService.delete(item.id)
      toast.success("Tipo de clase eliminado", {
        description: `${item.name} fue eliminado.`,
      })
      await loadClasses()
    } catch (err: any) {
      toast.error("Error al eliminar tipo de clase", {
        description: err?.message || "Ocurrió un error al intentar eliminar.",
      })
      throw err
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Gestión de Clases</h1>
            <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
              Configurá los tipos de clases y gestioná el cronograma semanal del gimnasio.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="agenda">
        <TabsList variant="line">
          <TabsTrigger value="agenda">Cronograma Semanal</TabsTrigger>
          <TabsTrigger value="classesType">Tipos de Clases</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda">
          <div className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
            <WeeklyAgendaTab />
          </div>
        </TabsContent>

        <TabsContent value="classesType">
          <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
            <ClassScheduleDataTable
              classes={classes}
              isLoading={loading}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteSchedule}
              onAddNew={handleOpenCreate}
              title="Tipos de Clases"
              subtitle="Plantillas base para la programación de sesiones semanales"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for Creating / Editing ClassSchedule */}
      <ClassScheduleDialog
        open={isScheduleDialogOpen}
        classSchedule={editingSchedule}
        onClose={() => setIsScheduleDialogOpen(false)}
        onSubmit={handleSubmitSchedule}
        onDelete={async (id) => {
          const item = classes.find((c) => String(c.id) === String(id))
          if (item) await handleDeleteSchedule(item)
        }}
      />
    </div>
  )
}