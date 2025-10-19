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

  get: (id: string): Promise<Task | null> => invoke('tasks_get', { id }),

  update: (params: UpdateTaskParams): Promise<Task> =>
    invoke('tasks_update', params as unknown as Record<string, unknown>),

  delete: (id: string): Promise<boolean> => invoke('tasks_delete', { id }),

  list: (listId?: string): Promise<Task[]> => invoke('tasks_list', { listId }),

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
  create: (name: string, color?: string, ord?: number): Promise<List> =>
    invoke('lists_create', { name, color, ord }),

  get: (id: string): Promise<List | null> => invoke('lists_get', { id }),

  update: (
    id: string,
    name?: string,
    color?: string,
    ord?: number
  ): Promise<List> => invoke('lists_update', { id, name, color, ord }),

  delete: (id: string): Promise<boolean> => invoke('lists_delete', { id }),

  list: (): Promise<List[]> => invoke('lists_list', {}),
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
  create: (name: string, color?: string): Promise<Tag> =>
    invoke('tags_create', { name, color }),

  get: (id: string): Promise<Tag | null> => invoke('tags_get', { id }),

  update: (id: string, name?: string, color?: string): Promise<Tag> =>
    invoke('tags_update', { id, name, color }),

  delete: (id: string): Promise<boolean> => invoke('tags_delete', { id }),

  list: (): Promise<Tag[]> => invoke('tags_list', {}),

  upsert: (name: string, color?: string): Promise<Tag> =>
    invoke('tags_upsert', { name, color }),

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
  start: (taskId?: string, durationSec: number = 1500): Promise<FocusSession> =>
    invoke('focus_start', { taskId, durationSec }),

  stop: (sessionId: string): Promise<FocusSession> =>
    invoke('focus_stop', { sessionId }),

  stats: (): Promise<any> => invoke('focus_stats', {}),

  sessionsList: (limit?: number): Promise<FocusSession[]> =>
    invoke('focus_sessions_list', { limit }),
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
  create: (
    title: string,
    description?: string,
    scheduleJson: string
  ): Promise<Habit> =>
    invoke('habits_create', { title, description, scheduleJson }),

  list: (): Promise<Habit[]> => invoke('habits_list', {}),

  update: (
    id: string,
    title?: string,
    description?: string,
    scheduleJson?: string
  ): Promise<Habit> =>
    invoke('habits_update', { id, title, description, scheduleJson }),

  delete: (id: string): Promise<boolean> => invoke('habits_delete', { id }),

  log: (habitId: string, date: string, value: number): Promise<any> =>
    invoke('habits_log', { habitId, date, value }),

  stats: (): Promise<any> => invoke('habits_stats', {}),
}

// Comment commands
export interface Comment {
  id: string
  task_id: string
  body: string
  created_at: string
  updated_at: string
}

export const comments = {
  add: (taskId: string, body: string): Promise<Comment> =>
    invoke('comments_add', { taskId, body }),

  list: (taskId: string): Promise<Comment[]> =>
    invoke('comments_list', { taskId }),

  update: (id: string, body: string): Promise<Comment> =>
    invoke('comments_update', { id, body }),

  delete: (id: string): Promise<boolean> => invoke('comments_delete', { id }),
}

// Attachment commands
export interface Attachment {
  id: string
  task_id: string
  file_path: string
  file_name: string
  mime_type: string
  file_size_bytes: number
  uploaded_at: string
}

export const attachments = {
  add: (
    taskId: string,
    filePath: string,
    fileName: string,
    mimeType: string,
    fileSizeBytes: number
  ): Promise<Attachment> =>
    invoke('attachments_add', {
      taskId,
      filePath,
      fileName,
      mimeType,
      fileSizeBytes,
    }),

  list: (taskId: string): Promise<Attachment[]> =>
    invoke('attachments_list', { taskId }),

  delete: (id: string): Promise<boolean> =>
    invoke('attachments_delete', { id }),
}

// Calendar commands
export interface CalendarEvent {
  id: string
  title: string
  start_time: string
  end_time?: string
  all_day: boolean
  task_id?: string
  color?: string
}

export const calendar = {
  timeblock: (
    taskId: string,
    startTime: string,
    endTime: string
  ): Promise<any> =>
    invoke('calendar_timeblock', { taskId, startTime, endTime }),

  events: (startDate: string, endDate: string): Promise<CalendarEvent[]> =>
    invoke('calendar_events', { startDate, endDate }),

  eventsByTask: (taskId: string): Promise<any[]> =>
    invoke('calendar_events_by_task', { taskId }),

  deleteTimeblock: (timeblockId: string): Promise<boolean> =>
    invoke('calendar_delete_timeblock', { timeblockId }),
}

// OS integration commands
export const os = {
  registerProtocol: (scheme: string): Promise<boolean> =>
    invoke('protocol_register', { scheme }),
  registerGlobalShortcut: (shortcut: string): Promise<boolean> =>
    invoke('global_shortcuts_register', { shortcut }),
  showTrayMini: (): Promise<boolean> => invoke('show_tray_mini'),
  showMenubarMini: (): Promise<boolean> => invoke('show_menubar_mini'),
}
