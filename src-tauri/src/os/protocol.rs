use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn protocol_register(app_handle: AppHandle, scheme: String) -> Result<bool, String> {
    // This would register the URL scheme with the OS
    // Implementation depends on the platform (Windows Registry, macOS Info.plist, etc.)
    
    // For now, we'll just log the registration
    println!("Registering URL scheme: {}", scheme);
    
    // In a real implementation, you would:
    // 1. Update the app's Info.plist (macOS) or registry (Windows)
    // 2. Register the protocol handler with the OS
    // 3. Handle incoming URL scheme events
    
    Ok(true)
}

#[tauri::command]
pub async fn handle_url_scheme(app_handle: AppHandle, url: String) -> Result<(), String> {
    println!("Received URL scheme: {}", url);
    
    // Parse the URL scheme
    if let Ok(parsed_url) = url::Url::parse(&url) {
        let scheme = parsed_url.scheme();
        let host = parsed_url.host_str().unwrap_or("");
        let query_params: std::collections::HashMap<String, String> = 
            parsed_url.query_pairs().into_owned().collect();
        
        match (scheme, host) {
            ("cling", "add_task") => {
                // Handle add_task command
                if let Some(title) = query_params.get("title") {
                    // Emit event to frontend to open quick add with pre-filled data
                    app_handle.emit_all("url-scheme-add-task", title).unwrap();
                }
            }
            ("cling", "show") => {
                // Handle show command
                if let Some(view) = query_params.get("view") {
                    app_handle.emit_all("url-scheme-show", view).unwrap();
                }
            }
            ("cling", "search") => {
                // Handle search command
                if let Some(query) = query_params.get("q") {
                    app_handle.emit_all("url-scheme-search", query).unwrap();
                }
            }
            _ => {
                println!("Unknown URL scheme: {}://{}", scheme, host);
            }
        }
    }
    
    Ok(())
}

// URL scheme examples:
// cling://add_task?title=New%20Task&priority=2&due_date=2024-01-15
// cling://show/today
// cling://show/calendar
// cling://search?q=project%20review