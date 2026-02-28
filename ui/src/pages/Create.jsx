import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

function Create() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await invoke("create_message", {
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
                <h1>Create Message</h1>
                <p>Add a new message to MongoDB</p>
            </div>

            <div className="content-card">
                <form onSubmit={handleSubmit} className="form">
                    {error && <div className="error-banner">{error}</div>}

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
                            {loading ? "Creating..." : "Create Message"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Create;
