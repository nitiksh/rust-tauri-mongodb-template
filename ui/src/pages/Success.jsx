import { useNavigate } from "react-router-dom";

function Success() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="success-container">
                <div className="success-illustration">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>

                <h1 className="success-title">All Done!</h1>
                <p className="success-message">
                    Your operation was completed successfully
                </p>

                <button onClick={() => navigate("/")} className="btn-primary">
                    Back to Inbox
                </button>
            </div>
        </div>
    );
}

export default Success;
