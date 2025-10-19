use crate::db::{get_pool, generate_id, Result};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize)]
pub struct TimeBlock {
    pub id: String,
    pub task_id: String,
    pub start_time: String,
    pub end_time: String,
    pub created_at: String,
    pub updated_at: String,
    pub is_synced: bool,
    pub local_updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CalendarEvent {
    pub id: String,
    pub title: String,
    pub start_time: String,
    pub end_time: Option<String>,
    pub all_day: bool,
    pub task_id: Option<String>,
    pub color: Option<String>,
}

#[tauri::command]
pub async fn calendar_timeblock(
    app_handle: AppHandle,
    task_id: String,
    start_time: String,
    end_time: String,
) -> Result<TimeBlock> {
    let pool = get_pool(&app_handle)?;
    let id = generate_id();
    let now = chrono::Utc::now().to_rfc3339();

    let new_timeblock = sqlx::query_as!(
        TimeBlock,
        r#"
        INSERT INTO time_blocks (id, task_id, start_time, end_time, created_at, updated_at, local_updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id, task_id, start_time, end_time, created_at, updated_at, is_synced, local_updated_at
        "#,
        id,
        task_id,
        start_time,
        end_time,
        now,
        now,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(new_timeblock)
}

#[tauri::command]
pub async fn calendar_events(
    app_handle: AppHandle,
    start_date: String,
    end_date: String,
) -> Result<Vec<CalendarEvent>> {
    let pool = get_pool(&app_handle)?;

    let events = sqlx::query_as!(
        CalendarEvent,
        r#"
        SELECT 
            t.id,
            t.title,
            t.start_at as start_time,
            t.end_at as end_time,
            t.all_day,
            t.id as task_id,
            CASE 
                WHEN t.priority = 1 THEN '#ef4444'
                WHEN t.priority = 2 THEN '#f97316'
                WHEN t.priority = 3 THEN '#3b82f6'
                ELSE '#6b7280'
            END as color
        FROM tasks t
        WHERE t.deleted_at IS NULL 
        AND t.start_at IS NOT NULL
        AND t.start_at >= ? 
        AND t.start_at <= ?
        ORDER BY t.start_at ASC
        "#,
        start_date,
        end_date
    )
    .fetch_all(pool)
    .await?;

    Ok(events)
}

#[tauri::command]
pub async fn calendar_events_by_task(app_handle: AppHandle, task_id: String) -> Result<Vec<TimeBlock>> {
    let pool = get_pool(&app_handle)?;

    let timeblocks = sqlx::query_as!(
        TimeBlock,
        r#"SELECT id, task_id, start_time, end_time, created_at, updated_at, is_synced, local_updated_at FROM time_blocks WHERE task_id = ? ORDER BY start_time ASC"#,
        task_id
    )
    .fetch_all(pool)
    .await?;

    Ok(timeblocks)
}

#[tauri::command]
pub async fn calendar_delete_timeblock(app_handle: AppHandle, timeblock_id: String) -> Result<bool> {
    let pool = get_pool(&app_handle)?;

    let rows_affected = sqlx::query!(
        r#"DELETE FROM time_blocks WHERE id = ?"#,
        timeblock_id
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected > 0)
}