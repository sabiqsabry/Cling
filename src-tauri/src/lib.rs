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
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .system_tray(os::tray::create_system_tray())
        .on_system_tray_event(os::tray::handle_system_tray_event)
        .menu(os::menubar::create_app_menu())
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
                    ipc::lists::lists_list,
                    // Tag commands
                    ipc::tags::tags_create,
                    ipc::tags::tags_get,
                    ipc::tags::tags_update,
                    ipc::tags::tags_delete,
                    ipc::tags::tags_list,
                    ipc::tags::tags_upsert,
                    ipc::tags::tags_assign,
                    ipc::tags::tags_remove,
                    // Comment commands
                    ipc::comments::comments_add,
                    ipc::comments::comments_list,
                    ipc::comments::comments_update,
                    ipc::comments::comments_delete,
                    // Attachment commands
                    ipc::attachments::attachments_add,
                    ipc::attachments::attachments_list,
                    ipc::attachments::attachments_delete,
                    // Focus commands
                    ipc::focus::focus_start,
                    ipc::focus::focus_stop,
                    ipc::focus::focus_stats,
                    ipc::focus::focus_sessions_list,
                    // Habit commands
                    ipc::habits::habits_create,
                    ipc::habits::habits_list,
                    ipc::habits::habits_update,
                    ipc::habits::habits_delete,
                    ipc::habits::habits_log,
                    ipc::habits::habits_stats,
                    // Calendar commands
                    ipc::calendar::calendar_timeblock,
                    ipc::calendar::calendar_events,
                    ipc::calendar::calendar_events_by_task,
                    ipc::calendar::calendar_delete_timeblock,
                    // OS integration commands
                    os::protocol::protocol_register,
                    os::protocol::handle_url_scheme
                ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
