import { useState, useEffect } from 'react'
import { Plus, Filter, SortAsc, Grid, List as ListIcon } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { TaskCard } from '@/app/components/tasks/TaskCard'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import { Task } from '@/app/db/schema'
import { cn } from '@/lib/utils'

export function List() {
  const { setQuickAddOpen, quickAddOpen, listGroupBy, setListGroupBy, listSortBy, setListSortBy } = useUIStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

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
        list_id: 'personal',
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
        list_id: 'work',
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
      {
        id: '4',
        list_id: 'work',
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        priority: 1,
        status: 'done',
        due_at: new Date().toISOString(),
        start_at: null,
        end_at: null,
        duration_min: 120,
        recurrence_rrule: null,
        estimate_pomos: 4,
        tags: ['work', 'development', 'auth'],
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

  // Group tasks based on current grouping setting
  const groupedTasks = () => {
    const groups: Record<string, Task[]> = {}
    
    tasks.forEach(task => {
      let groupKey = ''
      
      switch (listGroupBy) {
        case 'priority':
          groupKey = `P${task.priority || 4}`
          break
        case 'status':
          groupKey = task.status === 'done' ? 'Done' : 
                    task.status === 'in-progress' ? 'In Progress' : 'To Do'
          break
        case 'date':
          if (task.due_at) {
            const date = new Date(task.due_at)
            groupKey = date.toDateString()
          } else {
            groupKey = 'No Date'
          }
          break
        case 'list':
          groupKey = task.list_id
          break
        default:
          groupKey = 'All Tasks'
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(task)
    })
    
    return groups
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  const groups = groupedTasks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {tasks.length} tasks total
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'list' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'grid' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid className="h-4 w-4" />
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

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Group By */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Group by:</span>
            <select
              value={listGroupBy}
              onChange={(e) => setListGroupBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="none">None</option>
              <option value="list">List</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="date">Due Date</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={listSortBy}
              onChange={(e) => setListSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="title">Title</option>
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Groups */}
      {Object.keys(groups).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groups).map(([groupName, groupTasks]) => (
            <div key={groupName}>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {groupName} ({groupTasks.length})
              </h2>
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {groupTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    compact={viewMode === 'grid'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No tasks found. Create your first task to get started!
          </div>
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