import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          theme_preference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          theme_preference?: string | null
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          theme_preference?: string | null
          updated_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          icon: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          icon?: string | null
          position?: number
        }
        Update: {
          name?: string
          color?: string
          icon?: string | null
          position?: number
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
        }
        Update: {
          name?: string
          color?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          list_id: string | null
          title: string
          description: string | null
          status: 'todo' | 'in-progress' | 'done'
          priority: '1' | '2' | '3' | '4'
          start_at: string | null
          end_at: string | null
          completed_at: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          list_id?: string | null
          title: string
          description?: string | null
          status?: 'todo' | 'in-progress' | 'done'
          priority?: '1' | '2' | '3' | '4'
          start_at?: string | null
          end_at?: string | null
          completed_at?: string | null
          position?: number
        }
        Update: {
          title?: string
          description?: string | null
          status?: 'todo' | 'in-progress' | 'done'
          priority?: '1' | '2' | '3' | '4'
          start_at?: string | null
          end_at?: string | null
          completed_at?: string | null
          position?: number
          updated_at?: string
        }
      }
      task_tags: {
        Row: {
          task_id: string
          tag_id: string
        }
        Insert: {
          task_id: string
          tag_id: string
        }
        Update: {
          task_id?: string
          tag_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
        }
        Update: {
          content?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          filename: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          filename: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
        }
        Update: {
          filename?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          target_value: number
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly'
          target_value?: number
          color?: string
        }
        Update: {
          title?: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly'
          target_value?: number
          color?: string
          updated_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          date: string
          value: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          date: string
          value?: number
          completed?: boolean
        }
        Update: {
          value?: number
          completed?: boolean
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          duration: number
          is_break: boolean
          start_time: string
          end_time: string | null
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          duration: number
          is_break?: boolean
          start_time: string
          end_time?: string | null
          completed?: boolean
        }
        Update: {
          end_time?: string | null
          completed?: boolean
        }
      }
      sync_log: {
        Row: {
          id: string
          user_id: string
          table_name: string
          record_id: string
          operation: string
          data: any
          created_at: string
          synced_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          table_name: string
          record_id: string
          operation: string
          data: any
        }
        Update: {
          synced_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_status: 'todo' | 'in-progress' | 'done'
      priority_level: '1' | '2' | '3' | '4'
      habit_frequency: 'daily' | 'weekly' | 'monthly'
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Specific table types
export type Profile = Tables<'profiles'>
export type List = Tables<'lists'>
export type Tag = Tables<'tags'>
export type Task = Tables<'tasks'>
export type TaskTag = Tables<'task_tags'>
export type Comment = Tables<'comments'>
export type Attachment = Tables<'attachments'>
export type Habit = Tables<'habits'>
export type HabitLog = Tables<'habit_logs'>
export type FocusSession = Tables<'focus_sessions'>
export type SyncLog = Tables<'sync_log'>
