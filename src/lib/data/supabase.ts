import { supabase } from '@/lib/supabase'
import type { 
  Task, 
  List, 
  Tag, 
  Habit, 
  HabitLog, 
  Comment, 
  Attachment,
  FocusSession,
  TaskInsert,
  ListInsert,
  TagInsert,
  HabitInsert,
  HabitLogInsert,
  CommentInsert,
  AttachmentInsert,
  FocusSessionInsert
} from '@/lib/supabase'

export class SupabaseDataLayer {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        list:lists(*),
        task_tags(tag:tags(*))
      `)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getTask(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        list:lists(*),
        task_tags(tag:tags(*))
      `)
      .eq('id', id)
      .eq('user_id', this.userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async createTask(task: Omit<TaskInsert, 'user_id'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateTask(id: string, updates: Partial<TaskInsert>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  async toggleTaskComplete(id: string, completed: boolean): Promise<Task> {
    const updates: Partial<TaskInsert> = {
      status: completed ? 'done' : 'todo',
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    return this.updateTask(id, updates)
  }

  // Lists
  async getLists(): Promise<List[]> {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', this.userId)
      .order('position')

    if (error) throw error
    return data || []
  }

  async getList(id: string): Promise<List | null> {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('id', id)
      .eq('user_id', this.userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async createList(list: Omit<ListInsert, 'user_id'>): Promise<List> {
    const { data, error } = await supabase
      .from('lists')
      .insert({
        ...list,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateList(id: string, updates: Partial<ListInsert>): Promise<List> {
    const { data, error } = await supabase
      .from('lists')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .tag('id', id)
      .eq('user_id', this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteList(id: string): Promise<void> {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', this.userId)
      .order('name')

    if (error) throw error
    return data || []
  }

  async createTag(tag: Omit<TagInsert, 'user_id'>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .insert({
        ...tag,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateTag(id: string, updates: Partial<TagInsert>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteTag(id: string): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  // Task Tags
  async addTaskTag(taskId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('task_tags')
      .insert({
        task_id: taskId,
        tag_id: tagId,
      })

    if (error) throw error
  }

  async removeTaskTag(taskId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId)

    if (error) throw error
  }

  // Habits
  async getHabits(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createHabit(habit: Omit<HabitInsert, 'user_id'>): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        ...habit,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateHabit(id: string, updates: Partial<HabitInsert>): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteHabit(id: string): Promise<void> {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  // Habit Logs
  async getHabitLogs(habitId?: string): Promise<HabitLog[]> {
    let query = supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', this.userId)

    if (habitId) {
      query = query.eq('habit_id', habitId)
    }

    const { data, error } = await query.order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createHabitLog(log: Omit<HabitLogInsert, 'user_id'>): Promise<HabitLog> {
    const { data, error } = await supabase
      .from('habit_logs')
      .upsert({
        ...log,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateHabitLog(id: string, updates: Partial<HabitLogInsert>): Promise<HabitLog> {
    const { data, error } = await supabase
      .from('habit_logs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteHabitLog(id: string): Promise<void> {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  // Comments
  async getTaskComments(taskId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createComment(comment: Omit<CommentInsert, 'user_id'>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        ...comment,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateComment(id: string, updates: Partial<CommentInsert>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  // Attachments
  async getTaskAttachments(taskId: string): Promise<Attachment[]> {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createAttachment(attachment: Omit<AttachmentInsert, 'user_id'>): Promise<Attachment> {
    const { data, error } = await supabase
      .from('attachments')
      .insert({
        ...attachment,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteAttachment(id: string): Promise<void> {
    const { error } = await supabase
      .from('attachments')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  // Focus Sessions
  async getFocusSessions(): Promise<FocusSession[]> {
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createFocusSession(session: Omit<FocusSessionInsert, 'user_id'>): Promise<FocusSession> {
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        ...session,
        user_id: this.userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateFocusSession(id: string, updates: Partial<FocusSessionInsert>): Promise<FocusSession> {
    const { data, error } = await supabase
      .from('focus_sessions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteFocusSession(id: string): Promise<void> {
    const { error } = await supabase
      .from('focus_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId)

    if (error) throw error
  }

  // Real-time subscriptions
  subscribeToTasks(callback: (payload: any) => void) {
    return supabase
      .channel('tasks')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${this.userId}`
        }, 
        callback
      )
      .subscribe()
  }

  subscribeToHabits(callback: (payload: any) => void) {
    return supabase
      .channel('habits')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'habits',
          filter: `user_id=eq.${this.userId}`
        }, 
        callback
      )
      .subscribe()
  }

  subscribeToHabitLogs(callback: (payload: any) => void) {
    return supabase
      .channel('habit_logs')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'habit_logs',
          filter: `user_id=eq.${this.userId}`
        }, 
        callback
      )
      .subscribe()
  }
}
