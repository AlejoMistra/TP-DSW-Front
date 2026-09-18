import { Calendar, UserCheck } from 'lucide-react'
import ClassDateSelector from '@/features/ClassSession/components/ClassDateSelector'
import ClassCategoryFilter from '@/features/ClassSession/components/ClassCategoryFilter'
import ClassSessionCard from '@/features/ClassSession/components/ClassSessionCard'
import { useMemberClasses } from '@/features/ClassSession/hooks/useMemberClasses'
import { Button } from '@/shared/components/ui/button'

export default function ClassesPage() {
  const {
    dates,
    categories,
    activeCategory,
    setActiveCategory,
    selectedDate,
    setSelectedDate,
    classes,
    loading,
    currentMember,
    selectedDayTotalSessions,
    actionLoadingId,
    handleToggleReservation,
  } = useMemberClasses()

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="px-4 pt-6 pb-2 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Reserva de Clases
              </h1>
              <p className="text-md text-muted-foreground mt-1">
                Encontrá tu próximo entrenamiento y reservá tu lugar en segundos.
              </p>
            </div>

            {currentMember && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs text-xs">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Socio logueado (temporal hasta implementar login)
                  </p>
                  <p className="font-semibold text-foreground">
                    {currentMember.name} {currentMember.surname}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Date Selector */}
        <ClassDateSelector
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Category Filters */}
        <ClassCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Main Content Area */}
        <main className="mt-6 px-4 md:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/70 bg-card/80 p-5 space-y-4 animate-pulse"
                >
                  <div className="flex justify-between items-start">
                    <div className="h-5 w-20 bg-muted rounded-md" />
                    <div className="h-7 w-16 bg-muted rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-muted rounded-md" />
                    <div className="h-4 w-full bg-muted/60 rounded-md" />
                  </div>
                  <div className="h-px bg-border/40 my-2" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-24 bg-muted rounded-md" />
                    <div className="h-8 w-20 bg-muted rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : classes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {classes.map((cls) => (
                <ClassSessionCard
                  key={cls.id}
                  cls={cls}
                  onToggleReservation={handleToggleReservation}
                  isSubmitting={actionLoadingId === cls.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center my-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
                {selectedDayTotalSessions > 0 ? (
                  <Calendar className="size-7" />
                ) : (
                  <Calendar className="size-7" />
                )}
              </div>

              {selectedDayTotalSessions > 0 ? (
                <>
                  <h3 className="text-lg font-bold text-foreground">
                    Sin clases de {activeCategory} para este día
                  </h3>
                  <p className="text-md text-muted-foreground mt-1 max-w-md">
                    Hay otras clases disponibles en el día seleccionado. Cambiá el filtro para verlas todas.
                  </p>
                  <Button
                    onClick={() => setActiveCategory('Todos')}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Ver todas las categorías
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-foreground">
                    No hay sesiones programadas para este día
                  </h3>
                  <p className="text-md text-muted-foreground mt-1 max-w-md">
                    No encontramos clases fijadas para la fecha seleccionada. Probá eligiendo otro día en el selector superior.
                  </p>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}