import ClassDateSelector from '@/features/ClassSession/components/ClassDateSelector'
import ClassCategoryFilter from '@/features/ClassSession/components/ClassCategoryFilter'
import ClassSessionCard from '@/features/ClassSession/components/ClassSessionCard'
import { useMemberClasses } from '@/features/ClassSession/hooks/useMemberClasses'
import { usePageTitle } from '@/shared/context/PageHeaderContext'

export default function ClassesPage() {
  usePageTitle("Horario de Clases")
  const {
    dates,
    categories,
    activeCategory,
    setActiveCategory,
    selectedDate,
    setSelectedDate,
    classes,
    handleToggleReservation,
  } = useMemberClasses()

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-4">
        <ClassDateSelector
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <ClassCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <main className="mt-8 px-4 md:px-8">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {classes.map((cls) => (
              <ClassSessionCard
                key={cls.id}
                cls={cls}
                onToggleReservation={handleToggleReservation}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}