import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Link } from "react-router-dom";

function Inbox() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
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

    return (
        <div className="page">
            <div className="page-header">
                <h1>Inbox</h1>
                <p>View all messages from MongoDB</p>
            </div>

            <div className="content-card">
                {loading && <div className="status-message">Loading messages...</div>}

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={loadMessages} className="btn-secondary">
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && messages.length === 0 && (
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="9" x2="15" y2="9"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        <h2>No Messages Yet</h2>
                        <p>Create your first message to get started</p>
                        <Link to="/create" className="btn-primary">
                            Create Message
                        </Link>
                    </div>
                )}

                {!loading && !error && messages.length > 0 && (
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
                                    <Link
                                        to={`/update/${message.id}`}
                                        className="btn-secondary btn-sm"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <button onClick={loadMessages} className="btn-secondary">
                            Refresh
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Inbox;
