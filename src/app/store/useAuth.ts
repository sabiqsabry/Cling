import { create } from 'zustand'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
}

interface AuthState {
  // User info
  user: User | null
  setUser: (user: User | null) => void

  // Auth status
  isAuthenticated: boolean
  isLoading: boolean

  // Sync status
  syncEnabled: boolean
  setSyncEnabled: (enabled: boolean) => void

  // Workspace info
  currentWorkspaceId: string | null
  setCurrentWorkspaceId: (workspaceId: string | null) => void

  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  // User info
  user: {
    id: 'local-user',
    name: 'Local User',
    email: 'local@cling.app',
  }, // Default local user for offline mode
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // Auth status
  isAuthenticated: true, // Always authenticated in local-only mode
  isLoading: false,

  // Sync status
  syncEnabled: false, // Will be set based on environment
  setSyncEnabled: (enabled) => set({ syncEnabled: enabled }),

  // Workspace info
  currentWorkspaceId: null,
  setCurrentWorkspaceId: (workspaceId) =>
    set({ currentWorkspaceId: workspaceId }),

  // Actions
  login: async (email: string, _password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement actual login when Supabase is configured
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user: User = {
        id: 'user-123',
        email,
        name: email.split('@')[0],
      }

      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    set({
      user: {
        id: 'local-user',
        name: 'Local User',
        email: 'local@cling.app',
      },
      isAuthenticated: true, // Stay authenticated in local mode
      currentWorkspaceId: null,
    })
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      // TODO: Check auth status when Supabase is configured
      // For now, always authenticated in local mode
      set({ isAuthenticated: true, isLoading: false })
    } catch {
      set({ isLoading: false })
      // In local mode, always fall back to authenticated
      set({ isAuthenticated: true })
    }
  },
}))
