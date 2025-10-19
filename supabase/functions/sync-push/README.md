# Sync Push Function

This Edge Function handles pushing local changes from Cling to Supabase.

## Endpoint

```
POST /functions/v1/sync-push
```

## Authentication

Requires a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Request Payload

```json
{
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
      "localId": "uuid",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "workspace_id": "uuid",
  "client_version": "1.0.0"
}
```

### Change Object Properties

- **table**: The table name (tasks, lists, tags, habits, etc.)
- **operation**: The operation type (create, update, delete)
- **data**: The entity data (varies by table)
- **localId**: Local identifier for conflict resolution
- **timestamp**: When the change was made locally

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "results": [
    {
      "localId": "uuid",
      "remoteId": "uuid",
      "operation": "create",
      "conflict": false,
      "data": {
        // Updated entity data with remote ID
      }
    }
  ],
  "conflicts": [],
  "watermark": "2024-01-01T00:00:00Z"
}
```

### Conflict Response (200)

```json
{
  "success": true,
  "results": [
    {
      "localId": "uuid",
      "remoteId": "uuid",
      "operation": "update",
      "conflict": true,
      "conflict_type": "field_level|entity_level",
      "local_data": {
        // Local version of the data
      },
      "remote_data": {
        // Remote version of the data
      },
      "merged_data": {
        // Automatically merged data (if possible)
      }
    }
  ],
  "conflicts": [
    {
      "entity_id": "uuid",
      "conflict_type": "field_level",
      "field": "title",
      "local_value": "Local title",
      "remote_value": "Remote title",
      "requires_manual_resolution": false
    }
  ],
  "watermark": "2024-01-01T00:00:00Z"
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

## Conflict Resolution

### Automatic Resolution

The function attempts automatic conflict resolution using these strategies:

1. **Last Writer Wins**: For simple fields, the most recent `updated_at` timestamp wins
2. **Field-Level Merging**: For text fields, merge with conflict markers
3. **Additive Changes**: For arrays and sets, merge additions

### Manual Resolution Required

Some conflicts require manual resolution:

- Complex text field conflicts
- Structural changes that can't be merged
- Permission conflicts

## Error Codes

- `INVALID_PAYLOAD`: Request payload is malformed
- `UNAUTHORIZED`: Invalid or missing authentication
- `WORKSPACE_NOT_FOUND`: Workspace doesn't exist or user lacks access
- `CONFLICT_RESOLUTION_FAILED`: Automatic conflict resolution failed
- `DATABASE_ERROR`: Database operation failed
- `VALIDATION_ERROR`: Data validation failed

## Rate Limiting

- Maximum 100 changes per request
- Maximum 10 requests per minute per user
- Maximum 1000 changes per hour per workspace

## Implementation Notes

1. **Transaction Safety**: All changes are processed in a single transaction
2. **Idempotency**: Duplicate requests are handled gracefully
3. **Validation**: All data is validated against the schema
4. **Audit Trail**: All changes are logged for debugging
5. **Performance**: Bulk operations are optimized for large datasets

## Example Usage

```javascript
const response = await fetch('/functions/v1/sync-push', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    changes: [
      {
        table: 'tasks',
        operation: 'create',
        data: {
          list_id: 'list-uuid',
          title: 'New task',
          priority: 2,
          status: 'todo',
        },
        localId: 'local-uuid',
        timestamp: new Date().toISOString(),
      },
    ],
    workspace_id: 'workspace-uuid',
    client_version: '1.0.0',
  }),
})

const result = await response.json()
if (result.success) {
  // Handle successful sync
  result.results.forEach((change) => {
    console.log(`Synced ${change.operation} for ${change.localId}`)
  })

  // Handle conflicts if any
  if (result.conflicts.length > 0) {
    console.log('Conflicts detected:', result.conflicts)
  }
} else {
  console.error('Sync failed:', result.error)
}
```
