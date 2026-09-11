import React, { useState, useEffect, useMemo } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import type { ClassSession } from '../models/ClassSession'
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule'
import type { Instructor } from '@/features/instructors/models/Instructor'
import {
  calculateEndTime,
  toLocalDateString,
  parseDateString,
} from '../lib/dateUtils'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export interface SessionFormValues {
  classScheduleId: number
  instructorId: number | null
  date: string
  startTime: string
}

interface SessionFormProps {
  mode: 'create' | 'edit'
  session?: ClassSession | null
  initialDate?: string | null
  schedules: ClassSchedule[]
  instructors: Instructor[]
  onClose: () => void
  onSubmit: (values: SessionFormValues) => Promise<any>
  onCancelSession?: () => Promise<void>
  onRestoreSession?: () => Promise<void>
  onDeleteSession?: () => Promise<void>
}

const SPANISH_DAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

export function SessionForm({
  mode,
  session,
  initialDate,
  schedules,
  instructors,
  onClose,
  onSubmit,
  onCancelSession,
  onRestoreSession,
  onDeleteSession,
}: SessionFormProps) {
  // Initialize state based on mode and session
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(() => {
    if (session?.classScheduleId) return String(session.classScheduleId)
    if (schedules.length > 0) return String(schedules[0].id)
    return ''
  })

  const [selectedInstructorId, setSelectedInstructorId] = useState<string>(() => {
    if (session?.instructorId) return String(session.instructorId)
    return 'none'
  })

  const [date, setDate] = useState<string>(() => {
    if (session?.date) {
      const d =
        typeof session.date === 'string'
          ? parseDateString(session.date)
          : session.date
      return toLocalDateString(d)
    }
    return initialDate || toLocalDateString(new Date())
  })

  const [startTime, setStartTime] = useState<string>(
    session?.startTime || '08:00'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Sync if session changes
  useEffect(() => {
    if (session) {
      setSelectedScheduleId(String(session.classScheduleId))
      setSelectedInstructorId(
        session.instructorId ? String(session.instructorId) : 'none'
      )
      const d =
        typeof session.date === 'string'
          ? parseDateString(session.date)
          : session.date
      setDate(toLocalDateString(d))
      setStartTime(session.startTime || '08:00')
    } else if (mode === 'create') {
      if (initialDate) setDate(initialDate)
      if (schedules.length > 0 && !selectedScheduleId) {
        setSelectedScheduleId(String(schedules[0].id))
      }
    }
  }, [session, mode, initialDate, schedules])

  const currentSchedule = useMemo(() => {
    return (
      schedules.find((s) => String(s.id) === selectedScheduleId) ||
      session?.classSchedule ||
      null
    )
  }, [schedules, selectedScheduleId, session])

  const duration = currentSchedule?.durationMinutes ?? 60
  const endTime = useMemo(
    () => calculateEndTime(startTime, duration),
    [startTime, duration]
  )

  const dayName = useMemo(() => {
    if (!date) return ''
    const d = parseDateString(date)
    return SPANISH_DAYS[d.getDay()] || ''
  }, [date])

  const isCancelled = session?.status === 'CANCELLED'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedScheduleId) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        classScheduleId: Number(selectedScheduleId),
        instructorId:
          selectedInstructorId === 'none' ? null : Number(selectedInstructorId),
        date,
        startTime,
      })
      onClose()
    } catch {
      // Error handled by parent hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!onDeleteSession) return
    setIsSubmitting(true)
    try {
      await onDeleteSession()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (schedules.length === 0) {
    return (
      <div className="my-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
        <AlertCircle className="mx-auto size-6 text-primary mb-2" />
        <p className="text-sm font-medium text-foreground">
          No hay Tipos de Clases registrados
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Primero creá un Tipo de Clase en la pestaña &quot;Tipos de Clases&quot; para poder agendar sesiones.
        </p>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 text-foreground w-full">
      {/* Header for edit mode */}
      {mode === 'edit' && (
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <h3 className="text-base font-bold tracking-tight text-foreground">
            Edición sesión de {currentSchedule?.name ?? 'Clase'} ({dayName})
          </h3>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Tipo de Clase */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tipo de Clase *
          </Label>
          <Select
            value={selectedScheduleId}
            onValueChange={setSelectedScheduleId}
            required
          >
            <SelectTrigger className="w-full h-9 font-medium">
              <SelectValue placeholder="Seleccioná una clase" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name} ({s.durationMinutes} min • {s.maxCapacity} cupos)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fecha *
          </Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Horario (Inicio y Fin Calculado) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Horario
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Hora de Inicio *
              </span>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Hora de Fin (Calculada)
              </span>
              <Input
                type="text"
                value={`${endTime} (${duration}m)`}
                disabled
                className="bg-muted/30 cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Instructor Asignado */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Instructor Asignado
          </Label>
          <Select
            value={selectedInstructorId}
            onValueChange={setSelectedInstructorId}
          >
            <SelectTrigger className="w-full h-9">
              <div className="flex items-center gap-2 truncate">
                <SelectValue placeholder="Seleccionar instructor" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin instructor asignado</SelectItem>
              {instructors.map((inst) => (
                <SelectItem key={inst.id} value={String(inst.id)}>
                  {inst.name} {inst.surname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Capacidad Máxima */}
        {currentSchedule && (
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2  text-sm text-muted-foreground">
            <span>
              Capacidad máxima:{' '}
              <strong className="text-foreground">
                {currentSchedule.maxCapacity} alumnos
              </strong>
            </span>
          </div>
        )}

        {/* Confirm Delete Banner (Edit mode only) */}
        {confirmDelete && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              ¿Confirmás eliminar esta sesión?
            </div>
            <p className="mt-1 text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="h-7 text-sm"
              >
                Sí, eliminar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
                className="h-7 text-sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-1">
          {mode === 'edit' ? (
            <>
              {/* Advanced menu on the left */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Opciones
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {isCancelled ? (
                    <DropdownMenuItem
                      onClick={onRestoreSession}
                      className="gap-2 text-sm"
                    >
                      <RotateCcw className="size-3.5 text-emerald-500" />
                      Restaurar Sesión
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={onCancelSession}
                      className="gap-2 text-sm text-primary focus:text-primary"
                    >
                      <Ban className="size-3.5" />
                      Cancelar Sesión
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setConfirmDelete(true)}
                    className="gap-2 text-sm text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cancel & Save buttons on the right */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="h-8 text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !selectedScheduleId}
                  className="h-8 text-sm font-semibold"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </>
          ) : (
            /* Create mode: simple right-aligned buttons */
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8 text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !selectedScheduleId}
                className="h-8 text-sm font-semibold"
              >
                {isSubmitting ? 'Guardando...' : 'Agendar clase'}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default SessionForm
