use crate::db::{get_pool, generate_id, Result};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FocusSession {
    pub id: String,
    pub task_id: Option<String>,
    pub started_at: String,
    pub ended_at: Option<String>,
    pub duration_sec: i32,
    pub is_break: bool,
    pub created_at: String,
    pub updated_at: String,
    pub is_synced: bool,
    pub local_updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FocusStats {
    pub total_sessions: i64,
    pub total_work_time: i64,
    pub total_break_time: i64,
    pub average_session_length: f64,
    pub today_sessions: i64,
    pub today_work_time: i64,
}

#[tauri::command]
pub async fn focus_start(app_handle: AppHandle, task_id: Option<String>, duration_sec: i32) -> Result<FocusSession> {
    let pool = get_pool(&app_handle)?;
    let id = generate_id();
    let now = chrono::Utc::now().to_rfc3339();

    let new_session = sqlx::query_as!(
        FocusSession,
        r#"
        INSERT INTO focus_sessions (id, task_id, started_at, duration_sec, is_break, created_at, updated_at, local_updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id, task_id, started_at, ended_at, duration_sec, is_break, created_at, updated_at, is_synced, local_updated_at
        "#,
        id,
        task_id,
        now,
        duration_sec,
        false, // Default to work session
        now,
        now,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(new_session)
}

#[tauri::command]
pub async fn focus_stop(app_handle: AppHandle, session_id: String) -> Result<FocusSession> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let updated_session = sqlx::query_as!(
        FocusSession,
        r#"
        UPDATE focus_sessions
        SET ended_at = ?,
            updated_at = ?,
            local_updated_at = ?
        WHERE id = ?
        RETURNING id, task_id, started_at, ended_at, duration_sec, is_break, created_at, updated_at, is_synced, local_updated_at
        "#,
        now,
        now,
        now,
        session_id
    )
    .fetch_one(pool)
    .await?;

    Ok(updated_session)
}

#[tauri::command]
pub async fn focus_stats(app_handle: AppHandle) -> Result<FocusStats> {
    let pool = get_pool(&app_handle)?;
    let today = chrono::Utc::now().date_naive().format("%Y-%m-%d").to_string();

    // Get total stats
    let total_stats = sqlx::query!(
        r#"
        SELECT 
            COUNT(*) as total_sessions,
            SUM(CASE WHEN is_break = 0 THEN duration_sec ELSE 0 END) as total_work_time,
            SUM(CASE WHEN is_break = 1 THEN duration_sec ELSE 0 END) as total_break_time,
            AVG(duration_sec) as avg_duration
        FROM focus_sessions
        WHERE deleted_at IS NULL
        "#
    )
    .fetch_one(pool)
    .await?;

    // Get today's stats
    let today_stats = sqlx::query!(
        r#"
        SELECT 
            COUNT(*) as today_sessions,
            SUM(CASE WHEN is_break = 0 THEN duration_sec ELSE 0 END) as today_work_time
        FROM focus_sessions
        WHERE deleted_at IS NULL 
        AND DATE(started_at) = ?
        "#,
        today
    )
    .fetch_one(pool)
    .await?;

    Ok(FocusStats {
        total_sessions: total_stats.total_sessions.unwrap_or(0),
        total_work_time: total_stats.total_work_time.unwrap_or(0),
        total_break_time: total_stats.total_break_time.unwrap_or(0),
        average_session_length: total_stats.avg_duration.unwrap_or(0.0),
        today_sessions: today_stats.today_sessions.unwrap_or(0),
        today_work_time: today_stats.today_work_time.unwrap_or(0),
    })
}

#[tauri::command]
pub async fn focus_sessions_list(app_handle: AppHandle, limit: Option<i32>) -> Result<Vec<FocusSession>> {
    let pool = get_pool(&app_handle)?;
    let limit = limit.unwrap_or(50);

    let sessions = sqlx::query_as!(
        FocusSession,
        r#"SELECT id, task_id, started_at, ended_at, duration_sec, is_break, created_at, updated_at, is_synced, local_updated_at FROM focus_sessions WHERE deleted_at IS NULL ORDER BY started_at DESC LIMIT ?"#,
        limit
    )
    .fetch_all(pool)
    .await?;

    Ok(sessions)
}