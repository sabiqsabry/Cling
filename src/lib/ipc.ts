import { invoke } from '@tauri-apps/api/core'

// Task-related IPC commands
export interface Task {
  id: string
  list_id: string
  title: string
  description?: string
  priority: number
  start_at?: string
  end_at?: string
  all_day: boolean
  duration_min?: number
  recurrence_rrule?: string
  status: 'todo' | 'in-progress' | 'done'
  estimate_pomos: number
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface CreateTaskParams {
  title: string
  description?: string
  list_id: string
  priority?: number
  start_at?: string
  end_at?: string
  all_day?: boolean
  duration_min?: number
  recurrence_rrule?: string
  estimate_pomos?: number
  tags?: string[]
}

export interface UpdateTaskParams {
  id: string
  title?: string
  description?: string
  priority?: number
  start_at?: string
  end_at?: string
  all_day?: boolean
  duration_min?: number
  recurrence_rrule?: string
  status?: 'todo' | 'in-progress' | 'done'
  estimate_pomos?: number
  tags?: string[]
}

export const tasks = {
  create: (params: CreateTaskParams): Promise<Task> =>
    invoke('tasks_create', params as unknown as Record<string, unknown>),

  update: (params: UpdateTaskParams): Promise<Task> =>
    invoke('tasks_update', params as unknown as Record<string, unknown>),

  delete: (id: string): Promise<boolean> => invoke('tasks_delete', { id }),

  search: (query: string, filters?: any): Promise<Task[]> =>
    invoke('tasks_search', { query, filters }),

  getByDateRange: (start: string, end: string): Promise<Task[]> =>
    invoke('tasks_get_by_date_range', { start, end }),

  batchMove: (taskIds: string[], targetListId: string): Promise<boolean> =>
    invoke('tasks_batch_move', { taskIds, targetListId }),
}

// List-related IPC commands
export interface List {
  id: string
  folder_id?: string
  workspace_id: string
  name: string
  color: string
  ord: number
  is_shared: boolean
  created_at: string
  updated_at: string
}

export const lists = {
  getAll: (): Promise<List[]> => invoke('lists_get_all'),

  create: (name: string, workspaceId: string, color?: string): Promise<List> =>
    invoke('lists_create', { name, workspaceId, color }),

  update: (id: string, updates: Partial<List>): Promise<List> =>
    invoke('lists_update', { id, updates }),

  delete: (id: string): Promise<boolean> => invoke('lists_delete', { id }),
}

// Tag-related IPC commands
export interface Tag {
  id: string
  workspace_id: string
  name: string
  color: string
  created_at: string
}

export const tags = {
  getAll: (): Promise<Tag[]> => invoke('tags_get_all'),

  create: (name: string, workspaceId: string, color?: string): Promise<Tag> =>
    invoke('tags_create', { name, workspaceId, color }),

  assign: (taskId: string, tagId: string): Promise<boolean> =>
    invoke('tags_assign', { taskId, tagId }),

  remove: (taskId: string, tagId: string): Promise<boolean> =>
    invoke('tags_remove', { taskId, tagId }),
}

// Focus/Pomodoro commands
export interface FocusSession {
  id: string
  task_id?: string
  started_at: string
  duration_sec: number
  is_break: boolean
  noise_type?: string
  created_at: string
}

export const focus = {
  start: (
    taskId?: string,
    durationSec?: number,
    isBreak?: boolean
  ): Promise<FocusSession> =>
    invoke('focus_start', { taskId, durationSec, isBreak }),

  stop: (sessionId: string): Promise<FocusSession> =>
    invoke('focus_stop', { sessionId }),

  getStats: (period: string): Promise<any> =>
    invoke('focus_get_stats', { period }),
}

// Habit commands
export interface Habit {
  id: string
  workspace_id: string
  title: string
  schedule_json: string
  streak: number
  created_at: string
  updated_at: string
}

export const habits = {
  getAll: (): Promise<Habit[]> => invoke('habits_get_all'),

  create: (title: string, scheduleJson: string): Promise<Habit> =>
    invoke('habits_create', { title, scheduleJson }),

  log: (habitId: string, date: string, value: number): Promise<boolean> =>
    invoke('habits_log', { habitId, date, value }),

  getStats: (habitId: string): Promise<any> =>
    invoke('habits_get_stats', { habitId }),
}

// Utility commands
export const utils = {
  getSyncStatus: (): Promise<string> => invoke('get_sync_status'),

  seedDatabase: (): Promise<boolean> => invoke('seed_database'),
}
