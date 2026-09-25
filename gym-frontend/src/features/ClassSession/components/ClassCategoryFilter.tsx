import { Button } from '@/shared/components/ui/button'
import { type ClassCategory, getCategoryLabel } from '../models/ClassSession'

interface ClassCategoryFilterProps {
  categories: ClassCategory[]
  activeCategory: ClassCategory
  onSelectCategory: (category: ClassCategory) => void
}

export function ClassCategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: ClassCategoryFilterProps) {
  if (categories.length === 0) return null

  return (
    <section className="mt-4 px-4 md:px-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Categoría
        </span>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          const label = cat === 'Todos' ? 'Todas' : getCategoryLabel(cat)

          return (
            <Button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 h-8 px-4 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer ${isActive
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs shadow-primary/20 border-primary'
                : 'bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                }`}
              variant="ghost"
            >
              {label}
            </Button>
          )
        })}
      </div>
    </section>
  )
}

export default ClassCategoryFilter
