import { useState, useEffect } from 'react'
import { Plus, Filter, SortAsc } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { TaskCard } from '@/app/components/tasks/TaskCard'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import { Task } from '@/app/db/schema'
import { formatDate } from '@/lib/date'

export function Today() {
  const { setQuickAddOpen, quickAddOpen } = useUIStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual data fetching
    // For now, use mock data
    const mockTasks: Task[] = [
      {
        id: '1',
        list_id: 'inbox',
        title: 'Review project proposal',
        description: 'Review the Q4 project proposal and provide feedback',
        priority: 2,
        status: 'todo',
        due_at: new Date().toISOString(),
        start_at: null,
        end_at: null,
        duration_min: 60,
        recurrence_rrule: null,
        estimate_pomos: 2,
        tags: ['work', 'review'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        list_id: 'inbox',
        title: 'Buy groceries',
        description: 'Get milk, bread, eggs, and vegetables',
        priority: 4,
        status: 'todo',
        due_at: new Date().toISOString(),
        start_at: null,
        end_at: null,
        duration_min: 30,
        recurrence_rrule: null,
        estimate_pomos: 1,
        tags: ['personal', 'shopping'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        list_id: 'inbox',
        title: 'Call dentist',
        description: 'Schedule annual checkup',
        priority: 3,
        status: 'in-progress',
        due_at: new Date().toISOString(),
        start_at: null,
        end_at: null,
        duration_min: 15,
        recurrence_rrule: null,
        estimate_pomos: 1,
        tags: ['personal', 'health'],
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
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData }
          : task
      ))
    } else {
      // Create new task
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

  const todayTasks = tasks.filter(task => {
    if (!task.due_at) return false
    const taskDate = new Date(task.due_at)
    const today = new Date()
    return taskDate.toDateString() === today.toDateString()
  })

  const overdueTasks = tasks.filter(task => {
    if (!task.due_at || task.status === 'done') return false
    const taskDate = new Date(task.due_at)
    const today = new Date()
    return taskDate < today
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading today&apos;s tasks...</div>
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
            {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
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

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Overdue</h2>
          <div className="space-y-3">
            {overdueTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Today&apos;s Tasks ({todayTasks.length})
        </h2>
        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No tasks scheduled for today. Enjoy your day!
            </div>
          </div>
        )}
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