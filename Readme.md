# 🚀 Tauri + React + MongoDB Template

A simple educational template to learn building desktop applications with **Tauri v2**, **React**, and **MongoDB**.

---

## ✨ Features

- Full CRUD operations (Create, Read, Update, Delete)
- MongoDB database integration
- React frontend with routing
- Environment-based configuration
- Clean and simple code structure

---

## 🧰 Prerequisites

- **Node.js** (v18 or higher)
- **Rust** ([Install here](https://rustup.rs))
- **MongoDB** (Local or Atlas)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nitiksh/rust-tauri-mongodb-template.git
cd rust-tauri-mongodb-template
```

### 2. Install Dependencies

```bash
cd ui
npm install
```

### 3. Setup MongoDB

Create `.env` file in `src-tauri` folder:

```bash
cd ../src-tauri
cp .env.example .env
```

Edit `.env` with your MongoDB credentials:

```env
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=tauri_app
```

### 4. Run the App

```bash
cargo tauri dev
```

### 5. Build for Production

```bash
cargo tauri build
```

---

## 📁 Project Structure

```
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   ├── lib.rs         # CRUD commands
│   │   ├── db.rs          # MongoDB connection
│   │   └── state.rs       # App state
│   └── .env               # MongoDB config
│
└── ui/                     # React frontend
    └── src/
        ├── App.jsx        # Router
        ├── components/    # Layout
        └── pages/         # CRUD pages
```

---

## 🎯 CRUD Operations

### Available Commands

```javascript
// Create
await invoke("create_message", { title, content, status });

// Read All
await invoke("get_messages");

// Read One
await invoke("get_message_by_id", { id });

// Update
await invoke("update_message", { id, title, content, status });

// Delete
await invoke("delete_message", { id });
```

### Message Structure

```rust
pub struct Message {
    id: Option<ObjectId>,
    title: String,
    content: String,
    status: String, // "draft", "sent", or "archived"
}
```

### Routes

- `/` - View all messages
- `/create` - Create message
- `/update/:id` - Update message
- `/delete` - Delete message
- `/success` - Success page

---

## � Learn More

- [Tauri Docs](https://tauri.app/)
- [React Docs](https://react.dev/)
- [MongoDB Rust Driver](https://www.mongodb.com/docs/drivers/rust/)

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

Happy Learning! 🎉
