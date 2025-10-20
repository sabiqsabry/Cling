import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { useDataStore } from '@/app/store/useData'
import { TaskCard } from '@/app/components/tasks/TaskCard'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import type { Task } from '@/lib/supabase'
import { formatDate } from '@/lib/date'

export function Today() {
  const { setQuickAddOpen, quickAddOpen } = useUIStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)

  // Use data from store instead of local state
  const { tasks, loading, createTask, updateTask, deleteTask } = useDataStore()

  // Filter tasks for today
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter((task) => {
    if (task.due_at) {
      return task.due_at.split('T')[0] === today
    }
    if (task.start_at) {
      return task.start_at.split('T')[0] === today
    }
    return false
  })

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading today's tasks...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Today</h1>
          <p className="text-muted-foreground mt-1">
            {formatDate(new Date())} • {todayTasks.length} tasks
          </p>
        </div>
        <button
          onClick={() => setQuickAddOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tasks List */}
      {todayTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No tasks for today</h3>
            <p className="text-sm">
              Add a task to get started or schedule something for today.
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
      ) : (
        <div className="space-y-4">
          {todayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => {
                setSelectedTask(task)
                setEditorOpen(true)
              }}
            />
          ))}
        </div>
      )}

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
