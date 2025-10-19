use crate::db::{get_pool, generate_id, Result};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Comment {
    pub id: String,
    pub task_id: String,
    pub body: String,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    pub is_synced: bool,
    pub local_updated_at: String,
}

#[tauri::command]
pub async fn comments_add(app_handle: AppHandle, task_id: String, body: String) -> Result<Comment> {
    let pool = get_pool(&app_handle)?;
    let id = generate_id();
    let now = chrono::Utc::now().to_rfc3339();

    let new_comment = sqlx::query_as!(
        Comment,
        r#"
        INSERT INTO comments (id, task_id, body, created_at, updated_at, local_updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING id, task_id, body, created_at, updated_at, deleted_at, is_synced, local_updated_at
        "#,
        id,
        task_id,
        body,
        now,
        now,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(new_comment)
}

#[tauri::command]
pub async fn comments_list(app_handle: AppHandle, task_id: String) -> Result<Vec<Comment>> {
    let pool = get_pool(&app_handle)?;
    let comments = sqlx::query_as!(
        Comment,
        r#"SELECT id, task_id, body, created_at, updated_at, deleted_at, is_synced, local_updated_at FROM comments WHERE task_id = ? AND deleted_at IS NULL ORDER BY created_at ASC"#,
        task_id
    )
    .fetch_all(pool)
    .await?;

    Ok(comments)
}

#[tauri::command]
pub async fn comments_update(app_handle: AppHandle, id: String, body: String) -> Result<Comment> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let updated_comment = sqlx::query_as!(
        Comment,
        r#"
        UPDATE comments
        SET body = ?,
            updated_at = ?,
            local_updated_at = ?
        WHERE id = ?
        RETURNING id, task_id, body, created_at, updated_at, deleted_at, is_synced, local_updated_at
        "#,
        body,
        now,
        now,
        id
    )
    .fetch_one(pool)
    .await?;

    Ok(updated_comment)
}

#[tauri::command]
pub async fn comments_delete(app_handle: AppHandle, id: String) -> Result<bool> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let rows_affected = sqlx::query!(
        r#"UPDATE comments SET deleted_at = ?, local_updated_at = ? WHERE id = ?"#,
        now,
        now,
        id
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected > 0)
}