mod db;
mod state;

use futures::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId, Document};
use serde::{Deserialize, Serialize};
use state::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub content: String,
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct MessageResponse {
    pub id: String,
    pub title: String,
    pub content: String,
    pub status: String,
}

impl From<Message> for MessageResponse {
    fn from(message: Message) -> Self {
        MessageResponse {
            id: message.id.map(|id| id.to_hex()).unwrap_or_default(),
            title: message.title,
            content: message.content,
            status: message.status,
        }
    }
}

#[tauri::command]
async fn create_message(
    state: tauri::State<'_, AppState>,
    title: String,
    content: String,
    status: String,
) -> Result<String, String> {
    if let Some(db_conn) = state.get_db().await {
        let collection = db_conn.collection::<Message>("messages");

        let new_message = Message {
            id: None,
            title,
            content,
            status,
        };

        match collection.insert_one(new_message).await {
            Ok(result) => Ok(result.inserted_id.to_string()),
            Err(e) => Err(format!("Failed to create message: {}", e)),
        }
    } else {
        Err("Database not connected".to_string())
    }
}

#[tauri::command]
async fn get_messages(state: tauri::State<'_, AppState>) -> Result<Vec<MessageResponse>, String> {
    if let Some(db_conn) = state.get_db().await {
        let collection = db_conn.collection::<Message>("messages");

        match collection.find(doc! {}).await {
            Ok(cursor) => {
                let messages: Vec<Message> = cursor
                    .try_collect()
                    .await
                    .map_err(|e| format!("Failed to collect messages: {}", e))?;
                let responses: Vec<MessageResponse> =
                    messages.into_iter().map(|m| m.into()).collect();
                Ok(responses)
            }
            Err(e) => Err(format!("Failed to fetch messages: {}", e)),
        }
    } else {
        Err("Database not connected".to_string())
    }
}

#[tauri::command]
async fn get_message_by_id(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<MessageResponse, String> {
    if let Some(db_conn) = state.get_db().await {
        let collection = db_conn.collection::<Message>("messages");
        let object_id = ObjectId::parse_str(&id).map_err(|e| format!("Invalid ID: {}", e))?;

        match collection.find_one(doc! { "_id": object_id }).await {
            Ok(Some(message)) => Ok(message.into()),
            Ok(None) => Err("Message not found".to_string()),
            Err(e) => Err(format!("Failed to fetch message: {}", e)),
        }
    } else {
        Err("Database not connected".to_string())
    }
}

#[tauri::command]
async fn update_message(
    state: tauri::State<'_, AppState>,
    id: String,
    title: String,
    content: String,
    status: String,
) -> Result<String, String> {
    if let Some(db_conn) = state.get_db().await {
        let collection = db_conn.collection::<Document>("messages");
        let object_id = ObjectId::parse_str(&id).map_err(|e| format!("Invalid ID: {}", e))?;

        let update = doc! {
            "$set": {
                "title": title,
                "content": content,
                "status": status,
            }
        };

        match collection
            .update_one(doc! { "_id": object_id }, update)
            .await
        {
            Ok(_) => Ok("Message updated successfully".to_string()),
            Err(e) => Err(format!("Failed to update message: {}", e)),
        }
    } else {
        Err("Database not connected".to_string())
    }
}

#[tauri::command]
async fn delete_message(state: tauri::State<'_, AppState>, id: String) -> Result<String, String> {
    if let Some(db_conn) = state.get_db().await {
        let collection = db_conn.collection::<Document>("messages");
        let object_id = ObjectId::parse_str(&id).map_err(|e| format!("Invalid ID: {}", e))?;

        match collection.delete_one(doc! { "_id": object_id }).await {
            Ok(_) => Ok("Message deleted successfully".to_string()),
            Err(e) => Err(format!("Failed to delete message: {}", e)),
        }
    } else {
        Err("Database not connected".to_string())
    }
}

#[tauri::command]
async fn get_db_status(state: tauri::State<'_, AppState>) -> Result<String, String> {
    if let Some(db_conn) = state.get_db().await {
        if db_conn.is_connected().await {
            Ok(format!(
                "Connected to database: {}",
                db_conn.database_name()
            ))
        } else {
            Ok("Connection lost".to_string())
        }
    } else {
        Ok("Not connected".to_string())
    }
}

/// Initialize the database connection
async fn init_database(state: &AppState) {
    log::info!("Initializing database connection...");

    match db::init_db().await {
        Ok(connection) => {
            state.set_db(connection).await;
            log::info!("Database connected successfully");
        }
        Err(e) => {
            log::error!("Failed to connect to database: {}", e);
            log::error!("Application will start without database connection");
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = AppState::new();
    let app_state_clone = app_state.clone();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .build(),
        )
        .manage(app_state)
        .setup(|_app| {
            log::info!("Starting application...");

            // Initialize database connection asynchronously
            tauri::async_runtime::spawn(async move {
                init_database(&app_state_clone).await;
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_message,
            get_messages,
            get_message_by_id,
            update_message,
            delete_message,
            get_db_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
