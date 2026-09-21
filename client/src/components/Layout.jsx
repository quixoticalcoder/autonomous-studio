// components/Layout.jsx
import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  Sparkles,
  Users,
  History as HistoryIcon,
  Book,
  Menu,
  X,
  ChevronRight,
  Brain,
  Zap,
  Globe,
  Search,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  Target,
  Layers,
  Cpu,
  Shield,
  Rocket,
} from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      path: "/studio",
      label: "Creative Studio",
      icon: Sparkles,
      description: "AI-Powered Workflow",
      badge: "New",
    },
    {
      path: "/agents",
      label: "Agents",
      icon: Users,
      description: "Configure AI Models",
    },
    {
      path: "/history",
      label: "History",
      icon: HistoryIcon,
      description: "See usage history",
    },
    {
      path: "/profile",
      label: "Your Profile",
      icon: User,
      description: "See your account",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  autonomous-studio
                </h1>
                <p className="text-xs text-gray-500">
                  Creative Intelligence Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  {isActive && (
                    <ChevronRight className="text-blue-500" size={16} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100">
            {/* System Status */}
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-green-700">
                  System Status
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Live</span>
                </div>
              </div>
              <p className="text-xs text-green-600">All services operational</p>
            </div>

            {/* Version Info */}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                v2.1.0 • Powered by Multi-AI
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Left: Menu Button & Breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X size={24} className="text-gray-700" />
                ) : (
                  <Menu size={24} className="text-gray-700" />
                )}
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Home
                </Link>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {navItems.find(
                    (item) =>
                      location.pathname === item.path ||
                      location.pathname.startsWith(`${item.path}/`)
                  )?.label || "Dashboard"}
                </span>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search sessions, topics, or agents..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-3">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="px-6 pb-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-600 font-medium">
                  AI Services: Active
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu size={14} className="text-blue-500" />
                <span className="text-xs text-gray-600">
                  6 AI Models Available
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-green-500" />
                <span className="text-xs text-gray-600">Secure Session</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Stats Cards */}
          {location.pathname === "/dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 mb-1">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">128</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs text-green-600">
                    +12% this month
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 mb-1">
                      Active Agents
                    </p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users size={20} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  All systems operational
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Avg. Quality</p>
                    <p className="text-2xl font-bold text-gray-900">8.7/10</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-3 bg-green-400 rounded-full mx-px"
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs text-green-600">
                    High satisfaction
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 mb-1">
                      Processing Time
                    </p>
                    <p className="text-2xl font-bold text-gray-900">4.2s</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Zap size={20} className="text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs text-green-600">
                    -0.8s from last week
                  </span>
                </div>
              </div>
            </div>
          )}

          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <span className="text-sm text-gray-500">
                © 2024 autonomous-studio
              </span>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Support
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-gray-400" />
                <span className="text-sm text-gray-500">Global • English</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-sm text-gray-500">
                Status:{" "}
                <span className="font-medium text-green-600">
                  All Systems Normal
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
