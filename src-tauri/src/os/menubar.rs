use tauri::{AppHandle, Manager, Menu, MenuItem, Submenu, WindowBuilder, WindowUrl};

pub fn create_app_menu() -> Menu {
    Menu::new()
        .add_submenu(Submenu::new(
            "Cling",
            Menu::new()
                .add_item(MenuItem::new("About Cling"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Preferences..."))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Hide Cling"))
                .add_item(MenuItem::new("Hide Others"))
                .add_item(MenuItem::new("Show All"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Quit")),
        ))
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(MenuItem::new("New Task"))
                .add_item(MenuItem::new("Quick Add..."))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Import..."))
                .add_item(MenuItem::new("Export..."))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Reset to Sample Data")),
        ))
        .add_submenu(Submenu::new(
            "Edit",
            Menu::new()
                .add_item(MenuItem::new("Undo"))
                .add_item(MenuItem::new("Redo"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Cut"))
                .add_item(MenuItem::new("Copy"))
                .add_item(MenuItem::new("Paste"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Select All")),
        ))
        .add_submenu(Submenu::new(
            "View",
            Menu::new()
                .add_item(MenuItem::new("Dashboard"))
                .add_item(MenuItem::new("Today"))
                .add_item(MenuItem::new("Lists"))
                .add_item(MenuItem::new("Kanban"))
                .add_item(MenuItem::new("Calendar"))
                .add_item(MenuItem::new("Timeline"))
                .add_item(MenuItem::new("Focus"))
                .add_item(MenuItem::new("Habits"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Toggle Sidebar"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Reload")),
        ))
        .add_submenu(Submenu::new(
            "Focus",
            Menu::new()
                .add_item(MenuItem::new("Start Focus Session"))
                .add_item(MenuItem::new("Start Break"))
                .add_item(MenuItem::new("Stop Session"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Focus Settings")),
        ))
        .add_submenu(Submenu::new(
            "Window",
            Menu::new()
                .add_item(MenuItem::new("Minimize"))
                .add_item(MenuItem::new("Zoom"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Bring All to Front")),
        ))
        .add_submenu(Submenu::new(
            "Help",
            Menu::new()
                .add_item(MenuItem::new("User Guide"))
                .add_item(MenuItem::new("Keyboard Shortcuts"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("Report Issue"))
                .add_item(MenuItem::new("Feature Request"))
                .add_native_item(MenuItem::Separator)
                .add_item(MenuItem::new("About Cling")),
        ))
}

pub fn show_menubar_mini(app: &AppHandle) -> Result<(), tauri::Error> {
    let window = WindowBuilder::new(
        app,
        "menubar-mini",
        WindowUrl::App("menubar-mini".into()),
    )
    .title("Cling Mini")
    .resizable(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .decorations(false)
    .width(320.0)
    .height(400.0)
    .build()?;

    // Position the window near the menu bar
    if let Ok(primary_monitor) = window.primary_monitor() {
        if let Some(monitor) = primary_monitor {
            let monitor_size = monitor.size();
            let _ = window.set_position(tauri::LogicalPosition::new(
                monitor_size.width as f64 - 320.0,
                50.0,
            ));
        }
    }

    Ok(())
}

pub fn hide_menubar_mini(app: &AppHandle) {
    if let Some(window) = app.get_window("menubar-mini") {
        let _ = window.close();
    }
}