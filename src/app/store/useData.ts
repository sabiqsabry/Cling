import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SupabaseDataLayer } from '@/lib/data/supabase'
import { useAuthStore } from './useAuth'
import type { Task, List, Tag, Habit, HabitLog, Comment, Attachment, FocusSession } from '@/lib/supabase'

interface DataState {
  // Data
  tasks: Task[]
  lists: List[]
  tags: Tag[]
  habits: Habit[]
  habitLogs: HabitLog[]
  comments: Comment[]
  attachments: Attachment[]
  focusSessions: FocusSession[]

  // Loading states
  isLoading: boolean
  isOnline: boolean

  // Data layer
  dataLayer: SupabaseDataLayer | null

  // Actions
  initialize: () => Promise<void>
  setOnline: (online: boolean) => void
  
  // Tasks
  loadTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskComplete: (id: string, completed: boolean) => Promise<void>

  // Lists
  loadLists: () => Promise<void>
  createList: (list: Omit<List, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<List>
  updateList: (id: string, updates: Partial<List>) => Promise<void>
  deleteList: (id: string) => Promise<void>

  // Tags
  loadTags: () => Promise<void>
  createTag: (tag: Omit<Tag, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Tag>
  updateTag: (id: string, updates: Partial<Tag>) => Promise<void>
  deleteTag: (id: string) => Promise<void>

  // Habits
  loadHabits: () => Promise<void>
  createHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Habit>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>

  // Habit Logs
  loadHabitLogs: (habitId?: string) => Promise<void>
  createHabitLog: (log: Omit<HabitLog, 'id' | 'user_id' | 'created_at'>) => Promise<HabitLog>
  updateHabitLog: (id: string, updates: Partial<HabitLog>) => Promise<void>
  deleteHabitLog: (id: string) => Promise<void>

  // Focus Sessions
  loadFocusSessions: () => Promise<void>
  createFocusSession: (session: Omit<FocusSession, 'id' | 'user_id' | 'created_at'>) => Promise<FocusSession>
  updateFocusSession: (id: string, updates: Partial<FocusSession>) => Promise<void>
  deleteFocusSession: (id: string) => Promise<void>
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Data
      tasks: [],
      lists: [],
      tags: [],
      habits: [],
      habitLogs: [],
      comments: [],
      attachments: [],
      focusSessions: [],

      // Loading states
      isLoading: false,
      isOnline: navigator.onLine,

      // Data layer
      dataLayer: null,

      // Actions
      initialize: async () => {
        const { user } = useAuthStore.getState()
        if (!user) return

        const dataLayer = new SupabaseDataLayer(user.id)
        set({ dataLayer })

        // Set up online/offline listeners
        const handleOnline = () => set({ isOnline: true })
        const handleOffline = () => set({ isOnline: false })
        
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Load initial data
        await get().loadTasks()
        await get().loadLists()
        await get().loadTags()
        await get().loadHabits()
        await get().loadHabitLogs()
        await get().loadFocusSessions()

        // Set up real-time subscriptions
        if (dataLayer && get().isOnline) {
          // Subscribe to real-time updates
          dataLayer.subscribeToTasks((payload) => {
            console.log('Task update:', payload)
            get().loadTasks()
          })

          dataLayer.subscribeToHabits((payload) => {
            console.log('Habit update:', payload)
            get().loadHabits()
          })

          dataLayer.subscribeToHabitLogs((payload) => {
            console.log('Habit log update:', payload)
            get().loadHabitLogs()
          })
        }
      },

      setOnline: (online: boolean) => set({ isOnline: online }),

      // Tasks
      loadTasks: async () => {
        const { dataLayer } = get()
        if (!dataLayer) return

        set({ isLoading: true })
        try {
          const tasks = await dataLayer.getTasks()
          set({ tasks, isLoading: false })
        } catch (error) {
          console.error('Error loading tasks:', error)
          set({ isLoading: false })
        }
      },

      createTask: async (taskData) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const task = await dataLayer.createTask(taskData)
        set((state) => ({ tasks: [task, ...state.tasks] }))
        return task
      },

      updateTask: async (id, updates) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const updatedTask = await dataLayer.updateTask(id, updates)
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        }))
      },

      deleteTask: async (id) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        await dataLayer.deleteTask(id)
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
      },

      toggleTaskComplete: async (id, completed) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const updatedTask = await dataLayer.toggleTaskComplete(id, completed)
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        }))
      },

      // Lists
      loadLists: async () => {
        const { dataLayer } = get()
        if (!dataLayer) return

        try {
          const lists = await dataLayer.getLists()
          set({ lists })
        } catch (error) {
          console.error('Error loading lists:', error)
        }
      },

      createList: async (listData) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const list = await dataLayer.createList(listData)
        set((state) => ({ lists: [...state.lists, list] }))
        return list
      },

      updateList: async (id, updates) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const updatedList = await dataLayer.updateList(id, updates)
        set((state) => ({
          lists: state.lists.map((list) => (list.id === id ? updatedList : list)),
        }))
      },

      deleteList: async (id) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        await dataLayer.deleteList(id)
        set((state) => ({ lists: state.lists.filter((list) => list.id !== id) }))
      },

      // Tags
      loadTags: async () => {
        const { dataLayer } = get()
        if (!dataLayer) return

        try {
          const tags = await dataLayer.getTags()
          set({ tags })
        } catch (error) {
          console.error('Error loading tags:', error)
        }
      },

      createTag: async (tagData) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const tag = await dataLayer.createTag(tagData)
        set((state) => ({ tags: [...state.tags, tag] }))
        return tag
      },

      updateTag: async (id, updates) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const updatedTag = await dataLayer.updateTag(id, updates)
        set((state) => ({
          tags: state.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
        }))
      },

      deleteTag: async (id) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        await dataLayer.deleteTag(id)
        set((state) => ({ tags: state.tags.filter((tag) => tag.id !== id) }))
      },

      // Habits
      loadHabits: async () => {
        const { dataLayer } = get()
        if (!dataLayer) return

        try {
          const habits = await dataLayer.getHabits()
          set({ habits })
        } catch (error) {
          console.error('Error loading habits:', error)
        }
      },

      createHabit: async (habitData) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const habit = await dataLayer.createHabit(habitData)
        set((state) => ({ habits: [habit, ...state.habits] }))
        return habit
      },

      updateHabit: async (id, updates) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const updatedHabit = await dataLayer.updateHabit(id, updates)
        set((state) => ({
          habits: state.habits.map((habit) => (habit.id === id ? updatedHabit : habit)),
        }))
      },

      deleteHabit: async (id) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        await dataLayer.deleteHabit(id)
        set((state) => ({ habits: state.habits.filter((habit) => habit.id !== id) }))
      },

      // Habit Logs
      loadHabitLogs: async (habitId) => {
        const { dataLayer } = get()
        if (!dataLayer) return

        try {
          const habitLogs = await dataLayer.getHabitLogs(habitId)
          set({ habitLogs })
        } catch (error) {
          console.error('Error loading habit logs:', error)
        }
      },

      createHabitLog: async (logData) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const log = await dataLayer.createHabitLog(logData)
        set((state) => ({ habitLogs: [log, ...state.habitLogs] }))
        return log
      },

      updateHabitLog: async (id, updates) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const updatedLog = await dataLayer.updateHabitLog(id, updates)
        set((state) => ({
          habitLogs: state.habitLogs.map((log) => (log.id === id ? updatedLog : log)),
        }))
      },

      deleteHabitLog: async (id) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        await dataLayer.deleteHabitLog(id)
        set((state) => ({ habitLogs: state.habitLogs.filter((log) => log.id !== id) }))
      },

      // Focus Sessions
      loadFocusSessions: async () => {
        const { dataLayer } = get()
        if (!dataLayer) return

        try {
          const sessions = await dataLayer.getFocusSessions()
          set({ focusSessions: sessions })
        } catch (error) {
          console.error('Error loading focus sessions:', error)
        }
      },

      createFocusSession: async (sessionData) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const session = await dataLayer.createFocusSession(sessionData)
        set((state) => ({ focusSessions: [session, ...state.focusSessions] }))
        return session
      },

      updateFocusSession: async (id, updates) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        const updatedSession = await dataLayer.updateFocusSession(id, updates)
        set((state) => ({
          focusSessions: state.focusSessions.map((session) => (session.id === id ? updatedSession : session)),
        }))
      },

      deleteFocusSession: async (id) => {
        const { dataLayer } = get()
        if (!dataLayer) throw new Error('Data layer not initialized')

        await dataLayer.deleteFocusSession(id)
        set((state) => ({ focusSessions: state.focusSessions.filter((session) => session.id !== id) }))
      },
    }),
    {
      name: 'cling-data',
      partialize: (state) => ({
        tasks: state.tasks,
        lists: state.lists,
        tags: state.tags,
        habits: state.habits,
        habitLogs: state.habitLogs,
        focusSessions: state.focusSessions,
      }),
    }
  )
)
