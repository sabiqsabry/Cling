use sqlx::{sqlite::SqlitePool, Row};
use std::path::PathBuf;
use tauri::AppHandle;
use uuid::Uuid;

pub mod migrate;
pub mod seed;

#[derive(Debug, thiserror::Error)]
pub enum DatabaseError {
    #[error("SQL error: {0}")]
    Sql(#[from] sqlx::Error),
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Migration error: {0}")]
    Migration(String),
}

pub type Result<T> = std::result::Result<T, DatabaseError>;

/// Initialize the database connection with SQLCipher encryption
pub async fn init_db(app_handle: &AppHandle) -> Result<SqlitePool> {
    let app_data_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or_else(|| DatabaseError::Io(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Could not get app data directory"
        )))?;

    // Create app data directory if it doesn't exist
    std::fs::create_dir_all(&app_data_dir)?;

    let db_path = app_data_dir.join("cling.db");
    
    // For now, use a simple passphrase-based encryption
    // In production, this should integrate with system keychain
    let encryption_key = get_or_create_db_key(app_handle)?;
    
    let database_url = format!(
        "sqlite:{}?_pragma_key={}&_pragma_cipher_page_size=4096",
        db_path.to_string_lossy(),
        encryption_key
    );

    let pool = SqlitePool::connect(&database_url).await?;

    // Run migrations
    migrate::run_migrations(&pool).await?;

    // Check if database is empty and seed if needed
    let is_empty = is_database_empty(&pool).await?;
    if is_empty {
        seed::seed_database(&pool).await?;
    }

    Ok(pool)
}

/// Get or create database encryption key
/// For now, use a simple approach. In production, integrate with system keychain
fn get_or_create_db_key(_app_handle: &AppHandle) -> Result<String> {
    // TODO: Integrate with macOS Keychain or Windows DPAPI
    // For now, use a fixed key for development
    // In production, this should be stored securely in system keychain
    Ok("cling-dev-key-2024".to_string())
}

/// Check if database has any data
async fn is_database_empty(pool: &SqlitePool) -> Result<bool> {
    let result = sqlx::query("SELECT COUNT(*) as count FROM tasks")
        .fetch_one(pool)
        .await?;
    
    let count: i64 = result.get("count");
    Ok(count == 0)
}

/// Generate a new UUID as string
pub fn generate_id() -> String {
    Uuid::new_v4().to_string()
}

/// Get current timestamp as ISO string
pub fn current_timestamp() -> String {
    chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string()
}
