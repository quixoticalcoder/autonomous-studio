// pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders, logout } from "../utils/auth";
import {
  User,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Loader2,
  CheckCircle,
  Shield,
  Clock,
  Edit2,
  Save,
  X,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/users/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        logout();
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser(data.user);
      setEditData({
        full_name: data.user.full_name || "",
        email: data.user.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(editData),
      });

      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        logout();
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      setUser(data.user);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="animate-spin text-purple-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
          <button
            onClick={() => navigate("/studio")}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Back to Studio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <User className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/studio")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Studio
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      user.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm text-white rounded capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            {!editing ? (
              <div className="space-y-4">
                {/* Full Name */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="text-gray-400 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">
                      {user.full_name || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {/* Username */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="text-gray-400 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium text-gray-900">{user.username}</p>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-400 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>

                {/* Last Login */}
                {user.last_login && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="text-gray-400 mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(user.last_login)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {user.preferences && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <Settings className="text-blue-500 mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-blue-700 font-medium mb-2">
                        Preferences
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-blue-600">Default Agent</p>
                          <p className="text-sm font-medium text-blue-800 capitalize">
                            {user.preferences.default_agent || "gemini"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600">Theme</p>
                          <p className="text-sm font-medium text-blue-800 capitalize">
                            {user.preferences.theme || "light"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-4">
                {/* Full Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) =>
                      setEditData({ ...editData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditData({
                        full_name: user.full_name || "",
                        email: user.email || "",
                      });
                    }}
                    disabled={saving}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-purple-600 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Account Security</h3>
              <p className="text-sm text-gray-600">
                Your account is secure. All data is encrypted and protected. To
                change your password, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;