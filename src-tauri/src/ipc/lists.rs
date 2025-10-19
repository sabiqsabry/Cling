use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tauri::State;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct List {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub is_default: bool,
    pub sort_order: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateListParams {
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateListParams {
    pub id: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub sort_order: Option<i32>,
}

#[tauri::command]
pub async fn lists_create(
    params: CreateListParams,
    pool: State<'_, SqlitePool>,
) -> Result<List, String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    
    // Get the next sort order
    let sort_order = sqlx::query_scalar!(
        "SELECT COALESCE(MAX(sort_order), 0) + 1 FROM lists"
    )
    .fetch_one(&*pool)
    .await
    .unwrap_or(1);

    sqlx::query!(
        r#"
        INSERT INTO lists (
            id, name, description, color, icon, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        "#,
        id,
        params.name,
        params.description,
        params.color,
        params.icon,
        sort_order,
        now,
        now
    )
    .execute(&*pool)
    .await
    .map_err(|e| format!("Failed to create list: {}", e))?;

    lists_get(&id, pool).await
}

#[tauri::command]
pub async fn lists_get(
    id: &str,
    pool: State<'_, SqlitePool>,
) -> Result<List, String> {
    let row = sqlx::query!(
        r#"
        SELECT * FROM lists WHERE id = ?
        "#,
        id
    )
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("List not found: {}", e))?;

    Ok(List {
        id: row.id,
        name: row.name,
        description: row.description,
        color: row.color,
        icon: row.icon,
        is_default: row.is_default,
        sort_order: row.sort_order,
        created_at: row.created_at,
        updated_at: row.updated_at,
    })
}

#[tauri::command]
pub async fn lists_update(
    params: UpdateListParams,
    pool: State<'_, SqlitePool>,
) -> Result<List, String> {
    let now = Utc::now().to_rfc3339();

    sqlx::query!(
        r#"
        UPDATE lists SET 
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            color = COALESCE(?, color),
            icon = COALESCE(?, icon),
            sort_order = COALESCE(?, sort_order),
            updated_at = ?
        WHERE id = ?
        "#,
        params.name,
        params.description,
        params.color,
        params.icon,
        params.sort_order,
        now,
        params.id
    )
    .execute(&*pool)
    .await
    .map_err(|e| format!("Failed to update list: {}", e))?;

    lists_get(&params.id, pool).await
}

#[tauri::command]
pub async fn lists_delete(
    id: &str,
    pool: State<'_, SqlitePool>,
) -> Result<bool, String> {
    // Check if this is the default list
    let is_default = sqlx::query_scalar!(
        "SELECT is_default FROM lists WHERE id = ?",
        id
    )
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("Failed to check list: {}", e))?;

    if is_default {
        return Err("Cannot delete the default list".to_string());
    }

    // Move all tasks from this list to the default list
    let default_list_id = sqlx::query_scalar!(
        "SELECT id FROM lists WHERE is_default = 1 LIMIT 1"
    )
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("Failed to find default list: {}", e))?;

    sqlx::query!(
        "UPDATE tasks SET list_id = ? WHERE list_id = ?",
        default_list_id,
        id
    )
    .execute(&*pool)
    .await
    .map_err(|e| format!("Failed to move tasks: {}", e))?;

    // Delete the list
    sqlx::query!(
        r#"
        DELETE FROM lists WHERE id = ?
        "#,
        id
    )
    .execute(&*pool)
    .await
    .map_err(|e| format!("Failed to delete list: {}", e))?;

    Ok(true)
}

#[tauri::command]
pub async fn lists_list(
    pool: State<'_, SqlitePool>,
) -> Result<Vec<List>, String> {
    let rows = sqlx::query!(
        r#"
        SELECT * FROM lists ORDER BY sort_order ASC, created_at ASC
        "#
    )
    .fetch_all(&*pool)
    .await
    .map_err(|e| format!("Failed to fetch lists: {}", e))?;

    let lists = rows
        .into_iter()
        .map(|row| List {
            id: row.id,
            name: row.name,
            description: row.description,
            color: row.color,
            icon: row.icon,
            is_default: row.is_default,
            sort_order: row.sort_order,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })
        .collect();

    Ok(lists)
}