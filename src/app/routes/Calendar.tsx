import { useState, useEffect, useRef } from 'react'
import { Plus, Calendar as CalendarIcon, Clock, Tag } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import { Task } from '@/app/db/schema'
import { cn } from '@/lib/utils'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'

export function Calendar() {
  const { setQuickAddOpen, quickAddOpen, calendarView, setCalendarView } = useUIStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const calendarRef = useRef<FullCalendar>(null)

  useEffect(() => {
    // TODO: Replace with actual data fetching
    const mockTasks: Task[] = [
      {
        id: '1',
        list_id: 'work',
        title: 'Review project proposal',
        description: 'Review the Q4 project proposal and provide feedback',
        priority: 2,
        status: 'todo',
        due_at: new Date().toISOString(),
        start_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        end_at: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // Tomorrow + 2 hours
        duration_min: 120,
        recurrence_rrule: null,
        estimate_pomos: 2,
        tags: ['work', 'review'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        list_id: 'personal',
        title: 'Buy groceries',
        description: 'Get milk, bread, eggs, and vegetables',
        priority: 4,
        status: 'todo',
        due_at: new Date().toISOString(),
        start_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Today + 2 hours
        end_at: new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // Today + 2.5 hours
        duration_min: 30,
        recurrence_rrule: null,
        estimate_pomos: 1,
        tags: ['personal', 'shopping'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        list_id: 'work',
        title: 'Team meeting',
        description: 'Weekly team standup meeting',
        priority: 3,
        status: 'in-progress',
        due_at: new Date().toISOString(),
        start_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // Today + 3 hours
        end_at: new Date(Date.now() + 3 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Today + 4 hours
        duration_min: 60,
        recurrence_rrule: 'FREQ=WEEKLY;BYDAY=MO',
        estimate_pomos: 1,
        tags: ['work', 'meeting'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        list_id: 'work',
        title: 'Code review',
        description: 'Review pull requests for the authentication feature',
        priority: 1,
        status: 'todo',
        due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        start_at: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // Tomorrow 8 AM
        end_at: new Date(Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(), // Tomorrow 10 AM
        duration_min: 120,
        recurrence_rrule: null,
        estimate_pomos: 4,
        tags: ['work', 'development', 'review'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    
    setTasks(mockTasks)
    setLoading(false)
  }, [])

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
        : task
    ))
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setEditorOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData }
          : task
      ))
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        list_id: 'inbox',
        title: taskData.title || 'New Task',
        description: taskData.description,
        priority: taskData.priority || 4,
        status: taskData.status || 'todo',
        due_at: taskData.due_at,
        start_at: taskData.start_at,
        end_at: taskData.end_at,
        duration_min: taskData.duration_min,
        recurrence_rrule: taskData.recurrence_rrule,
        estimate_pomos: taskData.estimate_pomos,
        tags: taskData.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setTasks(prev => [newTask, ...prev])
    }
    setEditorOpen(false)
    setSelectedTask(null)
  }

  const handleQuickAddSubmit = (parsedTask: any) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      list_id: 'inbox',
      title: parsedTask.title,
      description: parsedTask.description,
      priority: parsedTask.priority || 4,
      status: 'todo',
      due_at: parsedTask.startAt,
      start_at: parsedTask.startAt,
      end_at: parsedTask.endAt,
      duration_min: parsedTask.duration,
      recurrence_rrule: parsedTask.recurrence,
      estimate_pomos: null,
      tags: parsedTask.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
  }

  // Convert tasks to FullCalendar events
  const events: EventInput[] = tasks
    .filter(task => task.start_at)
    .map(task => ({
      id: task.id,
      title: task.title,
      start: task.start_at!,
      end: task.end_at || undefined,
      allDay: !task.start_at?.includes('T') || task.duration_min && task.duration_min >= 24 * 60,
      backgroundColor: getEventColor(task.priority),
      borderColor: getEventColor(task.priority),
      extendedProps: {
        task,
        priority: task.priority,
        status: task.status,
        tags: task.tags,
        description: task.description,
      },
    }))

  const getEventColor = (priority?: number) => {
    switch (priority) {
      case 1: return '#ef4444' // red
      case 2: return '#f97316' // orange
      case 3: return '#3b82f6' // blue
      case 4: return '#6b7280' // gray
      default: return '#6b7280'
    }
  }

  const handleEventClick = (clickInfo: any) => {
    const task = clickInfo.event.extendedProps.task as Task
    handleEditTask(task)
  }

  const handleDateSelect = (selectInfo: any) => {
    const newTask: Partial<Task> = {
      start_at: selectInfo.startStr,
      end_at: selectInfo.endStr,
      status: 'todo',
      priority: 4,
    }
    setSelectedTask(newTask as Task)
    setEditorOpen(true)
  }

  const handleEventDrop = (dropInfo: any) => {
    const taskId = dropInfo.event.id
    const newStart = dropInfo.event.start
    const newEnd = dropInfo.event.end

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            start_at: newStart.toISOString(),
            end_at: newEnd?.toISOString() || task.end_at
          }
        : task
    ))
  }

  const handleEventResize = (resizeInfo: any) => {
    const taskId = resizeInfo.event.id
    const newStart = resizeInfo.event.start
    const newEnd = resizeInfo.event.end

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            start_at: newStart.toISOString(),
            end_at: newEnd?.toISOString() || task.end_at
          }
        : task
    ))
  }

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
              { id: 'dayGridMonth', label: 'Month' },
              { id: 'timeGridWeek', label: 'Week' },
              { id: 'timeGridDay', label: 'Day' },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => {
                  setCalendarView(view.id as any)
                  calendarRef.current?.changeView(view.id)
                }}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors",
                  calendarView === view.id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
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
        <h3 className="text-sm font-medium text-foreground mb-3">Priority Legend</h3>
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
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView={calendarView === 'month' ? 'dayGridMonth' : calendarView === 'week' ? 'timeGridWeek' : 'timeGridDay'}
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
            meridiem: 'short'
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
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