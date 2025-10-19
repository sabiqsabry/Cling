import { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  Flag, 
  Repeat,
  Timer
} from 'lucide-react'
import { parseTaskInput, ParsedTask, ParsedChip } from '@/lib/parse'
import { cn } from '@/lib/utils'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: ParsedTask) => void
}

export function QuickAddModal({ isOpen, onClose, onSubmit }: QuickAddModalProps) {
  const [input, setInput] = useState('')
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (input.trim()) {
      const parsed = parseTaskInput(input)
      setParsedTask(parsed)
    } else {
      setParsedTask(null)
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedTask && parsedTask.title.trim()) {
      onSubmit(parsedTask)
      setInput('')
      setParsedTask(null)
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Quick Add Task</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Input Field */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a task... (e.g., 'Submit report tomorrow 3pm #work P1')"
                className="w-full px-4 py-3 text-lg border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Parsed Chips */}
            {parsedTask && parsedTask.chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {parsedTask.chips.map((chip, index) => (
                  <Chip key={index} chip={chip} />
                ))}
              </div>
            )}

            {/* Preview */}
            {parsedTask && (
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Preview:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Title: </span>
                    <span className="text-foreground">{parsedTask.title || 'Untitled task'}</span>
                  </div>
                  
                  {parsedTask.startAt && (
                    <div>
                      <span className="text-muted-foreground">Start: </span>
                      <span className="text-foreground">
                        {new Date(parsedTask.startAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {parsedTask.endAt && (
                    <div>
                      <span className="text-muted-foreground">End: </span>
                      <span className="text-foreground">
                        {new Date(parsedTask.endAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {parsedTask.priority && (
                    <div>
                      <span className="text-muted-foreground">Priority: </span>
                      <span className="text-foreground">P{parsedTask.priority}</span>
                    </div>
                  )}
                  
                  {parsedTask.tags.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Tags: </span>
                      <span className="text-foreground">{parsedTask.tags.join(', ')}</span>
                    </div>
                  )}
                  
                  {parsedTask.recurrence && (
                    <div>
                      <span className="text-muted-foreground">Recurrence: </span>
                      <span className="text-foreground">{parsedTask.recurrence}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!parsedTask?.title?.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ChipProps {
  chip: ParsedChip
}

function Chip({ chip }: ChipProps) {
  const getChipIcon = (type: string) => {
    switch (type) {
      case 'date':
        return <Calendar className="h-3 w-3" />
      case 'time':
        return <Clock className="h-3 w-3" />
      case 'tag':
        return <Tag className="h-3 w-3" />
      case 'priority':
        return <Flag className="h-3 w-3" />
      case 'recurrence':
        return <Repeat className="h-3 w-3" />
      case 'duration':
        return <Timer className="h-3 w-3" />
      default:
        return null
    }
  }

  const getChipColor = (type: string) => {
    switch (type) {
      case 'date':
        return 'bg-blue-100 text-blue-800'
      case 'time':
        return 'bg-green-100 text-green-800'
      case 'tag':
        return 'bg-purple-100 text-purple-800'
      case 'priority':
        return 'bg-red-100 text-red-800'
      case 'recurrence':
        return 'bg-orange-100 text-orange-800'
      case 'duration':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      getChipColor(chip.type)
    )}>
      {getChipIcon(chip.type)}
      <span className="ml-1">{chip.text}</span>
    </div>
  )
}
