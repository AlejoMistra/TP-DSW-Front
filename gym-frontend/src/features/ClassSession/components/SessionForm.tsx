import React, { useState, useEffect, useMemo } from 'react'
import {
  AlertCircle,
  Ban,
  RotateCcw,
  Trash2,
  Repeat,
} from 'lucide-react'
import type {
  ClassSession,
  RecurrenceScope,
  RecurrenceInput,
} from '../models/ClassSession'
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
import { RecurrenceScopeDialog } from './RecurrenceScopeDialog'
import { ConfirmDeleteDialog } from '@/shared/components/ConfirmDeleteDialog'

export interface SessionFormValues {
  classScheduleId: number
  instructorId: number | null
  date: string
  startTime: string
  recurrence?: RecurrenceInput
  scope?: RecurrenceScope
}

interface SessionFormProps {
  mode: 'create' | 'edit'
  session?: ClassSession | null
  initialDate?: string | null
  schedules: ClassSchedule[]
  instructors: Instructor[]
  onClose: () => void
  onSubmit: (values: SessionFormValues) => Promise<any>
  onCancelSession?: (scope?: RecurrenceScope) => Promise<void>
  onRestoreSession?: (scope?: RecurrenceScope) => Promise<void>
  onDeleteSession?: (scope?: RecurrenceScope) => Promise<void>
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

const WEEKDAY_OPTIONS = [
  { label: 'L', name: 'Lunes', value: 1 },
  { label: 'M', name: 'Martes', value: 2 },
  { label: 'M', name: 'Miércoles', value: 3 },
  { label: 'J', name: 'Jueves', value: 4 },
  { label: 'V', name: 'Viernes', value: 5 },
  { label: 'S', name: 'Sábado', value: 6 },
  { label: 'D', name: 'Domingo', value: 7 },
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [pendingDeleteScope, setPendingDeleteScope] = useState<RecurrenceScope>('this')

  // Recurrence state for CREATE mode
  const [isRecurring, setIsRecurring] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>(() => {
    const d = parseDateString(date || toLocalDateString(new Date()))
    const isoDay = d.getDay() === 0 ? 7 : d.getDay()
    return [isoDay]
  })

  const [endDate, setEndDate] = useState<string>(() => {
    const d = parseDateString(date || toLocalDateString(new Date()))
    d.setMonth(d.getMonth() + 1)
    return toLocalDateString(d)
  })

  // Scope Dialog state for EDIT mode
  const [scopeDialogOpen, setScopeDialogOpen] = useState(false)
  const [scopeActionType, setScopeActionType] = useState<'edit' | 'cancel' | 'delete'>('edit')

  // Maximum allowed end date (3 months from start date)
  const maxEndDate = useMemo(() => {
    if (!date) return ''
    const d = parseDateString(date)
    d.setMonth(d.getMonth() + 3)
    return toLocalDateString(d)
  }, [date])

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
      if (initialDate) {
        setDate(initialDate)
        const d = parseDateString(initialDate)
        const isoDay = d.getDay() === 0 ? 7 : d.getDay()
        setSelectedDays([isoDay])
        const endD = new Date(d)
        endD.setMonth(endD.getMonth() + 1)
        setEndDate(toLocalDateString(endD))
      }
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
  const isPartOfRecurrence = Boolean(session?.recurrenceId)

  const toggleDay = (dayValue: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayValue)) {
        if (prev.length === 1) return prev // Mantener al menos un día seleccionado
        return prev.filter((d) => d !== dayValue)
      }
      return [...prev, dayValue].sort((a, b) => a - b)
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedScheduleId) return

    // Si es edición y forma parte de una serie recurrente, pedir alcance con diálogo
    if (mode === 'edit' && isPartOfRecurrence) {
      setScopeActionType('edit')
      setScopeDialogOpen(true)
      return
    }

    // Creación o edición puntual sin serie
    await executeSave('this')
  }

  const executeSave = async (scope: RecurrenceScope = 'this') => {
    setIsSubmitting(true)
    try {
      const payload: SessionFormValues = {
        classScheduleId: Number(selectedScheduleId),
        instructorId:
          selectedInstructorId === 'none' ? null : Number(selectedInstructorId),
        date,
        startTime,
        scope,
      }

      if (mode === 'create' && isRecurring) {
        payload.recurrence = {
          frequency: 'WEEKLY',
          interval: 1,
          daysOfWeek: selectedDays,
          endDate,
        }
      }

      await onSubmit(payload)
      onClose()
    } catch {
      // Error manejado en hook padre
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScopeConfirm = async (selectedScope: RecurrenceScope) => {
    if (scopeActionType === 'edit') {
      await executeSave(selectedScope)
    } else if (scopeActionType === 'cancel') {
      if (isCancelled) {
        if (onRestoreSession) await onRestoreSession(selectedScope)
      } else {
        if (onCancelSession) await onCancelSession(selectedScope)
      }
      onClose()
    } else if (scopeActionType === 'delete') {
      setPendingDeleteScope(selectedScope)
      setScopeDialogOpen(false)
      setConfirmDeleteOpen(true)
    }
  }

  const handleDeleteTrigger = () => {
    if (isPartOfRecurrence) {
      setScopeActionType('delete')
      setScopeDialogOpen(true)
    } else {
      setPendingDeleteScope('this')
      setConfirmDeleteOpen(true)
    }
  }

  const handleCancelTrigger = () => {
    if (isPartOfRecurrence) {
      setScopeActionType('cancel')
      setScopeDialogOpen(true)
    } else {
      if (isCancelled) {
        onRestoreSession?.('this').then(() => onClose())
      } else {
        onCancelSession?.('this').then(() => onClose())
      }
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!onDeleteSession) return
    setIsSubmitting(true)
    try {
      await onDeleteSession(pendingDeleteScope)
      setConfirmDeleteOpen(false)
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
    <>
      <div className="flex flex-col gap-4 text-foreground w-full">
        {/* Header for edit mode */}
        {mode === 'edit' && (
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-base font-bold tracking-tight text-foreground">
              Edición sesión de {currentSchedule?.name ?? 'Clase'} ({dayName})
            </h3>
            {isPartOfRecurrence && (
              <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Repeat className="size-3" /> Periódica
              </span>
            )}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Form Fields */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 max-h-[55vh] sm:max-h-[60vh]">
            {/* Tipo de Clase */}
            <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tipo de Clase *
              </Label>
              {mode === 'edit' && (
                <span className="text-[11px] text-muted-foreground italic">
                  (Inmutable en edición)
                </span>
              )}
            </div>

            <Select
              value={selectedScheduleId}
              onValueChange={setSelectedScheduleId}
              disabled={mode === 'edit'}
              required
            >
              <SelectTrigger
                className={`w-full h-9 font-medium ${
                  mode === 'edit' ? 'opacity-85 cursor-not-allowed bg-muted/40' : ''
                }`}
              >
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
              onChange={(e) => {
                const newDate = e.target.value
                setDate(newDate)
                if (mode === 'create' && newDate) {
                  const d = parseDateString(newDate)
                  const isoDay = d.getDay() === 0 ? 7 : d.getDay()
                  setSelectedDays((prev) =>
                    prev.length > 1
                      ? prev.includes(isoDay)
                        ? prev
                        : [...prev, isoDay].sort((a, b) => a - b)
                      : [isoDay]
                  )
                  // Ajustar endDate si es menor que la nueva fecha de inicio
                  setEndDate((prevEnd) => {
                    if (!prevEnd || prevEnd < newDate) {
                      const nextM = new Date(d)
                      nextM.setMonth(nextM.getMonth() + 1)
                      return toLocalDateString(nextM)
                    }
                    return prevEnd
                  })
                }
              }}
              required
            />
          </div>

          {/* Horario (Inicio y Fin Calculado) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Horario
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
              <span>
                Capacidad máxima:{' '}
                <strong className="text-foreground">
                  {currentSchedule.maxCapacity} alumnos
                </strong>
              </span>
            </div>
          )}

          {/* Panel de Repetición / Recurrencia (Solo en CREATE) */}
          {mode === 'create' && (
            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="repeat-checkbox"
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    id="repeat-checkbox"
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="size-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <Repeat className="size-3.5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Repetir clase (recurrente)
                    </span>
                  </div>
                </label>
              </div>

              {isRecurring && (
                <div className="pt-2 border-t border-border/50 space-y-3">
                  {/* Selector de días de la semana */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-muted-foreground">
                        Días de la semana
                      </Label>
                      <span className="text-[10px] text-muted-foreground">
                        (Repetición semanal)
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 w-full">
                      {WEEKDAY_OPTIONS.map((day) => {
                        const isSelected = selectedDays.includes(day.value)
                        return (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleDay(day.value)}
                            title={day.name}
                            className={`h-8 flex-1 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'border border-border/80 bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground'
                            }`}
                          >
                            {day.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Fecha de Fin */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-muted-foreground">
                        Repetir hasta *
                      </Label>
                      <span className="text-[10px] text-muted-foreground">
                        (Máximo 3 meses)
                      </span>
                    </div>
                    <Input
                      type="date"
                      value={endDate}
                      min={date}
                      max={maxEndDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required={isRecurring}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          </div>

          {/* Fixed Footer Actions (Pinned at the bottom) */}
          <div className="shrink-0 flex items-center justify-between border-t border-border/60 pt-3 mt-2 bg-card">
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
                        onClick={handleCancelTrigger}
                        className="gap-2 text-sm"
                      >
                        <RotateCcw className="size-3.5 text-emerald-500" />
                        Restaurar Sesión
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={handleCancelTrigger}
                        className="gap-2 text-sm text-primary focus:text-primary"
                      >
                        <Ban className="size-3.5" />
                        Cancelar Sesión
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleDeleteTrigger}
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
                    Cerrar
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
                  {isSubmitting
                    ? 'Guardando...'
                    : isRecurring
                    ? 'Agendar clases periódicas'
                    : 'Agendar clase'}
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Modal de Confirmación Estándar para Clases (Puntuales o Series) */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        title={
          pendingDeleteScope === 'all'
            ? '¿Confirmás eliminar todas las clases?'
            : pendingDeleteScope === 'following'
            ? '¿Confirmás eliminar esta clase y las siguientes?'
            : '¿Confirmás eliminar solo esta clase?'
        }
        description={
          pendingDeleteScope === 'all'
            ? 'Se eliminarán todas las clases de la serie (excepto las dictadas) y se cancelarán las reservas asociadas.'
            : pendingDeleteScope === 'following'
            ? 'Se eliminará esta clase y las siguientes, cancelando las reservas asociadas.'
            : 'Se eliminará solo esta clase del cronograma y se cancelarán las reservas asociadas.'
        }
        isLoading={isSubmitting}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteConfirmed}
      />

      {/* Modal de Alcance estilo Google Calendar (Para sesiones con recurrencia) */}
      {session && session.id && (
        <RecurrenceScopeDialog
          open={scopeDialogOpen}
          sessionId={session.id}
          actionType={scopeActionType}
          onClose={() => setScopeDialogOpen(false)}
          onConfirm={handleScopeConfirm}
        />
      )}
    </>
  )
}

export default SessionForm
