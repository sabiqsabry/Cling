-- Row Level Security (RLS) Policies for Cling
-- These policies ensure users can only access their own data

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- WORKSPACE POLICIES
-- ============================================================================

-- Users can view their own workspaces
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (auth.uid() = owner_id);

-- Users can create workspaces
CREATE POLICY "Users can create workspaces" ON workspaces
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own workspaces
CREATE POLICY "Users can update own workspaces" ON workspaces
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can delete their own workspaces
CREATE POLICY "Users can delete own workspaces" ON workspaces
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================================
-- MEMBERSHIP POLICIES
-- ============================================================================

-- Users can view memberships in workspaces they own or are members of
CREATE POLICY "Users can view relevant memberships" ON memberships
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Workspace owners can manage memberships
CREATE POLICY "Workspace owners can manage memberships" ON memberships
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- FOLDER POLICIES
-- ============================================================================

-- Users can view folders in their workspaces
CREATE POLICY "Users can view folders in own workspaces" ON folders
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Users can manage folders in workspaces they own
CREATE POLICY "Users can manage folders in own workspaces" ON folders
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- LIST POLICIES
-- ============================================================================

-- Users can view lists in their workspaces
CREATE POLICY "Users can view lists in own workspaces" ON lists
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Users can manage lists in workspaces they own
CREATE POLICY "Users can manage lists in own workspaces" ON lists
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- TASK POLICIES
-- ============================================================================

-- Users can view tasks in their workspaces
CREATE POLICY "Users can view tasks in own workspaces" ON tasks
  FOR SELECT USING (
    list_id IN (
      SELECT id FROM lists WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
      )
    )
  );

-- Users can manage tasks in workspaces they own
CREATE POLICY "Users can manage tasks in own workspaces" ON tasks
  FOR ALL USING (
    list_id IN (
      SELECT id FROM lists WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- CHECKLIST ITEM POLICIES
-- ============================================================================

-- Users can view checklist items for tasks they can access
CREATE POLICY "Users can view checklist items" ON checklist_items
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
          UNION
          SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Users can manage checklist items for tasks they can access
CREATE POLICY "Users can manage checklist items" ON checklist_items
  FOR ALL USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- TAG POLICIES
-- ============================================================================

-- Users can view tags in their workspaces
CREATE POLICY "Users can view tags in own workspaces" ON tags
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Users can manage tags in workspaces they own
CREATE POLICY "Users can manage tags in own workspaces" ON tags
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- TASK TAG POLICIES
-- ============================================================================

-- Users can view task tags for tasks they can access
CREATE POLICY "Users can view task tags" ON task_tags
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
          UNION
          SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Users can manage task tags for tasks they can access
CREATE POLICY "Users can manage task tags" ON task_tags
  FOR ALL USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- COMMENT POLICIES
-- ============================================================================

-- Users can view comments for tasks they can access
CREATE POLICY "Users can view comments" ON comments
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
          UNION
          SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Users can manage comments for tasks they can access
CREATE POLICY "Users can manage comments" ON comments
  FOR ALL USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- ATTACHMENT POLICIES
-- ============================================================================

-- Users can view attachments for tasks they can access
CREATE POLICY "Users can view attachments" ON attachments
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
          UNION
          SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Users can manage attachments for tasks they can access
CREATE POLICY "Users can manage attachments" ON attachments
  FOR ALL USING (
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- HABIT POLICIES
-- ============================================================================

-- Users can view habits in their workspaces
CREATE POLICY "Users can view habits in own workspaces" ON habits
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Users can manage habits in workspaces they own
CREATE POLICY "Users can manage habits in own workspaces" ON habits
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- HABIT LOG POLICIES
-- ============================================================================

-- Users can view habit logs for habits they can access
CREATE POLICY "Users can view habit logs" ON habit_logs
  FOR SELECT USING (
    habit_id IN (
      SELECT id FROM habits WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
      )
    )
  );

-- Users can manage habit logs for habits they can access
CREATE POLICY "Users can manage habit logs" ON habit_logs
  FOR ALL USING (
    habit_id IN (
      SELECT id FROM habits WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- FOCUS SESSION POLICIES
-- ============================================================================

-- Users can view focus sessions for tasks they can access (or all if no task)
CREATE POLICY "Users can view focus sessions" ON focus_sessions
  FOR SELECT USING (
    task_id IS NULL OR
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
          UNION
          SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Users can manage focus sessions for tasks they can access
CREATE POLICY "Users can manage focus sessions" ON focus_sessions
  FOR ALL USING (
    task_id IS NULL OR
    task_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- HISTORY POLICIES
-- ============================================================================

-- Users can view history for entities they can access
CREATE POLICY "Users can view history" ON history
  FOR SELECT USING (
    (entity_type = 'task' AND entity_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
          UNION
          SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
        )
      )
    )) OR
    (entity_type = 'list' AND entity_id IN (
      SELECT id FROM lists WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
      )
    ))
  );

-- Users can create history entries for entities they can access
CREATE POLICY "Users can create history" ON history
  FOR INSERT WITH CHECK (
    (entity_type = 'task' AND entity_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
      )
    )) OR
    (entity_type = 'list' AND entity_id IN (
      SELECT id FROM lists WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
      )
    ))
  );

-- ============================================================================
-- SYNC LOG POLICIES
-- ============================================================================

-- Users can view sync logs for entities they can access
CREATE POLICY "Users can view sync logs" ON sync_log
  FOR SELECT USING (
    (entity_table = 'tasks' AND entity_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
          UNION
          SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
        )
      )
    )) OR
    (entity_table = 'lists' AND entity_id IN (
      SELECT id FROM lists WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
      )
    ))
  );

-- Users can create sync log entries for entities they can access
CREATE POLICY "Users can create sync logs" ON sync_log
  FOR INSERT WITH CHECK (
    (entity_table = 'tasks' AND entity_id IN (
      SELECT id FROM tasks WHERE list_id IN (
        SELECT id FROM lists WHERE workspace_id IN (
          SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
      )
    )) OR
    (entity_table = 'lists' AND entity_id IN (
      SELECT id FROM lists WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
      )
    ))
  );
