import { z } from 'zod'

// Base schemas
export const WorkspaceSchema = z.object({
  id: z.string(),
  owner_id: z.string(),
  name: z.string(),
  created_at: z.string(),
})

export const ListSchema = z.object({
  id: z.string(),
  folder_id: z.string().optional(),
  workspace_id: z.string(),
  name: z.string(),
  color: z.string().default('#3b82f6'),
  ord: z.number().default(0),
  is_shared: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
})

export const TaskSchema = z.object({
  id: z.string(),
  list_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.number().min(1).max(4).default(4),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  all_day: z.boolean().default(false),
  duration_min: z.number().optional(),
  recurrence_rrule: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  estimate_pomos: z.number().default(1),
  created_at: z.string(),
  updated_at: z.string(),
  completed_at: z.string().optional(),
})

export const TagSchema = z.object({
  id: z.string(),
  workspace_id: z.string(),
  name: z.string(),
  color: z.string().default('#6b7280'),
  created_at: z.string(),
})

export const HabitSchema = z.object({
  id: z.string(),
  workspace_id: z.string(),
  title: z.string(),
  schedule_json: z.string(),
  streak: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
})

export const FocusSessionSchema = z.object({
  id: z.string(),
  task_id: z.string().optional(),
  started_at: z.string(),
  duration_sec: z.number(),
  is_break: z.boolean().default(false),
  noise_type: z.string().optional(),
  created_at: z.string(),
})

export const CommentSchema = z.object({
  id: z.string(),
  task_id: z.string(),
  author_id: z.string(),
  body: z.string(),
  created_at: z.string(),
})

export const AttachmentSchema = z.object({
  id: z.string(),
  task_id: z.string(),
  path: z.string(),
  mime: z.string(),
  bytes: z.number(),
  created_at: z.string(),
})

// Input schemas for creating/updating
export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  list_id: z.string(),
  priority: z.number().min(1).max(4).optional(),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  all_day: z.boolean().optional(),
  duration_min: z.number().optional(),
  recurrence_rrule: z.string().optional(),
  estimate_pomos: z.number().optional(),
  tags: z.array(z.string()).optional(),
})

export const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.number().min(1).max(4).optional(),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  all_day: z.boolean().optional(),
  duration_min: z.number().optional(),
  recurrence_rrule: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  estimate_pomos: z.number().optional(),
  tags: z.array(z.string()).optional(),
})

export const CreateListSchema = z.object({
  name: z.string().min(1),
  workspace_id: z.string(),
  color: z.string().optional(),
})

export const CreateTagSchema = z.object({
  name: z.string().min(1),
  workspace_id: z.string(),
  color: z.string().optional(),
})

export const CreateHabitSchema = z.object({
  title: z.string().min(1),
  schedule_json: z.string(),
})

export const LogHabitSchema = z.object({
  habit_id: z.string(),
  date: z.string(),
  value: z.number().default(1),
})

// Extended schemas with relations
export const TaskWithRelationsSchema = TaskSchema.extend({
  list: ListSchema.optional(),
  tags: z.array(TagSchema).optional(),
  comments: z.array(CommentSchema).optional(),
  attachments: z.array(AttachmentSchema).optional(),
})

export const ListWithTasksSchema = ListSchema.extend({
  tasks: z.array(TaskSchema).optional(),
  task_count: z.number().optional(),
})

// Type exports
export type Workspace = z.infer<typeof WorkspaceSchema>
export type List = z.infer<typeof ListSchema>
export type Task = z.infer<typeof TaskSchema>
export type Tag = z.infer<typeof TagSchema>
export type Habit = z.infer<typeof HabitSchema>
export type FocusSession = z.infer<typeof FocusSessionSchema>
export type Comment = z.infer<typeof CommentSchema>
export type Attachment = z.infer<typeof AttachmentSchema>

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
export type CreateListInput = z.infer<typeof CreateListSchema>
export type CreateTagInput = z.infer<typeof CreateTagSchema>
export type CreateHabitInput = z.infer<typeof CreateHabitSchema>
export type LogHabitInput = z.infer<typeof LogHabitSchema>

export type TaskWithRelations = z.infer<typeof TaskWithRelationsSchema>
export type ListWithTasks = z.infer<typeof ListWithTasksSchema>

// Priority levels
export const PRIORITY_LEVELS = {
  1: { label: 'P1', color: 'text-red-600', bgColor: 'bg-red-100' },
  2: { label: 'P2', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  3: { label: 'P3', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  4: { label: 'P4', color: 'text-gray-600', bgColor: 'bg-gray-100' },
} as const

// Status levels
export const STATUS_LEVELS = {
  todo: { label: 'To Do', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  done: { label: 'Done', color: 'text-green-600', bgColor: 'bg-green-100' },
} as const
