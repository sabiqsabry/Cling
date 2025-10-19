-- Performance indexes for Cling database

-- Task indexes for common queries
CREATE INDEX idx_tasks_list_id ON tasks(list_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_start_at ON tasks(start_at);
CREATE INDEX idx_tasks_end_at ON tasks(end_at);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_updated_at ON tasks(updated_at);
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at);

-- Composite indexes for common task queries
CREATE INDEX idx_tasks_list_status ON tasks(list_id, status);
CREATE INDEX idx_tasks_status_start_at ON tasks(status, start_at);
CREATE INDEX idx_tasks_list_created_at ON tasks(list_id, created_at);

-- List indexes
CREATE INDEX idx_lists_workspace_id ON lists(workspace_id);
CREATE INDEX idx_lists_folder_id ON lists(folder_id);

-- Tag indexes
CREATE INDEX idx_tags_workspace_id ON tags(workspace_id);
CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);

-- Comment indexes
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Attachment indexes
CREATE INDEX idx_attachments_task_id ON attachments(task_id);

-- Habit indexes
CREATE INDEX idx_habits_workspace_id ON habits(workspace_id);
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, date);

-- Focus session indexes
CREATE INDEX idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX idx_focus_sessions_started_at ON focus_sessions(started_at);
CREATE INDEX idx_focus_sessions_is_break ON focus_sessions(is_break);

-- History indexes
CREATE INDEX idx_history_entity ON history(entity_type, entity_id);
CREATE INDEX idx_history_created_at ON history(created_at);

-- Sync log indexes
CREATE INDEX idx_sync_log_entity ON sync_log(entity_table, entity_id);
CREATE INDEX idx_sync_log_changed_at ON sync_log(changed_at);

-- Full-text search on tasks
CREATE VIRTUAL TABLE tasks_fts USING fts5(
    title, 
    description,
    content='tasks',
    content_rowid='rowid'
);

-- Trigger to keep FTS in sync with tasks table
CREATE TRIGGER tasks_fts_insert AFTER INSERT ON tasks BEGIN
    INSERT INTO tasks_fts(rowid, title, description) 
    VALUES (new.rowid, new.title, COALESCE(new.description, ''));
END;

CREATE TRIGGER tasks_fts_delete AFTER DELETE ON tasks BEGIN
    INSERT INTO tasks_fts(tasks_fts, rowid, title, description) 
    VALUES('delete', old.rowid, old.title, COALESCE(old.description, ''));
END;

CREATE TRIGGER tasks_fts_update AFTER UPDATE ON tasks BEGIN
    INSERT INTO tasks_fts(tasks_fts, rowid, title, description) 
    VALUES('delete', old.rowid, old.title, COALESCE(old.description, ''));
    INSERT INTO tasks_fts(rowid, title, description) 
    VALUES (new.rowid, new.title, COALESCE(new.description, ''));
END;
