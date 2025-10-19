# Sync Pull Function

This Edge Function handles pulling remote changes from Supabase to Cling.

## Endpoint

```
GET /functions/v1/sync-pull
```

## Authentication

Requires a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Query Parameters

| Parameter      | Type       | Required | Description                                 |
| -------------- | ---------- | -------- | ------------------------------------------- |
| `since`        | ISO string | Yes      | Timestamp for incremental sync              |
| `workspace_id` | UUID       | Yes      | Workspace to sync                           |
| `tables`       | string[]   | No       | Specific tables to sync (default: all)      |
| `limit`        | number     | No       | Maximum changes per request (default: 1000) |

## Request Example

```
GET /functions/v1/sync-pull?since=2024-01-01T00:00:00Z&workspace_id=uuid&tables=tasks,lists&limit=500
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "changes": [
    {
      "table": "tasks",
      "operation": "create|update|delete",
      "data": {
        "id": "uuid",
        "list_id": "uuid",
        "title": "Task title",
        "description": "Task description",
        "priority": 1,
        "status": "todo",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      },
      "remoteId": "uuid",
      "timestamp": "2024-01-01T00:00:00Z",
      "version": 1
    }
  ],
  "watermark": "2024-01-01T00:00:00Z",
  "has_more": false,
  "total_changes": 1,
  "sync_info": {
    "workspace_id": "uuid",
    "tables_synced": ["tasks", "lists"],
    "sync_duration_ms": 150
  }
}
```

### Pagination Response (200)

When there are more changes available:

```json
{
  "success": true,
  "changes": [
    // ... changes array
  ],
  "watermark": "2024-01-01T00:00:00Z",
  "has_more": true,
  "total_changes": 2500,
  "next_cursor": "2024-01-01T00:00:00Z",
  "sync_info": {
    "workspace_id": "uuid",
    "tables_synced": ["tasks", "lists"],
    "sync_duration_ms": 150
  }
}
```

### Error Response (400/500)

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

## Change Object Properties

- **table**: The table name (tasks, lists, tags, habits, etc.)
- **operation**: The operation type (create, update, delete)
- **data**: The complete entity data
- **remoteId**: Remote identifier
- **timestamp**: When the change was made remotely
- **version**: Version number for conflict detection

## Pagination

When there are many changes, the response includes pagination information:

- **has_more**: Boolean indicating if more changes are available
- **next_cursor**: Timestamp to use for the next request
- **total_changes**: Total number of changes in this sync

To fetch the next page:

```
GET /functions/v1/sync-pull?since=2024-01-01T00:00:00Z&workspace_id=uuid&cursor=next_cursor_value
```

## Error Codes

- `INVALID_PARAMETERS`: Invalid query parameters
- `UNAUTHORIZED`: Invalid or missing authentication
- `WORKSPACE_NOT_FOUND`: Workspace doesn't exist or user lacks access
- `INVALID_TIMESTAMP`: Invalid `since` timestamp format
- `DATABASE_ERROR`: Database operation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limiting

- Maximum 1000 changes per request
- Maximum 10 requests per minute per user
- Maximum 10,000 changes per hour per workspace

## Filtering Options

### Table Filtering

Sync specific tables only:

```
GET /functions/v1/sync-pull?since=2024-01-01T00:00:00Z&workspace_id=uuid&tables=tasks,lists,tags
```

### Operation Filtering

Filter by operation type (planned for future):

```
GET /functions/v1/sync-pull?since=2024-01-01T00:00:00Z&workspace_id=uuid&operations=create,update
```

## Implementation Notes

1. **Incremental Sync**: Only returns changes since the provided timestamp
2. **Ordering**: Changes are returned in chronological order
3. **Consistency**: All changes for a single entity are included
4. **Performance**: Optimized queries with proper indexing
5. **Security**: RLS policies ensure users only see their own data

## Example Usage

```javascript
async function syncPull(since, workspaceId, token) {
  const params = new URLSearchParams({
    since: since,
    workspace_id: workspaceId,
    limit: '1000',
  })

  const response = await fetch(`/functions/v1/sync-pull?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()

  if (result.success) {
    // Process changes
    result.changes.forEach((change) => {
      console.log(
        `Received ${change.operation} for ${change.table}:${change.remoteId}`
      )
      // Apply change to local database
    })

    // Update local watermark
    const newWatermark = result.watermark

    // Check if more changes available
    if (result.has_more) {
      console.log('More changes available, continuing sync...')
      // Continue syncing with next_cursor
    }

    return newWatermark
  } else {
    console.error('Sync pull failed:', result.error)
    throw new Error(result.error)
  }
}

// Usage
try {
  const watermark = await syncPull(
    '2024-01-01T00:00:00Z',
    'workspace-uuid',
    'jwt-token'
  )
  console.log('Sync completed, new watermark:', watermark)
} catch (error) {
  console.error('Sync failed:', error)
}
```

## Full Sync Example

```javascript
async function fullSync(workspaceId, token) {
  let watermark = '1970-01-01T00:00:00Z' // Start from beginning
  let totalChanges = 0

  do {
    const result = await syncPull(watermark, workspaceId, token)

    if (result.success) {
      totalChanges += result.changes.length
      watermark = result.watermark

      console.log(`Synced ${result.changes.length} changes`)

      if (!result.has_more) {
        break
      }
    } else {
      throw new Error(`Sync failed: ${result.error}`)
    }
  } while (true)

  console.log(`Full sync completed: ${totalChanges} total changes`)
  return watermark
}
```
