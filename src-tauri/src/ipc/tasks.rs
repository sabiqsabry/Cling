// Task-related IPC commands
// TODO: Implement task CRUD operations

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub list_id: String,
    pub title: String,
    pub description: Option<String>,
    pub priority: i32,
    pub start_at: Option<String>,
    pub end_at: Option<String>,
    pub all_day: bool,
    pub duration_min: Option<i32>,
    pub recurrence_rrule: Option<String>,
    pub status: String,
    pub estimate_pomos: i32,
    pub created_at: String,
    pub updated_at: String,
    pub completed_at: Option<String>,
}

// TODO: Implement these commands
// - tasks_create
// - tasks_update  
// - tasks_delete
// - tasks_search
// - tasks_batch_move
// - tasks_get_by_date_range
