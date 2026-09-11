import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { ClassSession, CreateClassSessionInput, UpdateClassSessionInput } from '../models/ClassSession'
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule'
import type { Instructor } from '@/features/instructors/models/Instructor'
import { classSessionService } from '../api/classSessionService'
import { classScheduleService } from '@/features/classSchedule/api/classScheduleService'
import { instructorService } from '@/features/instructors/api/instructorService'
import {
  getMondayOfWeek,
  getWeekDays,
  formatWeekRange,
  shiftWeek,
  toLocalDateString,
  parseDateString,
} from '../lib/dateUtils'

export function useWeeklySessions() {
  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(() =>
    getMondayOfWeek(new Date())
  )
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [schedules, setSchedules] = useState<ClassSchedule[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Edit popover / selection state
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null)

  // Create dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createInitialDate, setCreateInitialDate] = useState<string | null>(null)

  // Load all sessions from API
  const loadSessions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [sessionsData, schedulesData, instructorsData] = await Promise.all([
        classSessionService.getAll(),
        classScheduleService.getAll().catch(() => [] as ClassSchedule[]),
        instructorService.getAll().catch(() => [] as Instructor[]),
      ])

      setSchedules(schedulesData)
      setInstructors(instructorsData)

      // Enrich sessions with schedule and instructor if not present
      const scheduleMap = new Map(schedulesData.map((s) => [s.id, s]))
      const instructorMap = new Map(instructorsData.map((i) => [String(i.id), i]))

      const enriched = sessionsData.map((session) => {
        const sched = session.classSchedule ?? scheduleMap.get(session.classScheduleId)
        const inst =
          session.instructor ??
          (session.instructorId ? instructorMap.get(String(session.instructorId)) : null)

        return {
          ...session,
          classSchedule: sched,
          instructor: inst,
        }
      })

      setSessions(enriched)
    } catch (err: any) {
      const msg = err?.message || 'No se pudo conectar con el servidor para obtener las clases.'
      setError(msg)
      toast.error('Error de conexión', {
        description: msg,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Navigation handlers
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekMonday((prev) => shiftWeek(prev, -1))
    setEditingSession(null)
  }, [])

  const goToNextWeek = useCallback(() => {
    setCurrentWeekMonday((prev) => shiftWeek(prev, 1))
    setEditingSession(null)
  }, [])

  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekMonday(getMondayOfWeek(new Date()))
    setEditingSession(null)
  }, [])

  // 6 Days of current week (Lunes a Sábado)
  const weekDays = useMemo(() => getWeekDays(currentWeekMonday), [currentWeekMonday])

  // Week range string: "17 - 22 Octubre"
  const weekRangeLabel = useMemo(
    () => formatWeekRange(currentWeekMonday),
    [currentWeekMonday]
  )

  // Map of sessions by date (YYYY-MM-DD)
  const sessionsByDay = useMemo(() => {
    const map = new Map<string, ClassSession[]>()
    for (const day of weekDays) {
      map.set(day.dateString, [])
    }

    for (const s of sessions) {
      const d = typeof s.date === 'string' ? parseDateString(s.date) : s.date
      const dateStr = toLocalDateString(d)
      if (map.has(dateStr)) {
        map.get(dateStr)!.push(s)
      }
    }

    // Sort each day's sessions by startTime ascending
    for (const [, list] of map.entries()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime))
    }

    return map
  }, [sessions, weekDays])

  // Session Mutations
  const createSession = async (payload: CreateClassSessionInput) => {
    try {
      const created = await classSessionService.create(payload)
      toast.success('Sesión programada', {
        description: `La clase fue agregada al cronograma exitosamente.`,
      })
      await loadSessions()
      setIsCreateOpen(false)
      return created
    } catch (err: any) {
      const msg = err?.message || 'No se pudo crear la sesión'
      toast.error('Error al crear sesión', { description: msg })
      throw err
    }
  }

  const updateSession = async (id: number, payload: UpdateClassSessionInput) => {
    try {
      const updated = await classSessionService.update(id, payload)
      toast.success('Sesión actualizada', {
        description: 'Los cambios fueron guardados correctamente.',
      })
      await loadSessions()
      setEditingSession(null)
      return updated
    } catch (err: any) {
      const msg = err?.message || 'No se pudo actualizar la sesión'
      toast.error('Error al actualizar', { description: msg })
      throw err
    }
  }

  const cancelSession = async (id: number) => {
    try {
      await classSessionService.update(id, { status: 'CANCELLED' })
      toast.info('Sesión cancelada', {
        description: 'La sesión se marcó como cancelada en el cronograma.',
      })
      await loadSessions()
      setEditingSession(null)
    } catch (err: any) {
      const msg = err?.message || 'No se pudo cancelar la sesión'
      toast.error('Error al cancelar', { description: msg })
      throw err
    }
  }

  const restoreSession = async (id: number) => {
    try {
      await classSessionService.update(id, { status: 'SCHEDULED' })
      toast.success('Sesión restaurada', {
        description: 'La sesión volvió a estar activa en el cronograma.',
      })
      await loadSessions()
      setEditingSession(null)
    } catch (err: any) {
      const msg = err?.message || 'No se pudo restaurar la sesión'
      toast.error('Error al restaurar', { description: msg })
      throw err
    }
  }

  const deleteSession = async (id: number) => {
    try {
      await classSessionService.delete(id)
      toast.success('Sesión eliminada', {
        description: 'La sesión fue eliminada del cronograma.',
      })
      await loadSessions()
      setEditingSession(null)
    } catch (err: any) {
      const msg = err?.message || 'No se pudo eliminar la sesión'
      toast.error('Error al eliminar', { description: msg })
      throw err
    }
  }

  const openCreateDialog = (dateString?: string) => {
    setCreateInitialDate(dateString ?? null)
    setIsCreateOpen(true)
  }

  return {
    currentWeekMonday,
    weekDays,
    weekRangeLabel,
    sessions,
    schedules,
    instructors,
    sessionsByDay,
    loading,
    error,
    editingSession,
    setEditingSession,
    isCreateOpen,
    setIsCreateOpen,
    createInitialDate,
    openCreateDialog,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    createSession,
    updateSession,
    cancelSession,
    restoreSession,
    deleteSession,
    refresh: loadSessions,
  }
}
