use tauri_plugin_notification::NotificationExt;

pub struct NotificationManager {
    app_handle: tauri::AppHandle,
}

impl NotificationManager {
    pub fn new(app_handle: tauri::AppHandle) -> Self {
        Self { app_handle }
    }

    pub fn show_task_reminder(&self, title: &str, body: &str) {
        self.app_handle
            .notification()
            .builder()
            .title(title)
            .body(body)
            .icon("icons/32x32.png")
            .show()
            .unwrap();
    }

    pub fn show_focus_complete(&self) {
        self.app_handle
            .notification()
            .builder()
            .title("Focus Session Complete! 🎉")
            .body("Great job! Time for a break.")
            .icon("icons/32x32.png")
            .show()
            .unwrap();
    }

    pub fn show_break_complete(&self) {
        self.app_handle
            .notification()
            .builder()
            .title("Break Complete! 💪")
            .body("Ready to get back to work?")
            .icon("icons/32x32.png")
            .show()
            .unwrap();
    }

    pub fn show_habit_reminder(&self, habit_name: &str) {
        self.app_handle
            .notification()
            .builder()
            .title("Habit Reminder")
            .body(&format!("Don't forget: {}", habit_name))
            .icon("icons/32x32.png")
            .show()
            .unwrap();
    }

    pub fn show_task_due(&self, task_title: &str, due_time: &str) {
        self.app_handle
            .notification()
            .builder()
            .title("Task Due Soon")
            .body(&format!("'{}' is due {}", task_title, due_time))
            .icon("icons/32x32.png")
            .show()
            .unwrap();
    }

    pub fn show_sync_complete(&self, synced_items: usize) {
        self.app_handle
            .notification()
            .builder()
            .title("Sync Complete")
            .body(&format!("Synced {} items successfully", synced_items))
            .icon("icons/32x32.png")
            .show()
            .unwrap();
    }

    pub fn show_sync_error(&self, error_message: &str) {
        self.app_handle
            .notification()
            .builder()
            .title("Sync Error")
            .body(error_message)
            .icon("icons/32x32.png")
            .show()
            .unwrap();
    }
}