use anyhow::{Context, Result};
use mongodb::{
    options::{ClientOptions, ServerApi, ServerApiVersion},
    Client, Database,
};
use std::time::Duration;

/// MongoDB connection configuration
#[derive(Clone)]
pub struct DbConnection {
    pub client: Client,
    pub database: Database,
}

impl DbConnection {
    /// Create a new database connection
    ///
    /// # Configuration
    /// MongoDB settings are loaded from the .env file in the src-tauri directory.
    /// Copy .env.example to .env and configure your MongoDB connection.
    ///
    /// Required environment variables:
    /// - MONGODB_URI: Your MongoDB connection string
    /// - DATABASE_NAME: Name of the database to use
    pub async fn new() -> Result<Self> {
        // Load environment variables from .env file
        dotenvy::dotenv().ok();

        // Read MongoDB configuration from environment variables
        let mongodb_uri = std::env::var("MONGODB_URI").context(
            "MONGODB_URI not found in environment. Please create a .env file in src-tauri/",
        )?;

        let database_name = std::env::var("DATABASE_NAME").context(
            "DATABASE_NAME not found in environment. Please create a .env file in src-tauri/",
        )?;

        log::info!("Connecting to MongoDB...");

        // Parse connection string
        let mut client_options = ClientOptions::parse(&mongodb_uri)
            .await
            .context("Failed to parse MongoDB URI")?;

        // Set the Stable API version (recommended for MongoDB Atlas)
        let server_api = ServerApi::builder().version(ServerApiVersion::V1).build();
        client_options.server_api = Some(server_api);

        // Configure timeouts
        client_options.connect_timeout = Some(Duration::from_secs(10));
        client_options.server_selection_timeout = Some(Duration::from_secs(10));
        client_options.app_name = Some("TauriApp".to_string());

        // Create client
        let client =
            Client::with_options(client_options).context("Failed to create MongoDB client")?;

        // Test the connection
        client
            .database("admin")
            .run_command(mongodb::bson::doc! { "ping": 1 })
            .await
            .context("Failed to ping MongoDB")?;

        log::info!("Successfully connected to MongoDB");

        let database = client.database(&database_name);

        Ok(Self { client, database })
    }

    /// Get a collection from the database
    #[allow(dead_code)]
    pub fn collection<T>(&self, name: &str) -> mongodb::Collection<T>
    where
        T: Send + Sync,
    {
        self.database.collection(name)
    }

    /// Check if the connection is alive
    pub async fn is_connected(&self) -> bool {
        self.client
            .database("admin")
            .run_command(mongodb::bson::doc! { "ping": 1 })
            .await
            .is_ok()
    }

    /// Get the database name
    pub fn database_name(&self) -> &str {
        self.database.name()
    }
}

/// Initialize the database connection
pub async fn init_db() -> Result<DbConnection> {
    DbConnection::new().await
}
