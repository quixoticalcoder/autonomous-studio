import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setAuthToken, setUser, isAuthenticated } from "../utils/auth";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Sparkles,
  Brain,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Palette,
  Rocket,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || "/studio";
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (mode === "register") {
      if (!formData.username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!formData.email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!formData.email.includes("@")) {
        setError("Please enter a valid email");
        return false;
      }
      if (!formData.full_name.trim()) {
        setError("Full name is required");
        return false;
      }
    } else {
      if (!formData.username.trim() && !formData.email.trim()) {
        setError("Username or email is required");
        return false;
      }
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (mode === "register" && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/users/login" : "/users/register";
      const payload =
        mode === "login"
          ? {
              username: formData.username || formData.email,
              password: formData.password,
            }
          : {
              username: formData.username,
              email: formData.email,
              password: formData.password,
              full_name: formData.full_name,
            };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Success - Store token and user data
      setSuccess(data.message);

      if (data.token) {
        setAuthToken(data.token);
      }

      if (data.user) {
        setUser(data.user);
      }

      // Redirect after success
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/studio";
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setSuccess("");
    setFormData({
      username: "",
      email: "",
      password: "",
      full_name: "",
    });
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Creativity",
      description: "Multi-agent system for innovative solutions",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate ideas in seconds",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Palette,
      title: "Multiple Styles",
      description: "5 creative prompt styles",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Sparkles className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  autonomous-studio
                </h1>
                <p className="text-gray-600">Transform ideas into reality</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Harness the power of multiple AI agents working together to
              generate, critique, refine, and present innovative solutions for
              your creative challenges.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${feature.color} mb-3`}
                >
                  <feature.icon className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
                <p className="text-sm text-gray-600">AI Agents</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">5</div>
                <p className="text-sm text-gray-600">Prompt Styles</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-1">6</div>
                <p className="text-sm text-gray-600">AI Models</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="lg:hidden bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  autonomous-studio
                </h1>
                <p className="text-blue-100 text-sm">
                  Transform ideas into reality
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {mode === "login"
                    ? "Sign in to continue your creative journey"
                    : "Join us to unlock AI-powered creativity"}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${
                  mode === "login"
                    ? "from-blue-500 to-blue-600"
                    : "from-purple-500 to-pink-500"
                }`}
              >
                {mode === "login" ? (
                  <LogIn className="text-white" size={24} />
                ) : (
                  <UserPlus className="text-white" size={24} />
                )}
              </div>
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => mode !== "login" && switchMode()}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  mode === "login"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => mode !== "register" && switchMode()}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  mode === "register"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-green-800">Success</p>
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "login" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username or email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              {mode === "register" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="johndoe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="text-gray-400" size={20} />
                    ) : (
                      <Eye className="text-gray-400" size={20} />
                    )}
                  </button>
                </div>
                {mode === "register" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  mode === "login"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? (
                      <>
                        <LogIn size={20} />
                        Sign In
                      </>
                    ) : (
                      <>
                        <Rocket size={20} />
                        Create Account
                      </>
                    )}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={switchMode}
                  className={`font-semibold ${
                    mode === "login"
                      ? "text-purple-600 hover:text-purple-700"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {mode === "login" ? "Create one now" : "Sign in"}
                </button>
              </p>
            </div>

            {mode === "register" && (
              <p className="text-xs text-gray-500 text-center mt-4">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </div>

          <div className="lg:hidden bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              {features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-r ${feature.color}`}
                  >
                    <feature.icon className="text-white" size={14} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
