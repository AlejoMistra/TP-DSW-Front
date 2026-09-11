/**
 * Date utilities for the Weekly Agenda (Lunes a Sábado)
 */

export interface WeekDay {
  date: Date
  dateString: string // YYYY-MM-DD
  dayName: string // Lunes, Martes, etc.
  dayNumber: number // 17, 18, etc.
  isToday: boolean
}

const SPANISH_DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

const SPANISH_MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateString(dateStr: string): Date {
  // If it's an ISO string like 2026-10-17T00:00:00.000Z, extract YYYY-MM-DD to avoid timezone shifts
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, y, m, d] = match
    return new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0)
  }
  return new Date(dateStr)
}

/**
 * Returns the Monday of the week containing the given date.
 */
export function getMondayOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay() // 0 = Domingo, 1 = Lunes, ...
  const diff = day === 0 ? -6 : 1 - day // lunes es 1
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Returns the 6 operational days of the week (Lunes a Sábado).
 */
export function getWeekDays(monday: Date): WeekDay[] {
  const todayStr = toLocalDateString(new Date())
  const days: WeekDay[] = []

  for (let i = 0; i < 6; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = toLocalDateString(d)

    days.push({
      date: d,
      dateString: dateStr,
      dayName: SPANISH_DAY_NAMES[d.getDay()],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
    })
  }

  return days
}

/**
 * Formats a range like "17 - 22 Octubre" or "28 Sep - 3 Octubre"
 */
export function formatWeekRange(monday: Date): string {
  const saturday = new Date(monday)
  saturday.setDate(monday.getDate() + 5)

  const startDay = monday.getDate()
  const endDay = saturday.getDate()

  const startMonth = SPANISH_MONTHS[monday.getMonth()]
  const endMonth = SPANISH_MONTHS[saturday.getMonth()]

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}`
  }

  return `${startDay} ${startMonth.slice(0, 3)} - ${endDay} ${endMonth}`
}

/**
 * Shift week by +/- offset weeks
 */
export function shiftWeek(monday: Date, weekOffset: number): Date {
  const d = new Date(monday)
  d.setDate(monday.getDate() + weekOffset * 7)
  return d
}

/**
 * Calculate end time (HH:mm) given start time and duration in minutes
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  if (!startTime) return ''
  const [hStr, mStr] = startTime.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (isNaN(h) || isNaN(m)) return ''

  const totalMinutes = h * 60 + m + durationMinutes
  const endH = Math.floor(totalMinutes / 60) % 24
  const endM = totalMinutes % 60

  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}
