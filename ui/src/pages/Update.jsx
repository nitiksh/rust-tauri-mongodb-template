import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate, useParams } from "react-router-dom";

function Update() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [loading, setLoading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        if (id && id !== "0") {
            loadMessageById(id);
        }
    }, [id]);

    async function loadMessages() {
        setLoadingMessages(true);
        setError(null);
        try {
            const result = await invoke("get_messages");
            setMessages(result);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoadingMessages(false);
        }
    }

    async function loadMessageById(messageId) {
        setLoading(true);
        setError(null);
        try {
            const message = await invoke("get_message_by_id", { id: messageId });
            setSelectedMessage(message);
            setTitle(message.title);
            setContent(message.content);
            setStatus(message.status);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    }

    function handleEditClick(message) {
        setSelectedMessage(message);
        setTitle(message.title);
        setContent(message.content);
        setStatus(message.status);
        setError(null);
    }

    function handleCancelEdit() {
        setSelectedMessage(null);
        setTitle("");
        setContent("");
        setStatus("draft");
        setError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await invoke("update_message", {
                id: selectedMessage.id,
                title: title.trim(),
                content: content.trim(),
                status,
            });
            navigate("/success");
        } catch (err) {
            setError(err.toString());
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Update Message</h1>
                <p>Modify an existing message in MongoDB</p>
            </div>

            <div className="content-card">
                {selectedMessage ? (
                    <form onSubmit={handleSubmit} className="form">
                        {error && <div className="error-banner">{error}</div>}

                        <div className="editing-header">
                            <h3>Editing: {selectedMessage.title}</h3>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn-text btn-sm"
                                disabled={loading}
                            >
                                ← Back to List
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter message title"
                                className="input"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter message content"
                                className="textarea"
                                rows="6"
                                disabled={loading}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="select"
                                disabled={loading}
                            >
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Message"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {loadingMessages && (
                            <div className="status-message">Loading messages...</div>
                        )}

                        {error && (
                            <div className="error-message">
                                <p>{error}</p>
                                <button onClick={loadMessages} className="btn-secondary">
                                    Retry
                                </button>
                            </div>
                        )}

                        {!loadingMessages && !error && messages.length === 0 && (
                            <div className="empty-state">
                                <svg
                                    className="empty-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="9" y1="9" x2="15" y2="9"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                                <h2>No Messages Available</h2>
                                <p>Create a message first to update it</p>
                                <button
                                    onClick={() => navigate("/create")}
                                    className="btn-primary"
                                >
                                    Create Message
                                </button>
                            </div>
                        )}

                        {!loadingMessages && !error && messages.length > 0 && (
                            <div className="messages-list">
                                <p className="list-description">
                                    Select a message to edit:
                                </p>
                                {messages.map((message) => (
                                    <div key={message.id} className="message-card">
                                        <div className="message-header">
                                            <h3>{message.title}</h3>
                                            <span className={`status-badge ${message.status}`}>
                                                {message.status}
                                            </span>
                                        </div>
                                        <p className="message-content">{message.content}</p>
                                        <div className="message-actions">
                                            <button
                                                onClick={() => handleEditClick(message)}
                                                className="btn-primary btn-sm"
                                            >
                                                Edit Message
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Update;
