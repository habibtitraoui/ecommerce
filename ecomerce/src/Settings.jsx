import { useState } from "react";

const Settings = () => {
    const [theme, setTheme] = useState("light"); // Theme preference
    const [notifications, setNotifications] = useState(true); // Notifications preference
    const [email, setEmail] = useState("admin@example.com"); // User email
    const [password, setPassword] = useState(""); // User password
    const [message, setMessage] = useState(""); // Success/error message

    const handleSaveSettings = () => {
        // Save settings logic (e.g., send to backend)
        setMessage("✅ Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    };

    return (
        <div className="container mt-4">
            <h2>Settings</h2>
            <div className="card shadow-sm p-4">
                <div className="mb-3">
                    <label htmlFor="theme" className="form-label">Theme</label>
                    <select
                        className="form-select"
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="notifications"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                    />
                    <label htmlFor="notifications" className="form-check-label">Enable Notifications</label>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSaveSettings}>
                    Save Settings
                </button>
                {message && <div className="mt-3 alert alert-success">{message}</div>}
            </div>
        </div>
    );
};

export default Settings;