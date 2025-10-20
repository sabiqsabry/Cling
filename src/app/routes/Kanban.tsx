import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { useDataStore } from '@/app/store/useData'
import { TaskCard } from '@/app/components/tasks/TaskCard'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import type { Task } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function Kanban() {
  const { setQuickAddOpen, quickAddOpen } = useUIStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)

  // Use data from store instead of local state
  const { tasks, loading, createTask, updateTask, deleteTask } = useDataStore()

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' as const },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' as const },
    { id: 'done', title: 'Done', status: 'done' as const },
  ]

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

  const handleTaskMove = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus as any })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading kanban board...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Drag tasks between columns to update their status
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

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status
          )

          return (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {column.title}
                </h2>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 min-h-[400px]">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">
                      No tasks in {column.title.toLowerCase()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedTask(task)
                          setEditorOpen(true)
                        }}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
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
