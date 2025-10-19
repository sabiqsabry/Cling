# Supabase Setup for Cling

This guide will help you set up Supabase for cloud synchronization with Cling. **Note**: Cling works perfectly without Supabase in local-only mode.

## 🚀 Quick Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

### 3. Initialize Supabase in Cling

```bash
cd /path/to/cling
supabase init
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Set Up Database Schema

```bash
# Copy and adapt migrations from SQLite to PostgreSQL
supabase db push

# Apply Row Level Security policies
supabase db push --include-policies
```

### 5. Deploy Edge Functions

```bash
# Deploy sync functions
supabase functions deploy sync-push
supabase functions deploy sync-pull
```

### 6. Configure Environment

Create `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📊 Database Schema

### Core Tables

The Supabase schema mirrors the SQLite schema with PostgreSQL adaptations:

```sql
-- Workspaces
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lists
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  ord INTEGER DEFAULT 0,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 4 CHECK (priority BETWEEN 1 AND 4),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT FALSE,
  duration_min INTEGER,
  recurrence_rrule TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  estimate_pomos INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, name)
);

-- Task Tags (many-to-many)
CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (task_id, tag_id)
);

-- Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  schedule_json JSONB NOT NULL,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit Logs
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Focus Sessions
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  duration_sec INTEGER NOT NULL,
  is_break BOOLEAN DEFAULT FALSE,
  noise_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Row Level Security (RLS)

### Policies

```sql
-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Workspace policies
CREATE POLICY "Users can view their own workspaces" ON workspaces
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create workspaces" ON workspaces
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- List policies
CREATE POLICY "Users can view lists in their workspaces" ON lists
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- Task policies
CREATE POLICY "Users can view tasks in their workspaces" ON tasks
  FOR SELECT USING (
    list_id IN (
      SELECT id FROM lists WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
      )
    )
  );
```

## ⚡ Edge Functions

### Sync Push Function

**Purpose**: Push local changes to Supabase
**Endpoint**: `/functions/v1/sync-push`

**Payload**:

```json
{
  "changes": [
    {
      "table": "tasks",
      "operation": "create|update|delete",
      "data": { ... },
      "localId": "uuid",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Sync Pull Function

**Purpose**: Pull remote changes from Supabase
**Endpoint**: `/functions/v1/sync-pull`

**Query Parameters**:

- `since`: ISO timestamp for incremental sync
- `workspace_id`: Workspace to sync

**Response**:

```json
{
  "changes": [
    {
      "table": "tasks",
      "operation": "create|update|delete",
      "data": { ... },
      "remoteId": "uuid",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "watermark": "2024-01-01T00:00:00Z"
}
```

## 🔄 Sync Strategy

### Conflict Resolution

1. **Last Writer Wins**: Most recent `updated_at` timestamp wins
2. **Field-Level Merging**: For text fields, merge with conflict markers
3. **Manual Resolution**: Complex conflicts require user intervention

### Sync Process

1. **Push Phase**:
   - Send local changes since last sync
   - Handle conflicts with server version
   - Update local sync watermark

2. **Pull Phase**:
   - Fetch remote changes since last sync
   - Apply changes to local database
   - Update local sync watermark

3. **Conflict Resolution**:
   - Detect conflicts during push
   - Apply resolution strategy
   - Notify user of manual conflicts

## 🛠️ Development

### Local Development

```bash
# Start Supabase locally
supabase start

# Run migrations
supabase db reset

# Test functions locally
supabase functions serve
```

### Testing Sync

```bash
# Test with local Supabase
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# Run Cling
pnpm tauri:dev
```

## 📊 Monitoring

### Database Monitoring

- Monitor query performance in Supabase dashboard
- Set up alerts for high CPU usage
- Track sync frequency and success rates

### Error Handling

- Log sync errors to Supabase logs
- Implement retry logic with exponential backoff
- Graceful degradation to offline mode

## 🔧 Troubleshooting

### Common Issues

**Connection Errors**:

- Check Supabase project status
- Verify API keys and URLs
- Check network connectivity

**Sync Conflicts**:

- Review conflict resolution logs
- Manually resolve complex conflicts
- Reset sync state if needed

**Performance Issues**:

- Optimize database queries
- Implement pagination for large datasets
- Use database indexes effectively

### Debug Mode

Enable debug logging:

```env
VITE_DEBUG_SYNC=true
VITE_DEBUG_SUPABASE=true
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

---

**Need help?** Check the [main Cling documentation](../README.md) or [open an issue](https://github.com/sabiqsabry/Cling/issues).
