import { useState, useEffect, useCallback } from 'react'
import { classBookingService, type ClassBooking } from '../api/classBookingService'
import { classSessionService } from '../api/classSessionService'
import { classScheduleService } from '@/features/classSchedule/api/classScheduleService'
import type { ClassSchedule } from '@/features/classSchedule/models/ClassSchedule'
import { instructorService } from '@/features/instructors/api/instructorService'
import type { Instructor } from '@/features/instructors/models/Instructor'
import type { MemberClassSession } from '../models/ClassSession'
import { parseDateString, toLocalDateString } from '../lib/dateUtils'

export interface UpcomingBookedClass extends MemberClassSession {
  bookingId: number
  isToday: boolean
  formattedDate: string
}

export function useMemberUpcomingBookings(memberId: number | null) {
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingBookedClass[]>([])
  const [loading, setLoading] = useState(memberId !== null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refresh = useCallback(() => {
    setReloadKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!memberId) {
      return
    }

    let cancelled = false

    const fetchUpcoming = async () => {
      try {
        setLoading(true)
        setError(null)

        const [bookings, sessions, schedules, instructors] = await Promise.all([
          classBookingService.getAll().catch(() => [] as ClassBooking[]),
          classSessionService.getAll().catch(() => []),
          classScheduleService.getAll().catch(() => [] as ClassSchedule[]),
          instructorService.getAll().catch(() => [] as Instructor[]),
        ])

        if (cancelled) return

        const scheduleMap = new Map(schedules.map((s) => [String(s.id), s]))
        const instructorMap = new Map(instructors.map((i) => [String(i.id), i]))

        const todayStr = toLocalDateString(new Date())

        // Filter confirmed bookings for this member
        const memberBookings = bookings.filter(
          (b) => b.memberId === memberId && b.status === 'CONFIRMED' && !b.deletedAt
        )

        const bookedSessions: UpcomingBookedClass[] = []

        for (const booking of memberBookings) {
          const session = sessions.find(
            (s) => s.id === booking.classSessionId && s.status !== 'CANCELLED' && !s.deletedAt
          )
          if (!session) continue

          const sessionDateObj =
            typeof session.date === 'string' ? parseDateString(session.date) : session.date
          const sessionDateStr = toLocalDateString(sessionDateObj)

          // Only include classes from today onwards
          if (sessionDateStr >= todayStr) {
            const sched =
              session.classSchedule ?? scheduleMap.get(String(session.classScheduleId))
            const inst =
              session.instructor ??
              (session.instructorId ? instructorMap.get(String(session.instructorId)) : null)

            const isToday = sessionDateStr === todayStr

            // Formatted short date (e.g., "15 Oct")
            const months = [
              'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
              'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
            ]
            const formattedDate = `${sessionDateObj.getDate()} ${months[sessionDateObj.getMonth()]}`

            bookedSessions.push({
              ...session,
              classSchedule: sched,
              instructor: inst,
              isReserved: true,
              userBookingId: booking.id,
              bookingId: booking.id,
              isToday,
              formattedDate,
            })
          }
        }

        // Sort chronologically: by date ascending, then startTime ascending
        bookedSessions.sort((a, b) => {
          const dateA = toLocalDateString(
            typeof a.date === 'string' ? parseDateString(a.date) : a.date
          )
          const dateB = toLocalDateString(
            typeof b.date === 'string' ? parseDateString(b.date) : b.date
          )
          if (dateA !== dateB) return dateA.localeCompare(dateB)
          return (a.startTime || '').localeCompare(b.startTime || '')
        })

        if (!cancelled) {
          setUpcomingClasses(bookedSessions)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Error al obtener tus próximas clases'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void fetchUpcoming()

    return () => {
      cancelled = true
    }
  }, [memberId, reloadKey])

  return {
    upcomingClasses,
    loading,
    error,
    refresh,
  }
}
