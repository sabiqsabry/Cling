use tauri::{AppHandle, GlobalShortcutManager, Manager};

pub fn register_global_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let mut shortcut_manager = app.global_shortcut_manager();

    // Register global shortcuts
    shortcut_manager.register("CmdOrCtrl+Shift+A", move || {
        // Quick Add Task
        if let Some(app) = app.get_webview_window("main") {
            let _ = app.eval("window.dispatchEvent(new CustomEvent('open-quick-add'));");
        }
    })?;

    shortcut_manager.register("CmdOrCtrl+Shift+F", move || {
        // Start Focus Mode
        if let Some(app) = app.get_webview_window("main") {
            let _ = app.eval("window.dispatchEvent(new CustomEvent('start-focus-mode'));");
        }
    })?;

    shortcut_manager.register("CmdOrCtrl+Shift+T", move || {
        // Show Today's Tasks
        if let Some(app) = app.get_webview_window("main") {
            let _ = app.eval("window.dispatchEvent(new CustomEvent('show-today'));");
        }
    })?;

    shortcut_manager.register("CmdOrCtrl+Shift+C", move || {
        // Toggle Cling Window
        if let Some(window) = app.get_window("main") {
            if window.is_visible().unwrap_or(false) {
                let _ = window.hide();
            } else {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
    })?;

    shortcut_manager.register("CmdOrCtrl+Shift+E", move || {
        // Start/Stop Focus Session
        if let Some(app) = app.get_webview_window("main") {
            let _ = app.eval("window.dispatchEvent(new CustomEvent('toggle-focus-session'));");
        }
    })?;

    shortcut_manager.register("CmdOrCtrl+Shift+N", move || {
        // Show Notifications
        if let Some(app) = app.get_webview_window("main") {
            let _ = app.eval("window.dispatchEvent(new CustomEvent('show-notifications'));");
        }
    })?;

    Ok(())
}

pub fn unregister_global_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let mut shortcut_manager = app.global_shortcut_manager();
    
    let shortcuts = vec![
        "CmdOrCtrl+Shift+A",
        "CmdOrCtrl+Shift+F", 
        "CmdOrCtrl+Shift+T",
        "CmdOrCtrl+Shift+C",
        "CmdOrCtrl+Shift+E",
        "CmdOrCtrl+Shift+N",
    ];

    for shortcut in shortcuts {
        let _ = shortcut_manager.unregister(shortcut);
    }

    Ok(())
}

pub fn get_shortcut_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("CmdOrCtrl+Shift+A", "Quick Add Task"),
        ("CmdOrCtrl+Shift+F", "Start Focus Mode"),
        ("CmdOrCtrl+Shift+T", "Show Today's Tasks"),
        ("CmdOrCtrl+Shift+C", "Toggle Cling Window"),
        ("CmdOrCtrl+Shift+E", "Start/Stop Focus Session"),
        ("CmdOrCtrl+Shift+N", "Show Notifications"),
    ]
}
