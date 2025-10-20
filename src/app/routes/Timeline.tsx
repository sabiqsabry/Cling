import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { useDataStore } from '@/app/store/useData'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import type { Task } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function Timeline() {
  const { setQuickAddOpen, quickAddOpen } = useUIStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Use data from store instead of local state
  const { tasks, loading, createTask, updateTask, deleteTask } = useDataStore()

  const handleSaveTask = useCallback(
    (taskData: any) => {
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
    },
    [selectedTask, updateTask, createTask]
  )

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
            Visual timeline view of your tasks and deadlines
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Zoom in functionality
                console.log('Zoom in')
              }}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                // Zoom out functionality
                console.log('Zoom out')
              }}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                // Reset zoom functionality
                console.log('Reset zoom')
              }}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
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

      {/* Timeline */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div ref={timelineRef} className="h-96 p-4">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-muted-foreground mb-4">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No tasks with dates
                  </h3>
                  <p className="text-sm">
                    Add tasks with start dates to see them on the timeline.
                  </p>
                </div>
                <button
                  onClick={() => setQuickAddOpen(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Task</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks
                .filter((task) => task.start_at)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedTask(task)
                      setEditorOpen(true)
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getEventColor(task.priority) }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {task.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {task.start_at &&
                          new Date(task.start_at).toLocaleDateString()}
                        {task.end_at &&
                          ` - ${new Date(task.end_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
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
