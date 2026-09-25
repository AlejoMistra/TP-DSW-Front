import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useWeeklySessions } from '../hooks/useWeeklySessions'
import { WeekNavigator } from './WeekNavigator'
import { WeeklyAgendaGrid } from './WeeklyAgendaGrid'
import { CreateSessionDialog } from './CreateSessionDialog'
import { Button } from '@/shared/components/ui/button'

export function WeeklyAgendaTab() {
  const {
    weekDays,
    weekRangeLabel,
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
    refresh,
  } = useWeeklySessions()

  return (
    <div className="flex flex-col gap-6">
      {/* Navigator: Title, week pill, today button, add session button */}
      <WeekNavigator
        weekRangeLabel={weekRangeLabel}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onToday={goToCurrentWeek}
        onAddSession={() => openCreateDialog()}
        isLoading={loading}
      />

      {/* Error state if backend is unreachable */}
      {error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs">
          <div className="flex items-center gap-2 text-destructive font-medium">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={refresh}
            className="h-7 text-xs border-destructive/40 hover:bg-destructive/15"
          >
            <RefreshCw className="mr-1 size-3" />
            Reintentar
          </Button>
        </div>
      )}

      {/* 6-Day Grid */}
      <WeeklyAgendaGrid
        weekDays={weekDays}
        sessionsByDay={sessionsByDay}
        schedules={schedules}
        instructors={instructors}
        editingSession={editingSession}
        loading={loading}
        onSelectSession={setEditingSession}
        onCloseEdit={() => setEditingSession(null)}
        onAddSessionForDay={openCreateDialog}
        onUpdateSession={updateSession}
        onCancelSession={cancelSession}
        onRestoreSession={restoreSession}
        onDeleteSession={deleteSession}
      />

      {/* Add Session Dialog */}
      <CreateSessionDialog
        open={isCreateOpen}
        initialDate={createInitialDate}
        schedules={schedules}
        instructors={instructors}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createSession}
      />
    </div>
  )
}

export default WeeklyAgendaTab
