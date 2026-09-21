// pages/History.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders, logout } from "../utils/auth";
import {
  History as HistoryIcon,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Zap,
  Loader2,
  Search,
  Filter,
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const res = await fetch(
        `${API_BASE}/history?page=${page}&per_page=12`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        logout();
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch history");
      }

      const data = await res.json();
      setHistory(data.history || []);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
      alert(`Failed to load history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (historyId) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setDeleting(historyId);
    try {
      const res = await fetch(`${API_BASE}/history/${historyId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete history");
      }

      // Refresh history list
      fetchHistory();
    } catch (error) {
      console.error("Error deleting history:", error);
      alert("Failed to delete history entry");
    } finally {
      setDeleting(null);
    }
  };

  const clearAllHistory = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL history? This cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`${API_BASE}/history/clear`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to clear history");
      }

      setHistory([]);
      setPage(1);
      alert("All history cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
      alert("Failed to clear history");
    }
  };

  const previewHistory = (entry) => {
    navigate("/preview", {
      state: {
        finalOutput: entry.presentation,
        topic: entry.topic,
        workflow: [
          {
            agent: "Idea Agent",
            icon: "idea",
            output: { concepts: entry.concepts },
          },
          {
            agent: "Critic Agent",
            icon: "critic",
            output: { critiques: entry.critiques },
          },
          {
            agent: "Refiner Agent",
            icon: "refiner",
            output: { refined: entry.refined },
          },
          {
            agent: "Presenter Agent",
            icon: "presenter",
            output: entry.presentation,
          },
        ],
        aiMode: "single",
        singleAiModel: entry.agent_model,
        agentModels: {
          idea: entry.agent_model,
          critic: entry.agent_model,
          refiner: entry.agent_model,
          presenter: entry.agent_model,
        },
      },
    });
  };

  const getModelColor = (model) => {
    const colors = {
      gemini: "from-blue-500 to-blue-600",
      claude: "from-orange-500 to-orange-600",
      xiaomi: "from-red-500 to-red-600",
      allenai: "from-green-500 to-green-600",
      nvidia: "from-emerald-500 to-emerald-600",
      deepseek: "from-blue-600 to-blue-700",
    };
    return colors[model] || "from-gray-500 to-gray-600";
  };

  const getModelName = (model) => {
    const names = {
      gemini: "Gemini",
      claude: "Claude",
      xiaomi: "Xiaomi",
      allenai: "AllenAI",
      nvidia: "NVIDIA",
      deepseek: "DeepSeek",
    };
    return names[model] || model;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const filteredHistory = history.filter((entry) =>
    entry.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <HistoryIcon className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Session History
                </h1>
                <p className="text-gray-600">
                  {total} creative sessions saved
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/studio")}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Back to Studio
              </button>
              {history.length > 0 && (
                <button
                  onClick={clearAllHistory}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
            <p className="text-gray-600">Loading your history...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
              <AlertCircle className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? "No results found" : "No history yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try searching with different keywords"
                : "Start your first creative session to see it here"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/studio")}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Go to Studio
              </button>
            )}
          </div>
        ) : (
          <>
            {/* History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">
                        {entry.topic}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded bg-gradient-to-r ${getModelColor(
                          entry.agent_model
                        )} text-white whitespace-nowrap`}
                      >
                        {getModelName(entry.agent_model)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(entry.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {entry.execution_time}s
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Concepts:</span>
                        <span className="font-semibold text-gray-900">
                          {entry.concepts?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Style:</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {entry.prompt_style}
                        </span>
                      </div>
                    </div>

                    {/* Preview Summary */}
                    {entry.presentation?.summary && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {entry.presentation.summary}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => previewHistory(entry)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                      <button
                        onClick={() => deleteHistory(entry.id)}
                        disabled={deleting === entry.id}
                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {deleting === entry.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Footer */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-start gap-3">
            <RefreshCw className="text-purple-600 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                History Auto-Save
              </h3>
              <p className="text-sm text-gray-600">
                Every completed creative session is automatically saved here.
                Your history helps you track your creative journey and revisit
                past ideas anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;