use super::{generate_id, Result};
use sqlx::SqlitePool;
use serde_json::json;

/// Seed the database with initial sample data
pub async fn seed_database(pool: &SqlitePool) -> Result<()> {
    println!("Seeding database with sample data...");

    // Create default workspace
    let workspace_id = generate_id();
    sqlx::query(
        "INSERT INTO workspaces (id, owner_id, name) VALUES (?, ?, ?)"
    )
    .bind(&workspace_id)
    .bind("local-user")
    .bind("My Workspace")
    .execute(pool)
    .await?;

    // Create default tags
    let uni_tag_id = generate_id();
    let work_tag_id = generate_id();
    let home_tag_id = generate_id();

    sqlx::query(
        "INSERT INTO tags (id, workspace_id, name, color) VALUES (?, ?, ?, ?)"
    )
    .bind(&uni_tag_id)
    .bind(&workspace_id)
    .bind("uni")
    .bind("#3b82f6")
    .execute(pool)
    .await?;

    sqlx::query(
        "INSERT INTO tags (id, workspace_id, name, color) VALUES (?, ?, ?, ?)"
    )
    .bind(&work_tag_id)
    .bind(&workspace_id)
    .bind("work")
    .bind("#f97316")
    .execute(pool)
    .await?;

    sqlx::query(
        "INSERT INTO tags (id, workspace_id, name, color) VALUES (?, ?, ?, ?)"
    )
    .bind(&home_tag_id)
    .bind(&workspace_id)
    .bind("home")
    .bind("#10b981")
    .execute(pool)
    .await?;

    // Create default lists
    let inbox_id = generate_id();
    let sprint_id = generate_id();
    let personal_id = generate_id();

    sqlx::query(
        "INSERT INTO lists (id, workspace_id, name, color, ord) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&inbox_id)
    .bind(&workspace_id)
    .bind("Inbox")
    .bind("#6b7280")
    .bind(0)
    .execute(pool)
    .await?;

    sqlx::query(
        "INSERT INTO lists (id, workspace_id, name, color, ord) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&sprint_id)
    .bind(&workspace_id)
    .bind("Sprint")
    .bind("#3b82f6")
    .bind(1)
    .execute(pool)
    .await?;

    sqlx::query(
        "INSERT INTO lists (id, workspace_id, name, color, ord) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&personal_id)
    .bind(&workspace_id)
    .bind("Personal")
    .bind("#10b981")
    .bind(2)
    .execute(pool)
    .await?;

    // Create sample tasks
    create_sample_tasks(pool, &inbox_id, &sprint_id, &personal_id, &uni_tag_id, &work_tag_id, &home_tag_id).await?;

    // Create sample habits
    create_sample_habits(pool, &workspace_id).await?;

    // Create sample focus sessions
    create_sample_focus_sessions(pool).await?;

    println!("Database seeded successfully!");
    Ok(())
}

async fn create_sample_tasks(
    pool: &SqlitePool,
    inbox_id: &str,
    sprint_id: &str,
    personal_id: &str,
    uni_tag_id: &str,
    work_tag_id: &str,
    home_tag_id: &str,
) -> Result<()> {
    let now = chrono::Utc::now();
    let tasks = vec![
        // Inbox tasks
        ("Review project proposal", "Need to review the Q4 project proposal and provide feedback", inbox_id, 1, None, None, false, "todo", uni_tag_id),
        ("Buy groceries", "Milk, bread, eggs, and vegetables", inbox_id, 4, None, Some((now + chrono::Duration::days(1)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "todo", home_tag_id),
        ("Call dentist", "Schedule annual checkup", inbox_id, 3, None, Some((now + chrono::Duration::days(3)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "todo", None),
        
        // Sprint tasks
        ("Implement user authentication", "Add login/logout functionality with JWT tokens", sprint_id, 1, Some((now + chrono::Duration::days(1)).format("%Y-%m-%d %H:%M:%S").to_string()), Some((now + chrono::Duration::days(3)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "in-progress", work_tag_id),
        ("Write API documentation", "Document all endpoints with examples", sprint_id, 2, Some((now + chrono::Duration::days(2)).format("%Y-%m-%d %H:%M:%S").to_string()), Some((now + chrono::Duration::days(4)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "todo", work_tag_id),
        ("Setup CI/CD pipeline", "Configure GitHub Actions for automated testing and deployment", sprint_id, 1, Some((now + chrono::Duration::hours(2)).format("%Y-%m-%d %H:%M:%S").to_string()), Some((now + chrono::Duration::hours(6)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "done", work_tag_id),
        
        // Personal tasks
        ("Read 'Atomic Habits'", "Continue reading chapter 5", personal_id, 3, None, Some((now + chrono::Duration::days(7)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "todo", None),
        ("Plan weekend trip", "Research destinations and book accommodation", personal_id, 2, Some((now + chrono::Duration::days(5)).format("%Y-%m-%d %H:%M:%S").to_string()), Some((now + chrono::Duration::days(7)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "todo", home_tag_id),
        ("Organize photos", "Sort and backup photos from last vacation", personal_id, 4, None, None, false, "todo", home_tag_id),
        
        // Overdue task
        ("Submit expense report", "Submit Q3 expense report to accounting", inbox_id, 1, None, Some((now - chrono::Duration::days(2)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "todo", work_tag_id),
        
        // Completed task
        ("Update resume", "Add recent projects and skills", personal_id, 2, None, Some((now - chrono::Duration::days(1)).format("%Y-%m-%d %H:%M:%S").to_string()), false, "done", None),
    ];

    for (title, description, list_id, priority, start_at, end_at, all_day, status, tag_id) in tasks {
        let task_id = generate_id();
        
        sqlx::query(
            "INSERT INTO tasks (id, list_id, title, description, priority, start_at, end_at, all_day, status, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&task_id)
        .bind(list_id)
        .bind(title)
        .bind(description)
        .bind(priority)
        .bind(start_at)
        .bind(end_at)
        .bind(all_day)
        .bind(status)
        .bind(now.format("%Y-%m-%d %H:%M:%S").to_string())
        .execute(pool)
        .await?;

        // Add tag if specified
        if let Some(tag) = tag_id {
            sqlx::query(
                "INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)"
            )
            .bind(&task_id)
            .bind(tag)
            .execute(pool)
            .await?;
        }
    }

    Ok(())
}

async fn create_sample_habits(pool: &SqlitePool, workspace_id: &str) -> Result<()> {
    let habits = vec![
        ("Read 20 minutes", json!({"frequency": "daily", "days": [1,2,3,4,5,6,7]}), 5),
        ("Workout", json!({"frequency": "weekly", "days": [1,3,5]}), 12),
        ("Practice Arabic", json!({"frequency": "daily", "days": [1,2,3,4,5]}), 8),
    ];

    for (title, schedule_json, streak) in habits {
        let habit_id = generate_id();
        
        sqlx::query(
            "INSERT INTO habits (id, workspace_id, title, schedule_json, streak) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(&habit_id)
        .bind(workspace_id)
        .bind(title)
        .bind(schedule_json.to_string())
        .bind(streak)
        .execute(pool)
        .await?;

        // Create some sample habit logs for the streak
        let now = chrono::Utc::now().date_naive();
        for i in 0..streak {
            let date = now - chrono::Duration::days(i as i64);
            let log_id = generate_id();
            
            sqlx::query(
                "INSERT INTO habit_logs (id, habit_id, date, value) VALUES (?, ?, ?, ?)"
            )
            .bind(&log_id)
            .bind(&habit_id)
            .bind(date.format("%Y-%m-%d").to_string())
            .bind(1)
            .execute(pool)
            .await?;
        }
    }

    Ok(())
}

async fn create_sample_focus_sessions(pool: &SqlitePool) -> Result<()> {
    let now = chrono::Utc::now();
    let sessions = vec![
        (None, 1500, false), // 25 min work session
        (None, 300, true),   // 5 min break
        (None, 1500, false), // 25 min work session
        (None, 900, true),   // 15 min long break
    ];

    for (task_id, duration_sec, is_break) in sessions {
        let session_id = generate_id();
        let started_at = now - chrono::Duration::hours(2);
        
        sqlx::query(
            "INSERT INTO focus_sessions (id, task_id, started_at, duration_sec, is_break) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(&session_id)
        .bind(task_id)
        .bind(started_at.format("%Y-%m-%d %H:%M:%S").to_string())
        .bind(duration_sec)
        .bind(is_break)
        .execute(pool)
        .await?;
    }

    Ok(())
}
