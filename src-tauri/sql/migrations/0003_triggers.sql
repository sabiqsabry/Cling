-- Triggers for automatic timestamp updates and sync logging

-- Update updated_at timestamp on tasks
CREATE TRIGGER update_tasks_updated_at 
    AFTER UPDATE ON tasks
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE tasks 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Update updated_at timestamp on lists
CREATE TRIGGER update_lists_updated_at 
    AFTER UPDATE ON lists
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE lists 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Update updated_at timestamp on habits
CREATE TRIGGER update_habits_updated_at 
    AFTER UPDATE ON habits
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE habits 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Log task changes to sync_log
CREATE TRIGGER log_task_changes_insert
    AFTER INSERT ON tasks
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'tasks', NEW.id, 'create', 1, CURRENT_TIMESTAMP);
END;

CREATE TRIGGER log_task_changes_update
    AFTER UPDATE ON tasks
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'tasks', NEW.id, 'update', 
            (SELECT COALESCE(MAX(version), 0) + 1 FROM sync_log WHERE entity_table = 'tasks' AND entity_id = NEW.id),
            CURRENT_TIMESTAMP);
END;

CREATE TRIGGER log_task_changes_delete
    AFTER DELETE ON tasks
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'tasks', OLD.id, 'delete', 
            (SELECT COALESCE(MAX(version), 0) + 1 FROM sync_log WHERE entity_table = 'tasks' AND entity_id = OLD.id),
            CURRENT_TIMESTAMP);
END;

-- Log list changes to sync_log
CREATE TRIGGER log_list_changes_insert
    AFTER INSERT ON lists
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'lists', NEW.id, 'create', 1, CURRENT_TIMESTAMP);
END;

CREATE TRIGGER log_list_changes_update
    AFTER UPDATE ON lists
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'lists', NEW.id, 'update', 
            (SELECT COALESCE(MAX(version), 0) + 1 FROM sync_log WHERE entity_table = 'lists' AND entity_id = NEW.id),
            CURRENT_TIMESTAMP);
END;

CREATE TRIGGER log_list_changes_delete
    AFTER DELETE ON lists
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'lists', OLD.id, 'delete', 
            (SELECT COALESCE(MAX(version), 0) + 1 FROM sync_log WHERE entity_table = 'lists' AND entity_id = OLD.id),
            CURRENT_TIMESTAMP);
END;

-- Log tag changes to sync_log
CREATE TRIGGER log_tag_changes_insert
    AFTER INSERT ON tags
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'tags', NEW.id, 'create', 1, CURRENT_TIMESTAMP);
END;

CREATE TRIGGER log_tag_changes_update
    AFTER UPDATE ON tags
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'tags', NEW.id, 'update', 
            (SELECT COALESCE(MAX(version), 0) + 1 FROM sync_log WHERE entity_table = 'tags' AND entity_id = NEW.id),
            CURRENT_TIMESTAMP);
END;

CREATE TRIGGER log_tag_changes_delete
    AFTER DELETE ON tags
BEGIN
    INSERT INTO sync_log (id, entity_table, entity_id, op, version, changed_at)
    VALUES (lower(hex(randomblob(16))), 'tags', OLD.id, 'delete', 
            (SELECT COALESCE(MAX(version), 0) + 1 FROM sync_log WHERE entity_table = 'tags' AND entity_id = OLD.id),
            CURRENT_TIMESTAMP);
END;

-- Auto-set completed_at when task status changes to 'done'
CREATE TRIGGER set_task_completed_at
    AFTER UPDATE ON tasks
    WHEN NEW.status = 'done' AND (OLD.status != 'done' OR OLD.completed_at IS NULL)
BEGIN
    UPDATE tasks 
    SET completed_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Clear completed_at when task status changes away from 'done'
CREATE TRIGGER clear_task_completed_at
    AFTER UPDATE ON tasks
    WHEN NEW.status != 'done' AND OLD.status = 'done'
BEGIN
    UPDATE tasks 
    SET completed_at = NULL 
    WHERE id = NEW.id;
END;
