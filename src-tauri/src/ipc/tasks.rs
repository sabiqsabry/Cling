use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tauri::State;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub list_id: String,
    pub title: String,
    pub description: Option<String>,
    pub priority: Option<i32>,
    pub status: String,
    pub due_at: Option<String>,
    pub start_at: Option<String>,
    pub end_at: Option<String>,
    pub duration_min: Option<i32>,
    pub recurrence_rrule: Option<String>,
    pub estimate_pomos: Option<i32>,
    pub tags: Option<Vec<String>>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateTaskParams {
    pub list_id: String,
    pub title: String,
    pub description: Option<String>,
    pub priority: Option<i32>,
    pub start_at: Option<String>,
    pub end_at: Option<String>,
    pub all_day: Option<bool>,
    pub duration_min: Option<i32>,
    pub recurrence_rrule: Option<String>,
    pub status: Option<String>,
    pub estimate_pomos: Option<i32>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTaskParams {
    pub id: String,
    pub list_id: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub priority: Option<i32>,
    pub start_at: Option<String>,
    pub end_at: Option<String>,
    pub all_day: Option<bool>,
    pub slug: Option<i32>,
    pub recurrence_rrule: Option<String>,
    pub status: Option<String>,
    pub estimate_pomos: Option<i32>,
    pub tags: Option<Vec<String>>,
}

#[tauri::command]
pub async fn tasks_create(
    params: CreateTaskParams,
    pool: State<'_, SqlitePool>,
) -> Result<Task, String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    
    let tags_json = match params.tags {
        Some(tags) => serde_json::to_string(&tags).unwrap_or_else(|_| "[]".to_string()),
        None => "[]".to_string(),
    };

    sqlx::query!(
        r#"
        INSERT INTO tasks (
            id, list_id, title, description, priority, status,
            due_at, start_at, end_at, duration_min, recurrence_rrule,
            estimate_pomos, tags, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
        id,
        params.list_id,
        params.title,
        params.description,
        params.priority,
        params.status.unwrap_or_else(|| "todo".to_string()),
        params.start_at,
        params.end_at,
        params.duration_min,
        params.recurrence_rrule,
        params.estimate_pomos,
        tags_json,
        now,
        now
    )
    .execute(&*pool)
    .await
    .map_err(|e| format!("Failed to create task: {}", e))?;

    // Return the created task
    tasks_get(&id, pool).await
}

#[tauri::command]
pub async fn tasks_get(
    id: &str,
    pool: State<'_, SqlitePool>,
) -> Result<Task, String> {
    let row = sqlx::query!(
        r#"
        SELECT * FROM tasks WHERE id = ?
        "#,
        id
    )
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("Task not found: {}", e))?;

    let tags: Vec<String> = serde_json::from_str(&row.tags.unwrap_or_else(|| "[]".to_string()))
        .unwrap_or_else(|_| vec![]);

    Ok(Task {
        id: row.id,
        list_id: row.list_id,
        title: row.title,
        description: row.description,
        priority: row.priority,
        status: row.status,
        due_at: row.due_at,
        start_at: row.start_at,
        end_at: row.end_at,
        duration_min: row.duration_min,
        recurrence_rrule: row.recurrence_rrule,
        estimate_pomos: row.estimate_pomos,
        tags: Some(tags),
        created_at: row.created_at,
        updated_at: row.updated_at,
    })
}

#[tauri::command]
pub async fn tasks_update(
    params: UpdateTaskParams,
    pool: State<'_, SqlitePool>,
) -> Result<Task, String> {
    let now = Utc::now().to_rfc3339();
    
    let tags_json = match params.tags {
        Some(tags) => serde_json::to_string(&tags).unwrap_or_else(|_| "[]".to_string()),
        None => None,
    };

    sqlx::query!(
        r#"
        UPDATE tasks SET 
            list_id = COALESCE(?, list_id),
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            priority = COALESCE(?, priority),
            status = COALESCE(?, status),
            start_at = COALESCE(?, start_at),
            end_at = COALESCE(?, end_at),
            duration_min = COALESCE(?, duration_min),
            recurrence_rrule = COALESCE(?, recurrence_rrule),
            estimate_pomos = COALESCE(?, estimate_pomos),
            tags = COALESCE(?, tags),
            updated_at = ?
        WHERE id = ?
        "#,
        params.list_id,
        params.title,
        params.description,
        params.priority,
        params.status,
        params.start_at,
        params.end_at,
        params.duration_min,
        params.recurrence_rrule,
        params.estimate_pomos,
        tags_json,
        now,
        params.id
    )
    .execute(&*pool)
    .await
    .map_err(|e| format!("Failed to update task: {}", e))?;

    tasks_get(&params.id, pool).await
}

#[tauri::command]
pub async fn tasks_delete(
    id: &str,
    pool: State<'_, SqlitePool>,
) -> Result<bool, String> {
    sqlx::query!(
        r#"
        DELETE FROM tasks WHERE id = ?
        "#,
        id
    )
    .execute(&*pool)
    .await
    .map_err(|e| format!("Failed to delete task: {}", e))?;

    Ok(true)
}

#[tauri::command]
pub async fn tasks_list(
    pool: State<'_, SqlitePool>,
) -> Result<Vec<Task>, String> {
    let rows = sqlx::query!(
        r#"
        SELECT * FROM tasks ORDER BY created_at DESC
        "#
    )
    .fetch_all(&*pool)
    .await
    .map_err(|e| format!("Failed to fetch tasks: {}", e))?;

    let tasks = rows
        .into_iter()
        .map(|row| {
            let tags: Vec<String> = serde_json::from_str(&row.tags.unwrap_or_else(|| "[]".to_string()))
                .unwrap_or_else(|_| vec![]);

            Task {
                id: row.id,
                list_id: row.list_id,
                title: row.title,
                description: row.description,
                priority: row.priority,
                status: row.status,
                due_at: row.due_at,
                start_at: row.start_at,
                end_at: row.end_at,
                duration_min: row.duration_min,
                recurrence_rrule: row.recurrence_rrule,
                estimate_pomos: row.estimate_pomos,
                tags: Some(tags),
                created_at: row.created_at,
                updated_at: row.updated_at,
            }
        })
        .collect();

    Ok(tasks)
}

#[tauri::command]
pub async fn tasks_search(
    query: &str,
    pool: State<'_, SqlitePool>,
) -> Result<Vec<Task>, String> {
    let search_pattern = format!("%{}%", query);
    
    let rows = sqlx::query!(
        r#"
        SELECT * FROM tasks 
        WHERE title LIKE ? OR description LIKE ?
        ORDER BY created_at DESC
        "#,
        search_pattern,
        search_pattern
    )
    .fetch_all(&*pool)
    .await
    .map_err(|e| format!("Failed to search tasks: {}", e))?;

    let tasks = rows
        .into_iter()
        .map(|row| {
            let tags: Vec<String> = serde_json::from_str(&row.tags.unwrap_or_else(|| "[]".to_string()))
                .unwrap_or_else(|_| vec![]);

            Task {
                id: row.id,
                list_id: row.list_id,
                title: row.title,
                description: row.description,
                priority: row.priority,
                status: row.status,
                due_at: row.due_at,
                start_at: row.start_at,
                end_at: row.end_at,
                duration_min: row.duration_min,
                recurrence_rrule: row.recurrence_rrule,
                estimate_pomos: row.estimate_pomos,
                tags: Some(tags),
                created_at: row.created_at,
                updated_at: row.updated_at,
            }
        })
        .collect();

    Ok(tasks)
}