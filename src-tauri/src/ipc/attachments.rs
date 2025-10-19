use crate::db::{get_pool, generate_id, Result};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Attachment {
    pub id: String,
    pub task_id: String,
    pub file_path: String,
    pub file_name: String,
    pub mime_type: String,
    pub file_size_bytes: i64,
    pub uploaded_at: String,
    pub deleted_at: Option<String>,
    pub is_synced: bool,
    pub local_updated_at: String,
}

#[tauri::command]
pub async fn attachments_add(
    app_handle: AppHandle,
    task_id: String,
    file_path: String,
    file_name: String,
    mime_type: String,
    file_size_bytes: i64,
) -> Result<Attachment> {
    let pool = get_pool(&app_handle)?;
    let id = generate_id();
    let now = chrono::Utc::now().to_rfc3339();

    let new_attachment = sqlx::query_as!(
        Attachment,
        r#"
        INSERT INTO attachments (id, task_id, file_path, file_name, mime_type, file_size_bytes, uploaded_at, local_updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id, task_id, file_path, file_name, mime_type, file_size_bytes, uploaded_at, deleted_at, is_synced, local_updated_at
        "#,
        id,
        task_id,
        file_path,
        file_name,
        mime_type,
        file_size_bytes,
        now,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(new_attachment)
}

#[tauri::command]
pub async fn attachments_list(app_handle: AppHandle, task_id: String) -> Result<Vec<Attachment>> {
    let pool = get_pool(&app_handle)?;
    let attachments = sqlx::query_as!(
        Attachment,
        r#"SELECT id, task_id, file_path, file_name, mime_type, file_size_bytes, uploaded_at, deleted_at, is_synced, local_updated_at FROM attachments WHERE task_id = ? AND deleted_at IS NULL ORDER BY uploaded_at DESC"#,
        task_id
    )
    .fetch_all(pool)
    .await?;

    Ok(attachments)
}

#[tauri::command]
pub async fn attachments_delete(app_handle: AppHandle, id: String) -> Result<bool> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let rows_affected = sqlx::query!(
        r#"UPDATE attachments SET deleted_at = ?, local_updated_at = ? WHERE id = ?"#,
        now,
        now,
        id
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected > 0)
}