use crate::db::{get_pool, generate_id, Result};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use sqlx::SqlitePool;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Tag {
    pub id: String,
    pub workspace_id: String,
    pub name: String,
    pub color: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    pub is_synced: bool,
    pub local_updated_at: String,
}

#[tauri::command]
pub async fn tags_create(app_handle: AppHandle, name: String, color: Option<String>) -> Result<Tag> {
    let pool = get_pool(&app_handle)?;
    let id = generate_id();
    let now = chrono::Utc::now().to_rfc3339();
    let workspace_id = "local-workspace".to_string(); // TODO: Get actual workspace_id from auth

    let new_tag = sqlx::query_as!(
        Tag,
        r#"
        INSERT INTO tags (id, workspace_id, name, color, created_at, updated_at, local_updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id, workspace_id, name, color, created_at, updated_at, deleted_at, is_synced, local_updated_at
        "#,
        id,
        workspace_id,
        name,
        color,
        now,
        now,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(new_tag)
}

#[tauri::command]
pub async fn tags_get(app_handle: AppHandle, id: String) -> Result<Option<Tag>> {
    let pool = get_pool(&app_handle)?;
    let tag = sqlx::query_as!(
        Tag,
        r#"SELECT id, workspace_id, name, color, created_at, updated_at, deleted_at, is_synced, local_updated_at FROM tags WHERE id = ? AND deleted_at IS NULL"#,
        id
    )
    .fetch_optional(pool)
    .await?;

    Ok(tag)
}

#[tauri::command]
pub async fn tags_update(app_handle: AppHandle, id: String, name: Option<String>, color: Option<String>) -> Result<Tag> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let updated_tag = sqlx::query_as!(
        Tag,
        r#"
        UPDATE tags
        SET name = COALESCE(?, name),
            color = COALESCE(?, color),
            updated_at = ?,
            local_updated_at = ?
        WHERE id = ?
        RETURNING id, workspace_id, name, color, created_at, updated_at, deleted_at, is_synced, local_updated_at
        "#,
        name,
        color,
        now,
        now,
        id
    )
    .fetch_one(pool)
    .await?;

    Ok(updated_tag)
}

#[tauri::command]
pub async fn tags_delete(app_handle: AppHandle, id: String) -> Result<bool> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let rows_affected = sqlx::query!(
        r#"UPDATE tags SET deleted_at = ?, local_updated_at = ? WHERE id = ?"#,
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
pub async fn tags_list(app_handle: AppHandle) -> Result<Vec<Tag>> {
    let pool = get_pool(&app_handle)?;
    let tags = sqlx::query_as!(
        Tag,
        r#"SELECT id, workspace_id, name, Deployment, created_at, updated_at, deleted_at, is_synced, local_updated_at FROM tags WHERE deleted_at IS NULL ORDER BY name ASC"#
    )
    .fetch_all(pool)
    .await?;

    Ok(tags)
}

#[tauri::command]
pub async fn tags_upsert(app_handle: AppHandle, name: String, color: Option<String>) -> Result<Tag> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();
    let workspace_id = "local-workspace".to_string();

    // Try to find existing tag
    let existing_tag = sqlx::query_as!(
        Tag,
        r#"SELECT id, workspace_id, name, color, created_at, updated_at, deleted_at, is_synced, local_updated_at FROM tags WHERE name = ? AND workspace_id = ? AND deleted_at IS NULL"#,
        name,
        workspace_id
    )
    .fetch_optional(pool)
    .await?;

    if let Some(mut tag) = existing_tag {
        // Update existing tag if color is provided
        if let Some(new_color) = color {
            let updated_tag = sqlx::query_as!(
                Tag,
                r#"
                UPDATE tags
                SET color = ?,
                    updated_at = ?,
                    local_updated_at = ?
                WHERE id = ?
                RETURNING id, workspace_id, name, color, created_at, updated_at, deleted_at, is_synced, local_updated_at
                "#,
                new_color,
                now,
                now,
                tag.id
            )
            .fetch_one(pool)
            .await?;
            return Ok(updated_tag);
        }
        Ok(tag)
    } else {
        // Create new tag
        tags_create(app_handle, name, color).await
    }
}

#[tauri::command]
pub async fn tags_assign(app_handle: AppHandle, task_id: String, tag_id: String) -> Result<bool> {
    let pool = get_pool(&app_handle)?;
    let now = chrono::Utc::now().to_rfc3339();

    let rows_affected = sqlx::query!(
        r#"INSERT INTO task_tags (task_id, tag_id, created_at, local_updated_at) VALUES (?, ?, ?, ?)"#,
        task_id,
        tag_id,
        now,
        now
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected > 0)
}

#[tauri::command]
pub async fn tags_remove(app_handle: AppHandle, task_id: String, tag_id: String) -> Result<bool> {
    let pool = get_pool(&app_handle)?;

    let rows_affected = sqlx::query!(
        r#"DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?"#,
        task_id,
        tag_id
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected > 0)
}