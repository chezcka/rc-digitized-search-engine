import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { getDatabase, ref, get, update } from "firebase/database";

import "../styles/Profile.css";

export default function Profile({ open, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function fetchProfile() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfile(data);
          setNameInput(data.fullName || "");
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [open]);

  async function handleSave() {
    try {
      setSaving(true);

      const user = auth.currentUser;
      if (!user) return;

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      await update(userRef, {
        fullName: nameInput
      });

      setProfile((prev) => ({
        ...prev,
        fullName: nameInput
      }));

      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div
        className="profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="profile-header">
          <h2>User Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        {loading ? (
          <p className="profile-loading">Loading profile...</p>
        ) : profile ? (
          <div className="profile-body">
            {/* NAME */}
            <div className="profile-row">
              <span>Name</span>
              {editing ? (
                <input
                  className="profile-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                />
              ) : (
                <strong>{profile.fullName || "—"}</strong>
              )}
            </div>

            {/* EMAIL (READ ONLY) */}
            <div className="profile-row">
              <span>Email</span>
              <strong>{auth.currentUser.email}</strong>
            </div>

            {/* MEMBER SINCE */}
            <div className="profile-row">
              <span>Member Since</span>
              <strong>
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "—"}
              </strong>
            </div>

            {/* ACTIONS */}
            <div className="profile-actions">
              {editing ? (
                <>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditing(false);
                      setNameInput(profile.fullName || "");
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="profile-empty">No profile data found.</p>
        )}
      </div>
    </div>
  );
}
