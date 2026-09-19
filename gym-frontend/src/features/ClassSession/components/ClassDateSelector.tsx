import { Button } from '@/shared/components/ui/button'
import type { ClassDateOption } from '../models/ClassSession'

interface ClassDateSelectorProps {
  dates: ClassDateOption[]
  selectedDate: string
  onSelectDate: (fullDate: string) => void
}

export function ClassDateSelector({
  dates,
  selectedDate,
  onSelectDate,
}: ClassDateSelectorProps) {
  return (
    <section className="mt-4 px-4 md:px-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Seleccioná un día
        </span>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-2 px-1 py-1 scroll-smooth">
        {dates.map((d) => {
          const isActive = selectedDate === d.fullDate

          return (
            <Button
              key={d.fullDate}
              onClick={() => onSelectDate(d.fullDate)}
              className={`relative shrink-0 flex flex-col items-center justify-center min-w-17.5 h-21 rounded-2xl border cursor-pointer transition-all ${isActive
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-xs shadow-primary/20'
                : 'bg-card/80 hover:bg-muted text-muted-foreground  hover:text-foreground shadow-xs hover:shadow-md border-border/70'
                }`}
              variant="ghost"
            >
              <span
                className={`text-sm font-bold tracking-wider uppercase mb-0.5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
              >
                {d.isToday ? 'Hoy' : d.day}
              </span>

              <span
                className={`text-2xl font-black leading-none my-0.5 ${isActive ? 'text-primary-foreground' : 'text-foreground'
                  }`}
              >
                {d.date}
              </span>

              <span
                className={`text-sm font-medium ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground/80'
                  }`}
              >
                {d.month}
              </span>
            </Button>
          )
        })}
      </div>
    </section>
  )
}

export default ClassDateSelector
