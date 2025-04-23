import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Profile() {
    const { email } = useParams(); // Get the email from the URL
    const [profile, setProfile] = useState({ email: "", password: "" });
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProfile();
    }, [email]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/employees/profile/${email}`);
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage("❌ Failed to fetch profile.");
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/employees/profile/${email}`, {
                newEmail,
                newPassword,
            });

            setMessage("✅ Profile updated successfully!");
            setProfile(response.data.employee); // Update the displayed profile
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("❌ Failed to update profile.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Profile</h2>
            <div className="card shadow-sm p-4">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={profile.email}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={profile.password}
                        readOnly
                    />
                </div>

                <h4 className="mt-4">Update Profile</h4>
                <div className="mb-3">
                    <label htmlFor="newEmail" className="form-label">New Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="newEmail"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleUpdateProfile}>
                    Update Profile
                </button>
                {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
        </div>
    );
}

export default Profile;