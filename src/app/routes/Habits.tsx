import { useState, useEffect } from 'react'
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  CheckCircle,
  Circle,
  Flame,
} from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'
import { cn } from '@/lib/utils'

interface Habit {
  id: string
  title: string
  description?: string
  category: string
  streak: number
  schedule: {
    frequency: 'daily' | 'weekly'
    days: number[]
  }
  color: string
  created_at: string
}

interface HabitLog {
  id: string
  habit_id: string
  date: string
  value: number
  completed: boolean
}

export function Habits() {
  const { setQuickAddOpen } = useUIStore()
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual data fetching
    const mockHabits: Habit[] = [
      {
        id: '1',
        title: 'Morning Exercise',
        description: '30 minutes of cardio or strength training',
        category: 'health',
        streak: 12,
        schedule: {
          frequency: 'daily',
          days: [1, 2, 3, 4, 5, 6, 7],
        },
        color: '#10b981',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Read for 30 minutes',
        description: 'Read books, articles, or educational content',
        category: 'learning',
        streak: 8,
        schedule: {
          frequency: 'daily',
          days: [1, 2, 3, 4, 5, 6, 7],
        },
        color: '#3b82f6',
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Meditation',
        description: '10 minutes of mindfulness meditation',
        category: 'mindfulness',
        streak: 5,
        schedule: {
          frequency: 'daily',
          days: [1, 2, 3, 4, 5],
        },
        color: '#8b5cf6',
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Weekly Review',
        description: 'Plan and review weekly goals',
        category: 'productivity',
        streak: 3,
        schedule: {
          frequency: 'weekly',
          days: [0], // Sunday
        },
        color: '#f59e0b',
        created_at: new Date().toISOString(),
      },
    ]

    const mockLogs: HabitLog[] = [
      // Generate some sample logs for the last 30 days
      ...Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return {
          id: `log-${i}`,
          habit_id: '1',
          date: date.toISOString().split('T')[0],
          value: Math.random() > 0.3 ? 1 : 0,
          completed: Math.random() > 0.3,
        }
      }),
    ]

    setHabits(mockHabits)
    setHabitLogs(mockLogs)
    setLoading(false)
  }, [])

  const toggleHabitLog = (habitId: string, date: string) => {
    const existingLog = habitLogs.find(
      (log) => log.habit_id === habitId && log.date === date
    )

    if (existingLog) {
      // Toggle existing log
      setHabitLogs((prev) =>
        prev.map((log) =>
          log.id === existingLog.id
            ? {
                ...log,
                completed: !log.completed,
                value: log.completed ? 0 : 1,
              }
            : log
        )
      )
    } else {
      // Create new log
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        date,
        value: 1,
        completed: true,
      }
      setHabitLogs((prev) => [newLog, ...prev])
    }
  }

  const getHabitLogForDate = (habitId: string, date: string) => {
    return habitLogs.find(
      (log) => log.habit_id === habitId && log.date === date
    )
  }

  const generateHeatmapData = (habitId: string) => {
    const data = []
    const today = new Date()

    for (let i = 89; i >= 0; i--) {
      // Last 90 days
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const log = getHabitLogForDate(habitId, dateStr)

      data.push({
        date: dateStr,
        value: log?.value || 0,
        completed: log?.completed || false,
      })
    }

    return data
  }

  const getHeatmapIntensity = (value: number) => {
    if (value === 0) return 'bg-muted'
    if (value === 1) return 'bg-green-200'
    if (value === 2) return 'bg-green-300'
    if (value === 3) return 'bg-green-400'
    return 'bg-green-500'
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading habits...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Habits</h1>
          <p className="text-muted-foreground mt-1">
            Build consistency with daily and weekly habits
          </p>
        </div>
        <button
          onClick={() => setQuickAddOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Habits</p>
              <p className="text-2xl font-bold text-foreground">
                {habits.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Streaks</p>
              <p className="text-2xl font-bold text-foreground">
                {habits.filter((h) => h.streak > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.max(...habits.map((h) => h.streak), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
              <p className="text-2xl font-bold text-foreground">
                {
                  habitLogs.filter((log) => log.date === today && log.completed)
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {habits.map((habit) => {
          const todayLog = getHabitLogForDate(habit.id, today)
          const heatmapData = generateHeatmapData(habit.id)

          return (
            <div
              key={habit.id}
              className="bg-card p-6 rounded-lg border border-border"
            >
              {/* Habit Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {habit.title}
                    </h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-foreground">
                      {habit.streak}
                    </span>
                  </div>
                </div>
              </div>

              {/* Today's Check */}
              <div className="mb-4">
                <button
                  onClick={() => toggleHabitLog(habit.id, today)}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg border transition-colors',
                    todayLog?.completed
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-border hover:border-primary'
                  )}
                >
                  {todayLog?.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {todayLog?.completed
                      ? 'Completed today'
                      : 'Mark as complete'}
                  </span>
                </button>
              </div>

              {/* Heatmap */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Last 90 days
                </h4>
                <div className="grid grid-cols-13 gap-1">
                  {heatmapData.map((day, index) => (
                    <div
                      key={index}
                      className={cn(
                        'w-3 h-3 rounded-sm',
                        getHeatmapIntensity(day.value)
                      )}
                      title={`${day.date}: ${day.completed ? 'Completed' : 'Not completed'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Schedule Info */}
              <div className="text-xs text-muted-foreground">
                {habit.schedule.frequency === 'daily'
                  ? 'Daily habit'
                  : `${habit.schedule.days.length} days per week`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add New Habit</span>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">View Analytics</span>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  )
}
