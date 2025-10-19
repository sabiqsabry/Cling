import { useState, useEffect } from 'react'
import { Plus, CheckCircle, Circle, Clock, Calendar, X, Maximize2 } from 'lucide-react'
import { Task } from '@/app/db/schema'
import { QuickAddModal } from '@/app/components/tasks/QuickAddModal'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date'

interface TrayMiniProps {
  onClose: () => void
  onMaximize: () => void
}

export function TrayMini({ onClose, onMaximize }: TrayMiniProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual data fetching
    const mockTasks: Task[] = [
      {
        id: '1',
        list_id: 'work',
        title: 'Review project proposal',
        description: 'Review the Q4 project proposal',
        priority: 2,
        status: 'todo',
        due_at: new Date().toISOString(),
        start_at: null,
        end_at: null,
        duration_min: 60,
        recurrence_rrule: null,
        estimate_pomos: 2,
        tags: ['work'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        list_id: 'personal',
        title: 'Buy groceries',
        description: 'Get milk, bread, eggs',
        priority: 4,
        status: 'todo',
        due_at: new Date().toISOString(),
        start_at: null,
        end_at: null,
        duration_min: 30,
        recurrence_rrule: null,
        estimate_pomos: 1,
        tags: ['personal'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        list_id: 'work',
        title: 'Team meeting',
        description: 'Weekly standup',
        priority: 3,
        status: 'in-progress',
        due_at: new Date().toISOString(),
        start_at: null,
        end_at: null,
        duration_min: 60,
        recurrence_rrule: null,
        estimate_pomos: 1,
        tags: ['work', 'meeting'],
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

  const completedToday = todayTasks.filter(task => task.status === 'done').length
  const totalToday = todayTasks.length
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')

  if (loading) {
    return (
      <div className="w-72 h-80 bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-72 h-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <h2 className="text-sm font-semibold text-foreground">Cling</h2>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onMaximize}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Maximize"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Close"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-3 border-b border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{completedToday}</div>
              <div className="text-xs text-muted-foreground">Done Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{inProgressTasks.length}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
          </div>
        </div>

        {/* Quick Add */}
        <div className="p-3 border-b border-border">
          <button
            onClick={() => setQuickAddOpen(true)}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Recent Tasks */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className-flex items-center space-x-2 mb-3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Recent Tasks</h3>
          </div>
          
          <div className="space-y-2">
            {todayTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer",
                  task.status === 'done' && "opacity-60"
                )}
                onClick={() => handleToggleComplete(task.id)}
              >
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  {task.status === 'done' ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-xs font-medium truncate",
                    task.status === 'done' && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {task.priority && (
                    <div className={cn(
                      "text-xs px-1 py-0.5 rounded-full font-medium",
                      task.priority === 1 && "bg-red-100 text-red-700",
                      task.priority === 2 && "bg-orange-100 text-orange-700",
                      task.priority === 3 && "bg-blue-100 text-blue-700",
                      task.priority === 4 && "bg-gray-100 text-gray-700"
                    )}>
                      P{task.priority}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {todayTasks.length === 0 && (
            <div className="text-center py-4">
              <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">No tasks today</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(new Date(), 'h:mm a')}</span>
            </div>
            <div>
              {totalToday > 0 && (
                <span className="text-green-600 font-medium">
                  {Math.round((completedToday / totalToday) * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
      />
    </>
  )
}
