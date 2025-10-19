import { useState } from 'react'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar, 
  Tag, 
  MoreVertical,
  Edit,
  Trash2,
  Flag
} from 'lucide-react'
import { Task } from '@/app/db/schema'
import { cn } from '@/lib/utils'
import { formatDate, getRelativeDateLabel } from '@/lib/date'

interface TaskCardProps {
  task: Task
  onToggleComplete: (taskId: string) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  compact?: boolean
}

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  compact = false 
}: TaskCardProps) {
  const [showActions, setShowActions] = useState(false)
  const isCompleted = task.status === 'done'

  const priorityColors = {
    1: 'text-red-500',
    2: 'text-orange-500', 
    3: 'text-blue-500',
    4: 'text-gray-500'
  }

  const statusColors = {
    todo: 'text-gray-500',
    'in-progress': 'text-blue-500',
    done: 'text-green-500'
  }

  return (
    <div 
      className={cn(
        "group bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
        isCompleted && "opacity-75",
        compact && "p-3"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={cn(
            "mt-0.5 transition-colors",
            isCompleted ? "text-green-500" : "text-gray-400 hover:text-gray-600"
          )}
        >
          {isCompleted ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={cn(
            "font-medium text-foreground leading-tight",
            isCompleted && "line-through text-muted-foreground",
            compact && "text-sm"
          )}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && !compact && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
            {/* Priority */}
            {task.priority && (
              <div className="flex items-center space-x-1">
                <Flag className={cn("h-3 w-3", priorityColors[task.priority])} />
                <span className={priorityColors[task.priority]}>P{task.priority}</span>
              </div>
            )}

            {/* Due Date */}
            {task.due_at && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span className={cn(
                  task.due_at < new Date().toISOString() && !isCompleted && "text-red-500"
                )}>
                  {getRelativeDateLabel(task.due_at)}
                </span>
              </div>
            )}

            {/* Duration */}
            {task.duration_min && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{task.duration_min}min</span>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center space-x-1">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                isCompleted ? "bg-green-100 text-green-800" :
                task.status === 'in-progress' ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {task.status === 'in-progress' ? 'In Progress' : 
                 task.status === 'done' ? 'Done' : 'To Do'}
              </span>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
