import { useState, useEffect } from 'react'
import { Plus, MoreVertical, PlusCircle } from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { TaskCard } from '@/app/components/tasks/TaskCard'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { TaskEditor } from '@/app/components/tasks/TaskEditor'
import { Task } from '@/app/db/schema'
import { cn } from '@/lib/utils'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Column {
  id: string
  title: string
  status: string
  color: string
  tasks: Task[]
}

interface SortableTaskCardProps {
  task: Task
  onToggleComplete: (taskId: string) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

function SortableTaskCard({ task, onToggleComplete, onEdit, onDelete }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none",
        isDragging && "opacity-50"
      )}
    >
      <TaskCard
        task={task}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}

export function Kanban() {
  const { setQuickAddOpen, quickAddOpen } = useUIStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns: Column[] = [
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      color: 'bg-gray-100',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      color: 'bg-blue-100',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    {
      id: 'done',
      title: 'Done',
      status: 'done',
      color: 'bg-green-100',
      tasks: tasks.filter(task => task.status === 'done')
    }
  ]

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
        status: 'in-progress',
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
        status: 'todo',
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as string

    // Don't update if the task is already in the same column
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status === newStatus) return

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus as Task['status'] }
        : task
    ))
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
            Visual task organization with drag-and-drop
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
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-card rounded-lg border border-border">
              {/* Column Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className={cn("w-3 h-3 rounded-full", column.color)} />
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-3 min-h-[400px]">
                <SortableContext
                  items={column.tasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {column.tasks.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </SortableContext>

                {/* Add Task Button */}
                <button
                  onClick={() => setQuickAddOpen(true)}
                  className="w-full p-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <PlusCircle className="h-4 w-4 mx-auto mb-1" />
                  <span className="text-sm">Add Task</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90">
              <TaskCard
                task={activeTask}
                onToggleComplete={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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