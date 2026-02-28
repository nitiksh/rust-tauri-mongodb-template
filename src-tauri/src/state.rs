use crate::db::DbConnection;
use std::sync::Arc;
use tokio::sync::RwLock;

/// Application state that holds the database connection
///
/// This state is shared across all Tauri commands and provides
/// thread-safe access to the database connection.
#[derive(Clone)]
pub struct AppState {
    pub db: Arc<RwLock<Option<DbConnection>>>,
}

impl AppState {
    /// Create a new app state
    pub fn new() -> Self {
        Self {
            db: Arc::new(RwLock::new(None)),
        }
    }

    /// Set the database connection
    pub async fn set_db(&self, connection: DbConnection) {
        let mut db = self.db.write().await;
        *db = Some(connection);
    }

    /// Get a clone of the database connection
    pub async fn get_db(&self) -> Option<DbConnection> {
        let db = self.db.read().await;
        db.clone()
    }

    /// Check if database is connected
    #[allow(dead_code)]
    pub async fn is_db_connected(&self) -> bool {
        if let Some(conn) = self.get_db().await {
            conn.is_connected().await
        } else {
            false
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}
