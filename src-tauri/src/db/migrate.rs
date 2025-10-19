use super::{DatabaseError, Result};
use sqlx::SqlitePool;
use std::fs;
use std::path::Path;

/// Run all database migrations
pub async fn run_migrations(pool: &SqlitePool) -> Result<()> {
    // Get the migration files in order
    let migrations_dir = Path::new("src-tauri/sql/migrations");
    
    if !migrations_dir.exists() {
        return Err(DatabaseError::Migration(
            "Migrations directory not found".to_string()
        ));
    }

    let mut migration_files: Vec<_> = fs::read_dir(migrations_dir)?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();
            if path.extension()?.to_str()? == "sql" {
                Some(path)
            } else {
                None
            }
        })
        .collect();

    migration_files.sort();

    // Create migrations tracking table
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )"
    )
    .execute(pool)
    .await?;

    // Run each migration
    for migration_file in migration_files {
        let filename = migration_file
            .file_name()
            .unwrap()
            .to_string_lossy()
            .to_string();

        // Check if migration already executed
        let already_executed = sqlx::query(
            "SELECT COUNT(*) as count FROM migrations WHERE filename = ?"
        )
        .bind(&filename)
        .fetch_one(pool)
        .await?;

        let count: i64 = already_executed.get("count");
        if count > 0 {
            continue; // Skip already executed migration
        }

        // Read and execute migration
        let migration_sql = fs::read_to_string(&migration_file)?;
        
        // Split by semicolon and execute each statement
        let statements: Vec<&str> = migration_sql
            .split(';')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .collect();

        let mut tx = pool.begin().await?;
        
        for statement in statements {
            if !statement.is_empty() {
                sqlx::query(statement).execute(&mut *tx).await?;
            }
        }

        // Record migration as executed
        sqlx::query(
            "INSERT INTO migrations (filename) VALUES (?)"
        )
        .bind(&filename)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        
        println!("Executed migration: {}", filename);
    }

    Ok(())
}
