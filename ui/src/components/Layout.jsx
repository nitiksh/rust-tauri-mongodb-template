import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();

    const isActive = (path) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <Link
                    to="/"
                    className={`nav-item ${isActive("/") ? "active" : ""}`}
                >
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                    </svg>
                    <span>Inbox</span>
                </Link>

                <Link
                    to="/create"
                    className={`nav-item ${isActive("/create") ? "active" : ""}`}
                >
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Create</span>
                </Link>

                <Link
                    to="/update/0"
                    className={`nav-item ${isActive("/update") ? "active" : ""}`}
                >
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                    </svg>
                    <span>Update</span>
                </Link>

                <Link
                    to="/delete"
                    className={`nav-item ${isActive("/delete") ? "active" : ""}`}
                >
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Delete</span>
                </Link>

                <div className="sidebar-footer">
                    <div className="db-status">MongoDB CRUD Operations</div>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
