import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  Target,
  BarChart3,
} from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { Task } from '@/app/db/schema'
import { cn } from '@/lib/utils'

interface FocusSession {
  id: string
  taskId: string | null
  duration: number
  isBreak: boolean
  startTime: Date | null
  endTime: Date | null
  completed: boolean
}

export function Focus() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(
    null
  )
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mock tasks for focus session
  const availableTasks: Task[] = [
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
      list_id: 'work',
      title: 'Write documentation',
      description: 'Document the API endpoints',
      priority: 3,
      status: 'in-progress',
      due_at: new Date().toISOString(),
      start_at: null,
      end_at: null,
      duration_min: 90,
      recurrence_rrule: null,
      estimate_pomos: 3,
      tags: ['work', 'documentation'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Save completed session
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true,
      }
      setSessions((prev) => [completedSession, ...prev])
    }

    // Switch to break or work session
    if (!isBreak) {
      // Work session completed, start break
      setIsBreak(true)
      setTimeLeft(5 * 60) // 5 minute break
      setCurrentSession({
        id: Math.random().toString(36).substr(2, 9),
        taskId: null,
        duration: 5 * 60,
        isBreak: true,
        startTime: new Date(),
        endTime: null,
        completed: false,
      })
    } else {
      // Break completed, start work session
      setIsBreak(false)
      setTimeLeft(25 * 60) // 25 minute work session
      setCurrentSession({
        id: Math.random().toString(36).substr(2, 9),
        taskId: selectedTask?.id || null,
        duration: 25 * 60,
        isBreak: false,
        startTime: new Date(),
        endTime: null,
        completed: false,
      })
    }
  }, [isBreak, selectedTask])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, handleSessionComplete])

  const startSession = () => {
    setIsRunning(true)
    setCurrentSession({
      id: Math.random().toString(36).substr(2, 9),
      taskId: selectedTask?.id || null,
      duration: isBreak ? 5 * 60 : 25 * 60,
      isBreak,
      startTime: new Date(),
      endTime: null,
      completed: false,
    })
  }

  const pauseSession = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetSession = () => {
    setIsRunning(false)
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60)
    setCurrentSession(null)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!currentSession) return 0
    const total = currentSession.duration
    const elapsed = total - timeLeft
    return (elapsed / total) * 100
  }

  const todaySessions = sessions.filter((session) => {
    if (!session.endTime) return false
    const today = new Date()
    const sessionDate = new Date(session.endTime)
    return sessionDate.toDateString() === today.toDateString()
  })

  const totalWorkTime = todaySessions
    .filter((session) => !session.isBreak)
    .reduce((total, session) => total + session.duration, 0)

  const totalBreakTime = todaySessions
    .filter((session) => session.isBreak)
    .reduce((total, session) => total + session.duration, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Focus</h1>
        <p className="text-muted-foreground mt-2">
          Pomodoro timer for productive work sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer Display */}
          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <div className="mb-6">
              <div
                className={cn(
                  'text-6xl font-bold mb-2',
                  isBreak ? 'text-green-500' : 'text-blue-500'
                )}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-muted-foreground">
                {isBreak ? 'Break Time' : 'Focus Time'}
              </div>
            </div>

            {/* Progress Ring */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgress() / 100)}`}
                  className={cn(
                    'transition-all duration-1000 ease-in-out',
                    isBreak ? 'text-green-500' : 'text-blue-500'
                  )}
                />
              </svg>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!isRunning ? (
                <button
                  onClick={startSession}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  <span>Start</span>
                </button>
              ) : (
                <button
                  onClick={pauseSession}
                  className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Pause className="h-5 w-5" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={resetSession}
                className="flex items-center space-x-2 px-4 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Task Selection */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Select Task
            </h3>
            <div className="space-y-2">
              {availableTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-colors',
                    selectedTask?.id === task.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="font-medium text-foreground">
                    {task.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.description}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {task.estimate_pomos || 0} pomos
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Today&apos;s Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    Work Time
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatTime(totalWorkTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Break Time
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatTime(totalBreakTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">
                    Sessions
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {todaySessions.filter((s) => !s.isBreak).length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        session.isBreak ? 'bg-green-500' : 'bg-blue-500'
                      )}
                    />
                    <span className="text-muted-foreground">
                      {session.isBreak ? 'Break' : 'Work'}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    {formatTime(session.duration)}
                  </span>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No sessions yet
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Focus Tips
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>• Work in 25-minute focused sessions</div>
              <div>• Take 5-minute breaks between sessions</div>
              <div>• Take longer 15-30 minute breaks every 4 sessions</div>
              <div>• Eliminate distractions during work time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
