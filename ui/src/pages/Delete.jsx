import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

function Delete() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMessages();
    }, []);

    async function loadMessages() {
        setLoading(true);
        setError(null);
        try {
            const result = await invoke("get_messages");
            setMessages(result);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(messageId, messageTitle) {
        if (!confirm(`Are you sure you want to delete "${messageTitle}"?`)) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await invoke("delete_message", { id: messageId });
            // Remove the deleted message from the list
            setMessages(messages.filter(m => m.id !== messageId));
            setLoading(false);
        } catch (err) {
            setError(err.toString());
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Delete Message</h1>
                <p>Remove messages from MongoDB</p>
            </div>

            <div className="content-card">
                {error && <div className="error-banner">{error}</div>}

                {loading ? (
                    <div className="status-message">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <h2>No Messages Available</h2>
                        <p>There are no messages to delete</p>
                    </div>
                ) : (
                    <div className="messages-list">
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
                                        onClick={() => handleDelete(message.id, message.title)}
                                        className="btn-danger btn-sm"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Delete;
