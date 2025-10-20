import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { useDataStore } from '@/app/store/useData'
import { TaskCard } from '@/app/components/tasks/TaskCard'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import type { Task, List } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function List() {
  const { setQuickAddOpen, quickAddOpen } = useUIStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)

  // Use data from store instead of local state
  const { tasks, lists, loading, createTask, updateTask, deleteTask } =
    useDataStore()

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
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {tasks.length} tasks across {lists.length} lists
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

      {/* Tasks by List */}
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No lists yet</h3>
            <p className="text-sm">Create a list to organize your tasks.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {lists.map((list) => {
            const listTasks = tasks.filter((task) => task.list_id === list.id)

            return (
              <div key={list.id} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: list.color }}
                  />
                  <h2 className="text-xl font-semibold text-foreground">
                    {list.name}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {listTasks.length} tasks
                  </span>
                </div>

                {listTasks.length === 0 ? (
                  <div className="bg-muted/30 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                      No tasks in this list yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listTasks.map((task) => (
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
              </div>
            )
          })}
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
