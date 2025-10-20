import { useState, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { useDataStore } from '@/app/store/useData'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import type { Task } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'

export function Calendar() {
  const { setQuickAddOpen, quickAddOpen, calendarView, setCalendarView } =
    useUIStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const calendarRef = useRef<FullCalendar>(null)

  // Use data from store instead of local state
  const { tasks, loading, createTask, updateTask, deleteTask } = useDataStore()

  // Convert calendar view names to FullCalendar view names
  const getFullCalendarView = (view: string) => {
    switch (view) {
      case 'month':
        return 'dayGridMonth'
      case 'week':
        return 'timeGridWeek'
      case 'day':
        return 'timeGridDay'
      default:
        return 'dayGridMonth'
    }
  }

  const getEventColor = (priority: number) => {
    switch (priority) {
      case 1:
        return '#ef4444' // Red
      case 2:
        return '#f97316' // Orange
      case 3:
        return '#3b82f6' // Blue
      case 4:
        return '#6b7280' // Gray
      default:
        return '#6b7280'
    }
  }

  const handleEventClick = (clickInfo: any) => {
    const task = tasks.find((t) => t.id === clickInfo.event.id)
    if (task) {
      setSelectedTask(task)
      setEditorOpen(true)
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    const start = selectInfo.start
    const end = selectInfo.end

    // Create a new task for the selected time slot
    const newTask: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> =
      {
        list_id: null,
        title: 'New Task',
        description: '',
        status: 'todo',
        priority: 4,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        completed_at: null,
        position: 0,
      }

    createTask(newTask)
    setQuickAddOpen(true)
  }

  const handleEventDrop = (dropInfo: any) => {
    const taskId = dropInfo.event.id
    const newStart = dropInfo.event.start
    const newEnd = dropInfo.event.end

    updateTask(taskId, {
      start_at: newStart.toISOString(),
      end_at: newEnd?.toISOString() || null,
    })
  }

  const handleEventResize = (resizeInfo: any) => {
    const taskId = resizeInfo.event.id
    const newStart = resizeInfo.event.start
    const newEnd = resizeInfo.event.end

    updateTask(taskId, {
      start_at: newStart.toISOString(),
      end_at: newEnd?.toISOString() || null,
    })
  }

  const handleSaveTask = (taskData: any) => {
    if (selectedTask) {
      updateTask(selectedTask.id, {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        start_at: taskData.start_at,
        end_at: taskData.end_at,
      })
    } else {
      createTask({
        list_id: taskData.list_id || null,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'todo',
        priority: taskData.priority || 4,
        start_at: taskData.start_at,
        end_at: taskData.end_at,
        completed_at: null,
        position: 0,
      })
    }
    setEditorOpen(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    setEditorOpen(false)
    setSelectedTask(null)
  }

  const handleQuickAddSubmit = (parsedTask: any) => {
    createTask({
      list_id: null,
      title: parsedTask.title,
      description: parsedTask.description || '',
      status: 'todo',
      priority: parsedTask.priority || 4,
      start_at: parsedTask.startAt,
      end_at: parsedTask.endAt,
      completed_at: null,
      position: 0,
    })
  }

  // Convert tasks to FullCalendar events
  const events: EventInput[] = tasks
    .filter((task) => task.start_at)
    .map((task) => ({
      id: task.id,
      title: task.title,
      start: task.start_at!,
      end: task.end_at || undefined,
      allDay:
        !task.start_at?.includes('T') ||
        (task.end_at &&
          new Date(task.end_at).getTime() - new Date(task.start_at).getTime() >=
            24 * 60 * 60 * 1000),
      backgroundColor: getEventColor(task.priority),
      borderColor: getEventColor(task.priority),
      extendedProps: {
        task,
        priority: task.priority,
        status: task.status,
        description: task.description,
      },
    }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage your tasks with time blocking
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {[
              { id: 'month', label: 'Month' },
              { id: 'week', label: 'Week' },
              { id: 'day', label: 'Day' },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => {
                  setCalendarView(view.id as any)
                  calendarRef.current?.changeView(getFullCalendarView(view.id))
                }}
                className={cn(
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  calendarView === view.id
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {view.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Priority Legend
        </h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">P1 - Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-muted-foreground">P2 - High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">P3 - Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm text-muted-foreground">P4 - Low</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView={getFullCalendarView(calendarView)}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          height="auto"
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
          nowIndicator={true}
          scrollTime="08:00:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '09:00',
            endTime: '17:00',
          }}
        />
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
      />

      <TaskEditor
        task={selectedTask}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false)
          setSelectedTask(null)
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}
