// ============================================================
// pages/Profile.jsx — User Profile Page
// ============================================================
// Displays the current user's info (name, email, student ID).
// Includes a "Delete Account" button with confirmation that
// removes the user and all their product listings.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiUser, FiMail, FiHash } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { deleteAccount } from "../services/api";
import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? All your listings will be removed. This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteAccount();
      logout();
      toast.success("Account deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="profile-page container">
      <h1 className="page-title">My Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-field">
            <FiUser size={16} />
            <div>
              <span className="field-label">Name</span>
              <span className="field-value">{user.name}</span>
            </div>
          </div>
          <div className="profile-field">
            <FiMail size={16} />
            <div>
              <span className="field-label">Email</span>
              <span className="field-value">{user.email}</span>
            </div>
          </div>
          {user.studentId && (
            <div className="profile-field">
              <FiHash size={16} />
              <div>
                <span className="field-label">Student ID</span>
                <span className="field-value">{user.studentId}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="danger-zone">
        <h2>Danger Zone</h2>
        <p>Permanently delete your account and all your product listings.</p>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          <FiTrash2 size={16} />
          {deleting ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
