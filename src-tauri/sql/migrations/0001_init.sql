-- Cling Database Schema
-- Core tables for task management with workspace support

-- Workspaces (for future multi-user support)
CREATE TABLE workspaces (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Workspace memberships (for future collaboration)
CREATE TABLE memberships (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Folders to organize lists
CREATE TABLE folders (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    ord INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Lists (like "Inbox", "Sprint", "Personal")
CREATE TABLE lists (
    id TEXT PRIMARY KEY,
    folder_id TEXT,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    ord INTEGER DEFAULT 0,
    is_shared BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Tasks - the main entity
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    list_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 4, -- 1=P1, 2=P2, 3=P3, 4=P4
    start_at DATETIME,
    end_at DATETIME,
    all_day BOOLEAN DEFAULT FALSE,
    duration_min INTEGER, -- estimated duration in minutes
    recurrence_rrule TEXT, -- RRULE string for recurring tasks
    status TEXT DEFAULT 'todo', -- todo, in-progress, done
    estimate_pomos INTEGER DEFAULT 1, -- estimated pomodoros
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);

-- Checklist items for tasks
CREATE TABLE checklist_items (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    title TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    reminder_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Tags for categorization
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6b7280',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    UNIQUE(workspace_id, name)
);

-- Many-to-many relationship between tasks and tags
CREATE TABLE task_tags (
    task_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Comments on tasks
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- File attachments
CREATE TABLE attachments (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    path TEXT NOT NULL, -- relative path in app data directory
    mime TEXT NOT NULL,
    bytes INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Habits for habit tracking
CREATE TABLE habits (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    title TEXT NOT NULL,
    schedule_json TEXT NOT NULL, -- JSON: {frequency: "daily"/"weekly", days: [1,2,3,4,5]}
    streak INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Habit completion logs
CREATE TABLE habit_logs (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    date DATE NOT NULL,
    value INTEGER DEFAULT 1, -- completion value (1 for done, 0 for skipped, etc.)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE(habit_id, date)
);

-- Focus/Pomodoro sessions
CREATE TABLE focus_sessions (
    id TEXT PRIMARY KEY,
    task_id TEXT, -- optional link to task
    started_at DATETIME NOT NULL,
    duration_sec INTEGER NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    noise_type TEXT, -- white-noise, nature, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- Activity history for audit trail
CREATE TABLE history (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'task', 'list', 'tag', etc.
    entity_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    diff_json TEXT NOT NULL, -- JSON diff of changes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sync log for future cloud sync
CREATE TABLE sync_log (
    id TEXT PRIMARY KEY,
    entity_table TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    op TEXT NOT NULL, -- 'create', 'update', 'delete'
    version INTEGER DEFAULT 1,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
