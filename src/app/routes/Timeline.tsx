import { useState, useEffect, useRef } from 'react'
import {
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  Clock,
  Tag,
} from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import { Task } from '@/app/db/schema'
import { cn } from '@/lib/utils'
import { Timeline as VisTimeline } from 'vis-timeline/standalone'
import { DataSet } from 'vis-data/standalone'

interface TimelineItem {
  id: string
  content: string
  start: Date
  end?: Date
  group?: string
  className?: string
  style?: string
  title?: string
  editable?: boolean
}

interface TimelineGroup {
  id: string
  content: string
  className?: string
}

export function Timeline() {
  const { setQuickAddOpen, quickAddOpen } = useUIStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeline, setTimeline] = useState<VisTimeline | null>(null)
  const [currentZoom, setCurrentZoom] = useState('day')
  const timelineRef = useRef<HTMLDivElement>(null)

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
        end_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
        ).toISOString(), // Tomorrow + 2 hours
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
        end_at: new Date(
          Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000
        ).toISOString(), // Today + 2.5 hours
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
        end_at: new Date(
          Date.now() + 3 * 60 * 60 * 1000 + 60 * 60 * 1000
        ).toISOString(), // Today + 4 hours
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
        start_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
        ).toISOString(), // Tomorrow 8 AM
        end_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000
        ).toISOString(), // Tomorrow 10 AM
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

  useEffect(() => {
    if (timelineRef.current && tasks.length > 0) {
      // Create groups for different lists
      const groups = new DataSet<TimelineGroup>([
        { id: 'work', content: 'Work Tasks', className: 'work-group' },
        {
          id: 'personal',
          content: 'Personal Tasks',
          className: 'personal-group',
        },
        { id: 'inbox', content: 'Inbox', className: 'inbox-group' },
      ])

      // Convert tasks to timeline items
      const items = new DataSet<TimelineItem>(
        tasks
          .filter((task) => task.start_at)
          .map((task) => ({
            id: task.id,
            content: `<div class="timeline-item">
              <div class="task-title">${task.title}</div>
              <div class="task-meta">
                <span class="priority p${task.priority || 4}">P${task.priority || 4}</span>
                ${task.tags?.map((tag) => `<span class="tag">${tag}</span>`).join('') || ''}
              </div>
            </div>`,
            start: new Date(task.start_at!),
            end: task.end_at ? new Date(task.end_at) : undefined,
            group: task.list_id,
            className: `timeline-task priority-${task.priority || 4} status-${task.status}`,
            title: `${task.title}\n${task.description || ''}\nPriority: P${task.priority || 4}`,
            editable: true,
          }))
      )

      // Create timeline
      const timelineInstance = new VisTimeline(
        timelineRef.current,
        items,
        groups,
        {
          editable: {
            add: true,
            updateTime: true,
            updateGroup: true,
            remove: true,
          },
          selectable: true,
          multiselect: true,
          orientation: 'top',
          stack: true,
          showCurrentTime: true,
          zoomMin: 1000 * 60 * 60, // 1 hour
          zoomMax: 1000 * 60 * 60 * 24 * 365, // 1 year
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        }
      )

      // Event handlers
      timelineInstance.on('select', (properties) => {
        if (properties.items.length > 0) {
          const taskId = properties.items[0]
          const task = tasks.find((t) => t.id === taskId)
          if (task) {
            handleEditTask(task)
          }
        }
      })

      timelineInstance.on('itemUpdate', (item, callback) => {
        const taskId = item.id
        const newStart = new Date(item.start)
        const newEnd = item.end ? new Date(item.end) : undefined

        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  start_at: newStart.toISOString(),
                  end_at: newEnd?.toISOString() || task.end_at,
                }
              : task
          )
        )

        callback(item)
      })

      timelineInstance.on('itemAdd', (item, callback) => {
        // Handle new item creation
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          list_id: item.group || 'inbox',
          title: 'New Task',
          description: '',
          priority: 4,
          status: 'todo',
          start_at: new Date(item.start).toISOString(),
          end_at: item.end ? new Date(item.end).toISOString() : undefined,
          duration_min: item.end
            ? Math.round(
                (new Date(item.end).getTime() -
                  new Date(item.start).getTime()) /
                  (1000 * 60)
              )
            : undefined,
          recurrence_rrule: null,
          estimate_pomos: null,
          tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setTasks((prev) => [newTask, ...prev])
        callback(item)
      })

      setTimeline(timelineInstance)

      return () => {
        timelineInstance.destroy()
      }
    }
  }, [tasks])

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task
      )
    )
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setEditorOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id ? { ...task, ...taskData } : task
        )
      )
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
      setTasks((prev) => [newTask, ...prev])
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
    setTasks((prev) => [newTask, ...prev])
  }

  const handleZoomIn = () => {
    if (timeline) {
      timeline.zoomIn(0.5)
    }
  }

  const handleZoomOut = () => {
    if (timeline) {
      timeline.zoomOut(0.5)
    }
  }

  const handleFit = () => {
    if (timeline) {
      timeline.fit()
    }
  }

  const handleZoomToDay = () => {
    if (timeline) {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timeline.setWindow(start, end)
      setCurrentZoom('day')
    }
  }

  const handleZoomToWeek = () => {
    if (timeline) {
      const now = new Date()
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      timeline.setWindow(start, end)
      setCurrentZoom('week')
    }
  }

  const handleZoomToMonth = () => {
    if (timeline) {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      timeline.setWindow(start, end)
      setCurrentZoom('month')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading timeline...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
          <p className="text-muted-foreground mt-1">
            Gantt-style task visualization with drag-and-drop scheduling
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomIn}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleFit}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Fit to Content"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Zoom */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {[
              { id: 'day', label: 'Day' },
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
            ].map((zoom) => (
              <button
                key={zoom.id}
                onClick={() => {
                  if (zoom.id === 'day') handleZoomToDay()
                  else if (zoom.id === 'week') handleZoomToWeek()
                  else handleZoomToMonth()
                }}
                className={cn(
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  currentZoom === zoom.id
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {zoom.label}
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
        <h3 className="text-sm font-medium text-foreground mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-sm text-muted-foreground">P1 - Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-sm text-muted-foreground">P2 - High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-sm text-muted-foreground">P3 - Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gray-500" />
            <span className="text-sm text-muted-foreground">P4 - Low</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div ref={timelineRef} className="w-full" style={{ height: '600px' }} />
      </div>

      {/* Instructions */}
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium text-foreground mb-2">
          Timeline Controls
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• Drag tasks to reschedule them</div>
          <div>• Resize tasks by dragging their edges</div>
          <div>• Click on tasks to edit them</div>
          <div>• Use zoom controls to change the time scale</div>
          <div>• Scroll horizontally to navigate through time</div>
        </div>
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

      <style>{`
        .timeline-item {
          padding: 4px 8px;
          border-radius: 4px;
        }

        .task-title {
          font-weight: 500;
          font-size: 12px;
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .priority {
          font-size: 10px;
          padding: 1px 4px;
          border-radius: 2px;
          font-weight: 500;
        }

        .priority.p1 {
          background: #ef4444;
          color: white;
        }
        .priority.p2 {
          background: #f97316;
          color: white;
        }
        .priority.p3 {
          background: #3b82f6;
          color: white;
        }
        .priority.p4 {
          background: #6b7280;
          color: white;
        }

        .tag {
          font-size: 9px;
          padding: 1px 3px;
          background: #e5e7eb;
          color: #374151;
          border-radius: 2px;
        }

        .work-group {
          background: #dbeafe;
          color: #1e40af;
        }

        .personal-group {
          background: #dcfce7;
          color: #166534;
        }

        .inbox-group {
          background: #f3f4f6;
          color: #374151;
        }
      `}</style>
    </div>
  )
}
