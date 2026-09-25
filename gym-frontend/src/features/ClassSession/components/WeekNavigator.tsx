import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface WeekNavigatorProps {
  weekRangeLabel: string
  onPreviousWeek: () => void
  onNextWeek: () => void
  onToday: () => void
  onAddSession: () => void
  isLoading?: boolean
}

export function WeekNavigator({
  weekRangeLabel,
  onPreviousWeek,
  onNextWeek,
  onToday,
  onAddSession,
  isLoading,
}: WeekNavigatorProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Week Range Pill */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Horario de la Semana
        </h2>

        {/* Week Switcher Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs sm:text-sm font-medium text-foreground backdrop-blur-xs">
          <button
            type="button"
            onClick={onPreviousWeek}
            disabled={isLoading}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-50"
            title="Semana anterior"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          <span className="px-1 text-sm font-semibold tracking-wide text-foreground">
            {weekRangeLabel}
          </span>

          <button
            type="button"
            onClick={onNextWeek}
            disabled={isLoading}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-50"
            title="Semana siguiente"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="h-7 text-sm text-muted-foreground hover:text-foreground"
        >
          <Calendar className="mr-1 size-3" />
          Hoy
        </Button>
      </div>

      {/* Action Button */}
      <Button
        onClick={onAddSession}
        className="w-full md:w-auto md:px-5"
      >
        <Plus className="size-4" />
        Agregar Sesión
      </Button>
    </div>
  )
}

export default WeekNavigator
