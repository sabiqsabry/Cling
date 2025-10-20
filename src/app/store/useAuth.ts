import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'

interface AuthState {
  // User info
  user: User | null
  profile: Profile | null
  session: Session | null
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
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  initialize: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // User info
      user: null,
      profile: null,
      session: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Auth status
      isAuthenticated: false,
      isLoading: true,

      // Sync status
      syncEnabled: true, // Supabase is now configured
      setSyncEnabled: (enabled) => set({ syncEnabled: enabled }),

      // Workspace info
      currentWorkspaceId: null,
      setCurrentWorkspaceId: (workspaceId) =>
        set({ currentWorkspaceId: workspaceId }),

      // Actions
      initialize: async () => {
        set({ isLoading: true })

        try {
          // Get initial session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession()
          if (error) throw error

          if (session?.user) {
            // Load user profile
            const profile = await loadUserProfile(session.user.id)
            set({
              user: session.user,
              profile,
              session,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const profile = await loadUserProfile(session.user.id)
              set({
                user: session.user,
                profile,
                session,
                isAuthenticated: true,
              })
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                profile: null,
                session: null,
                isAuthenticated: false,
              })
            }
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ isLoading: false })
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error

          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signUp: async (email: string, password: string, fullName: string) => {
        set({ isLoading: true })
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })
          if (error) throw error

          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          set({
            user: null,
            profile: null,
            session: null,
            isAuthenticated: false,
            currentWorkspaceId: null,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          set({
            session,
            user: session?.user || null,
            isAuthenticated: !!session?.user,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      updateProfile: async (updates: Partial<Profile>) => {
        const { user } = get()
        if (!user) throw new Error('Not authenticated')

        set({ isLoading: true })
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (error) throw error

          // Update local state
          const { profile } = get()
          if (profile) {
            set({ profile: { ...profile, ...updates }, isLoading: false })
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
    }),
    {
      name: 'cling-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

async function loadUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        return await createUserProfile(userId)
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error loading user profile:', error)
    return null
  }
}

async function createUserProfile(userId: string): Promise<Profile | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        theme_preference: 'system',
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user profile:', error)
    return null
  }
}
