import { useState, useEffect } from 'react'
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  Flag, 
  Repeat,
  Timer,
  Save,
  Trash2
} from 'lucide-react'
import { Task } from '@/app/db/schema'
import { cn } from '@/lib/utils'

interface TaskEditorProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (task: Partial<Task>) => void
  onDelete?: (taskId: string) => void
}

export function TaskEditor({ task, isOpen, onClose, onSave, onDelete }: TaskEditorProps) {
  const [formData, setFormData] = useState<Partial<Task>>({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 4,
        status: task.status,
        due_at: task.due_at,
        start_at: task.start_at,
        end_at: task.end_at,
        duration_min: task.duration_min,
        tags: task.tags || []
      })
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 4,
        status: 'todo',
        tags: []
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title?.trim()) {
      onSave(formData)
      onClose()
    }
  }

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id)
      onClose()
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card border-t border-border rounded-t-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Enter task description..."
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select
                value={formData.priority || 4}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={1}>P1 - Critical</option>
                <option value={2}>P2 - High</option>
                <option value={3}>P3 - Medium</option>
                <option value={4}>P4 - Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status || 'todo'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={formData.due_at ? new Date(formData.due_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                due_at: e.target.value ? new Date(e.target.value).toISOString() : undefined 
              }))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.start_at ? new Date(formData.start_at).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  start_at: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.end_at ? new Date(formData.end_at).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  end_at: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration_min || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, duration_min: parseInt(e.target.value) || undefined }))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter duration in minutes..."
              min="1"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type a tag and press Enter..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-border">
            <div>
              {task && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2 inline" />
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                Save Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
