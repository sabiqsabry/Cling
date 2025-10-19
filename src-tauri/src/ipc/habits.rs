use crate::db::{get_pool, generate_id, Result};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Habit {
    pub id: String,
    pub workspace_id: String,
    pub title: String,
    pub description: Option<String>,
    pub schedule_json: String,
    pub streak: i32,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    pub is_synced: bool,
    pub local_updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HabitLog {
    pub id: String,
    pub habit_id: String,
    pub date: String,
    pub value: i32,
    pub created_at: String,
    pub updated_at: String,
    pub is_synced: bool,
    pub local_updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HabitStats {
    pub total_habits: i64,
    pub active_streaks: i64,
    pub total_logs_today: i64,
    pub completion_rate: f64,
}

#[tauri::command]
pub async fn habits_create(app_handle: AppHandle, title: String, description: Option<String>, schedule_json: String) -> Result<Habit> {
    let pool = get_pool(&app_handle)?;
    let id = generate_id();
    let now = chrono::Utc::now().to_rfc3339();
    let workspace_id = "local-workspace".to_string();

    let new_habit = sqlx::query_as!(
        Habit,
        r#"
        INSERT INTO habits (id, workspace_id, title, description, schedule_json, streak, created_at, updated_at, local_updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id, workspace_id, title, description, schedule_json, streak, created_at, updated_at, deleted_at, is_synced, local_updated_at
        "#,
        id,
        workspace_id,
        title,
        description,
        schedule_json,
        0, // Initial streak
        now,
        now,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(new_habit)
}

#[tauri::command]
pub async fn habits_list(app_handle: AppHandle) -> Result<Vec<Habit>> {
    let pool = get_pool(&app_handle)?;
    let habits = sqlx::query_as!(
        Habit,
        r#"SELECT id, workspace_id, title, description, schedule_json, streak, created_at, updated_at, deleted_at, is_synced, local_updated_at FROM habits WHERE deleted_at IS NULL ORDER BY title ASC"#
    )
    .fetch_all(pool)
    .await?;

    Ok(habits)
}

#[tauri::command]
pub async fn habits_update(app_handle: AppHandle, id: String, title: Option<String>, description: Option<String>, schedule_json: Option<String>) -> Result<Habit> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let updated_habit = sqlx::query_as!(
        Habit,
        r#"
        UPDATE habits
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            schedule_json = COALESCE(?, schedule_json),
            updated_at = ?,
            local_updated_at = ?
        WHERE id = ?
        RETURNING id, workspace_id, title, description, schedule_json, streak, created_at, updated_at, deleted_at, is_synced, local_updated_at
        "#,
        title,
        description,
        schedule_json,
        now,
        now,
        id
    )
    .fetch_one(pool)
    .await?;

    Ok(updated_habit)
}

#[tauri::command]
pub async fn habits_delete(app_handle: AppHandle, id: String) -> Result<bool> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let rows_affected = sqlx::query!(
        r#"UPDATE habits SET deleted_at = ?, local_updated_at = ? WHERE id = ?"#,
        now,
        now,
        id
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected > 0)
}

#[tauri::command]
pub async fn habits_log(app_handle: AppHandle, habit_id: String, date: String, value: i32) -> Result<HabitLog> {
    let pool = get_pool(&app_handle)?;
    let id = generate_id();
    let now = chrono::Utc::now().to_rfc3339();

    // Check if log already exists for this date
    let existing_log = sqlx::query!(
        r#"SELECT id FROM habit_logs WHERE habit_id = ? AND date = ?"#,
        habit_id,
        date
    )
    .fetch_optional(pool)
    .await?;

    if let Some(_) = existing_log {
        // Update existing log
        let updated_log = sqlx::query_as!(
            HabitLog,
            r#"
            UPDATE habit_logs
            SET value = ?,
                updated_at = ?,
                local_updated_at = ?
            WHERE habit_id = ? AND date = ?
            RETURNING id, habit_id, date, value, created_at, updated_at, is_synced, local_updated_at
            "#,
            value,
            now,
            now,
            habit_id,
            date
        )
        .fetch_one(pool)
        .await?;

        return Ok(updated_log);
    } else {
        // Create new log
        let new_log = sqlx::query_as!(
            HabitLog,
            r#"
            INSERT INTO habit_logs (id, habit_id, date, value, created_at, updated_at, local_updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING id, habit_id, date, value, created_at, updated_at, is_synced, local_updated_at
            "#,
            id,
            habit_id,
            date,
            value,
            now,
            now,
            now
        )
        .fetch_one(pool)
        .await?;

        // Update habit streak
        update_habit_streak(pool, &habit_id).await?;

        Ok(new_log)
    }
}

#[tauri::command]
pub async fn habits_stats(app_handle: AppHandle) -> Result<HabitStats> {
    let pool = get_pool(&app_handle)?;
    let today = chrono::Utc::now().date_naive().format("%Y-%m-%d").to_string();

    // Get total habits count
    let total_habits = sqlx::query!(
        r#"SELECT COUNT(*) as count FROM habits WHERE deleted_at IS NULL"#
    )
    .fetch_one(pool)
    .await?;

    // Get active streaks count
    let active_streaks = sqlx::query!(
        r#"SELECT COUNT(*) as count FROM habits WHERE deleted_at IS NULL AND streak > 0"#
    )
    .fetch_one(pool)
    .await?;

    // Get today's logs count
    let today_logs = sqlx::query!(
        r#"SELECT COUNT(*) as count FROM habit_logs WHERE date = ?"#,
        today
    )
    .fetch_one(pool)
    .await?;

    // Calculate completion rate
    let total_habits_count = total_habits.count.unwrap_or(0);
    let completion_rate = if total_habits_count > 0 {
        (today_logs.count.unwrap_or(0) as f64) / (total_habits_count as f64)
    } else {
        0.0
    };

    Ok(HabitStats {
        total_habits,
        active_streaks: active_streaks.count.unwrap_or(0),
        total_logs_today: today_logs.count.unwrap_or(0),
        completion_rate,
    })
}

async fn update_habit_streak(pool: &sqlx::SqlitePool, habit_id: &str) -> Result<()> {
    // Calculate current streak based on consecutive days with logs
    let streak = sqlx::query!(
        r#"
        WITH RECURSIVE consecutive_days AS (
            SELECT date, 1 as streak_length
            FROM habit_logs
            WHERE habit_id = ? AND value > 0
            ORDER BY date DESC
            LIMIT 1
            
            UNION ALL
            
            SELECT hl.date, cd.streak_length + 1
            FROM habit_logs hl
            JOIN consecutive_days cd ON hl.date = DATE(cd.date, '-1 day')
            WHERE hl.habit_id = ? AND hl.value > 0
        )
        SELECT MAX(streak_length) as max_streak FROM consecutive_days
        "#,
        habit_id,
        habit_id
    )
    .fetch_one(pool)
    .await?;

    let new_streak = streak.max_streak.unwrap_or(0);

    // Update habit streak
    sqlx::query!(
        r#"UPDATE habits SET streak = ?, updated_at = datetime('now'), local_updated_at = datetime('now') WHERE id = ?"#,
        new_streak,
        habit_id
    )
    .execute(pool)
    .await?;

    Ok(())
}