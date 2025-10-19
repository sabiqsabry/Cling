import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type View =
  | 'dashboard'
  | 'today'
  | 'list'
  | 'kanban'
  | 'calendar'
  | 'timeline'
  | 'focus'
  | 'habits'
  | 'settings'

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void

  // Current view
  currentView: View
  setCurrentView: (view: View) => void

  // Selected task for detail view
  selectedTaskId: string | null
  setSelectedTaskId: (taskId: string | null) => void

  // Quick Add modal
  quickAddOpen: boolean
  setQuickAddOpen: (open: boolean) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void

  // Focus mode
  focusMode: boolean
  setFocusMode: (focus: boolean) => void

  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Mini window preferences
  menuBarMiniEnabled: boolean
  setMenuBarMiniEnabled: (enabled: boolean) => void
  trayMiniEnabled: boolean
  setTrayMiniEnabled: (enabled: boolean) => void

  // Sync banner
  syncBannerDismissed: boolean
  setSyncBannerDismissed: (dismissed: boolean) => void

  // Calendar view settings
  calendarView: 'day' | 'week' | 'month'
  setCalendarView: (view: 'day' | 'week' | 'month') => void
  showCalendarWithList: boolean
  setShowCalendarWithList: (show: boolean) => void

  // List view settings
  listGroupBy: 'list' | 'priority' | 'date' | 'status' | 'none'
  setListGroupBy: (
    groupBy: 'list' | 'priority' | 'date' | 'status' | 'none'
  ) => void
  listSortBy: 'created' | 'updated' | 'title' | 'due' | 'priority'
  setListSortBy: (
    sortBy: 'created' | 'updated' | 'title' | 'due' | 'priority'
  ) => void
  listSortOrder: 'asc' | 'desc'
  setListSortOrder: (order: 'asc' | 'desc') => void

  // Bulk selection
  selectedTaskIds: string[]
  setSelectedTaskIds: (ids: string[]) => void
  addSelectedTaskId: (id: string) => void
  removeSelectedTaskId: (id: string) => void
  clearSelectedTasks: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Current view
      currentView: 'dashboard',
      setCurrentView: (view) => set({ currentView: view }),

      // Selected task
      selectedTaskId: null,
      setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),

      // Quick Add modal
      quickAddOpen: false,
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Focus mode
      focusMode: false,
      setFocusMode: (focus) => set({ focusMode: focus }),

      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Mini window preferences
      menuBarMiniEnabled: true,
      setMenuBarMiniEnabled: (enabled) => set({ menuBarMiniEnabled: enabled }),
      trayMiniEnabled: true,
      setTrayMiniEnabled: (enabled) => set({ trayMiniEnabled: enabled }),

      // Sync banner
      syncBannerDismissed: false,
      setSyncBannerDismissed: (dismissed) =>
        set({ syncBannerDismissed: dismissed }),

      // Calendar view settings
      calendarView: 'week',
      setCalendarView: (view) => set({ calendarView: view }),
      showCalendarWithList: true,
      setShowCalendarWithList: (show) => set({ showCalendarWithList: show }),

      // List view settings
      listGroupBy: 'list',
      setListGroupBy: (groupBy) => set({ listGroupBy: groupBy }),
      listSortBy: 'created',
      setListSortBy: (sortBy) => set({ listSortBy: sortBy }),
      listSortOrder: 'desc',
      setListSortOrder: (order) => set({ listSortOrder: order }),

      // Bulk selection
      selectedTaskIds: [],
      setSelectedTaskIds: (ids) => set({ selectedTaskIds: ids }),
      addSelectedTaskId: (id) => {
        const current = get().selectedTaskIds
        if (!current.includes(id)) {
          set({ selectedTaskIds: [...current, id] })
        }
      },
      removeSelectedTaskId: (id) => {
        const current = get().selectedTaskIds
        set({ selectedTaskIds: current.filter((taskId) => taskId !== id) })
      },
      clearSelectedTasks: () => set({ selectedTaskIds: [] }),
    }),
    {
      name: 'cling-ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        menuBarMiniEnabled: state.menuBarMiniEnabled,
        trayMiniEnabled: state.trayMiniEnabled,
        syncBannerDismissed: state.syncBannerDismissed,
        calendarView: state.calendarView,
        showCalendarWithList: state.showCalendarWithList,
        listGroupBy: state.listGroupBy,
        listSortBy: state.listSortBy,
        listSortOrder: state.listSortOrder,
      }),
    }
  )
)
