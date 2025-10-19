// Cloud sync placeholder
// TODO: Implement Supabase sync when environment variables are present

pub mod pull;
pub mod push;
pub mod conflict;

/// Check if Supabase sync is configured
pub fn is_sync_configured() -> bool {
    // Check for environment variables
    std::env::var("VITE_SUPABASE_URL").is_ok() && 
    std::env::var("VITE_SUPABASE_ANON_KEY").is_ok()
}

/// Get sync status
pub fn get_sync_status() -> String {
    if is_sync_configured() {
        "configured".to_string()
    } else {
        "disabled".to_string()
    }
}
