use sqlx::SqlitePool;
use std::sync::Arc;
use tauri::Manager;

mod db;
mod ipc;
mod os;
mod sync;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                // Initialize database
                match db::init_db(&app_handle).await {
                    Ok(pool) => {
                        println!("Database initialized successfully");
                        // Store pool in app state for use in commands
                        app_handle.manage(Arc::new(pool));
                        
                        // Seed the database with sample data
                        if let Err(e) = db::seed::seed_database(&*pool).await {
                            eprintln!("Failed to seed database: {}", e);
                        }
                    }
                    Err(e) => {
                        eprintln!("Failed to initialize database: {}", e);
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // Task commands
            ipc::tasks::tasks_create,
            ipc::tasks::tasks_get,
            ipc::tasks::tasks_update,
            ipc::tasks::tasks_delete,
            ipc::tasks::tasks_list,
            ipc::tasks::tasks_search,
            // List commands
            ipc::lists::lists_create,
            ipc::lists::lists_get,
            ipc::lists::lists_update,
            ipc::lists::lists_delete,
            ipc::lists::lists_list
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
