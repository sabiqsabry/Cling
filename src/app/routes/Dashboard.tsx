import {
  Calendar,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { useUIStore } from '@/app/store/useUI'

export function Dashboard() {
  const setCurrentView = useUIStore((state) => state.setCurrentView)

  // Mock data - in real app, this would come from queries
  const stats = {
    tasksDueToday: 5,
    overdueTasks: 2,
    completedThisWeek: 12,
    habitsStreak: 8,
  }

  const recentTasks = [
    {
      id: '1',
      title: 'Review project proposal',
      priority: 1,
      status: 'todo',
      due: 'Today',
    },
    {
      id: '2',
      title: 'Buy groceries',
      priority: 4,
      status: 'todo',
      due: 'Tomorrow',
    },
    {
      id: '3',
      title: 'Call dentist',
      priority: 3,
      status: 'in-progress',
      due: 'Dec 15',
    },
    {
      id: '4',
      title: 'Implement user auth',
      priority: 1,
      status: 'done',
      due: 'Dec 12',
    },
  ]

  const habits = [
    { id: '1', title: 'Read 20 minutes', streak: 5, completed: true },
    { id: '2', title: 'Workout', streak: 12, completed: false },
    { id: '3', title: 'Practice Arabic', streak: 8, completed: true },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Due Today
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.tasksDueToday}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Overdue
              </p>
              <p className="text-2xl font-bold text-red-500">
                {stats.overdueTasks}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed This Week
              </p>
              <p className="text-2xl font-bold text-green-500">
                {stats.completedThisWeek}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Habits Streak
              </p>
              <p className="text-2xl font-bold text-purple-500">
                {stats.habitsStreak}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Tasks
            </h2>
            <button
              onClick={() => setCurrentView('list')}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`
                    w-2 h-2 rounded-full
                    ${
                      task.priority === 1
                        ? 'bg-red-500'
                        : task.priority === 2
                          ? 'bg-orange-500'
                          : task.priority === 3
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                    }
                  `}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`
                    text-xs px-2 py-1 rounded-full
                    ${
                      task.status === 'done'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }
                  `}
                  >
                    {task.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {task.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Habits</h2>
            <button
              onClick={() => setCurrentView('habits')}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Manage
            </button>
          </div>
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${habit.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}
                  `}
                  >
                    {habit.completed && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {habit.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-purple-500">
                    {habit.streak}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentView('focus')}
            className="flex items-center space-x-3 p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Target className="h-5 w-5" />
            <span className="font-medium">Start Focus Session</span>
          </button>

          <button
            onClick={() => setCurrentView('today')}
            className="flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span className="font-medium">View Today&apos;s Tasks</span>
          </button>

          <button
            onClick={() => setCurrentView('calendar')}
            className="flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Clock className="h-5 w-5" />
            <span className="font-medium">Open Calendar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
