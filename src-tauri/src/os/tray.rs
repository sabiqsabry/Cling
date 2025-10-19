use tauri::{AppHandle, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use tauri_plugin_notification::NotificationExt;

pub fn create_system_tray() -> SystemTray {
    let menu = SystemTrayMenu::new()
        .add_item(tauri::SystemTrayMenuItem::new("Show Cling", "show"))
        .add_item(tauri::SystemTrayMenuItem::new("Quick Add", "quick_add"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(tauri::SystemTrayMenuItem::new("Focus Mode", "focus_mode"))
        .add_item(tauri::SystemTrayMenuItem::new("Today's Tasks", "today"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(tauri::SystemTrayMenuItem::new("Settings", "settings"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(tauri::SystemTrayMenuItem::new("Quit", "quit"));

    SystemTray::new().with_menu(menu)
}

pub fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            // Show/hide window on left click
            if let Some(window) = app.get_window("main") {
                if window.is_visible().unwrap_or(false) {
                    let _ = window.hide();
                } else {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        }
        SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
        } => {
            // Right click already shows context menu
        }
        SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
        } => {
            // Show window on double click
            if let Some(window) = app.get_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => {
            handle_menu_item_click(app, &id);
        }
        _ => {}
    }
}

fn handle_menu_item_click(app: &AppHandle, id: &str) {
    match id {
        "show" => {
            if let Some(window) = app.get_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
        "quick_add" => {
            // Emit event to open quick add modal
            app.emit_all("open-quick-add", ()).unwrap();
        }
        "focus_mode" => {
            // Emit event to start focus mode
            app.emit_all("start-focus-mode", ()).unwrap();
        }
        "today" => {
            // Emit event to show today's tasks
            app.emit_all("show-today", ()).unwrap();
        }
        "settings" => {
            // Emit event to open settings
            app.emit_all("open-settings", ()).unwrap();
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}

pub fn show_tray_notification(app: &AppHandle, title: &str, body: &str) {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .unwrap();
}