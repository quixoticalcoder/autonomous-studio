// pages/Studio.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthHeaders, logout } from "../utils/auth";
import {
  Lightbulb,
  AlertCircle,
  RefreshCw,
  Presentation,
  Play,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  ChevronRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Download,
  Share2,
  Save,
  Brain,
  Terminal,
  Users,
  Workflow,
  BarChart3,
  Globe,
  TrendingUp,
  Shield,
  Rocket,
  Palette,
  Target,
  Star,
  MessageSquare,
  Clock,
  Cpu,
  Layers,
  GitBranch,
  FileText,
  Bot,
  Settings,
  Cpu as CpuIcon,
  Server,
  Network,
  FileCode,
  GraduationCap,
  Eye,
  Wand2,
  Briefcase,
  Crown,
  Trophy,
  Award,
  TargetIcon,
  LineChart,
  Calendar,
  CheckSquare,
  Users as UsersIcon,
  DollarSign,
  PieChart,
  TrendingUp as TrendingUpIcon,
  Globe as GlobeIcon,
  Zap as ZapIcon,
} from "lucide-react";

export const iconMap = {
  idea: Lightbulb,
  critic: AlertCircle,
  refiner: RefreshCw,
  presenter: Presentation,
  error: XCircle,
};

const API_BASE = import.meta.env.VITE_API_BASE;


const Studio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [running, setRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState("");
  const [workflow, setWorkflow] = useState([]);
  const [finalOutput, setFinalOutput] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [conceptFeedback, setConceptFeedback] = useState({});
  const [executionTime, setExecutionTime] = useState(null);
  const [promptStyle, setPromptStyle] = useState("standard");
  
  // Prompt Style Templates
  const PROMPT_STYLES = [
    {
      id: "standard",
      name: "Standard",
      icon: FileCode,
      description: "Balanced professional approach",
      color: "from-blue-500 to-blue-600",
      tone: "Professional & Balanced"
    },
    {
      id: "creative",
      name: "Creative",
      icon: Wand2,
      description: "Innovative and imaginative thinking",
      color: "from-purple-500 to-pink-500",
      tone: "Innovative & Bold"
    },
    {
      id: "professional",
      name: "Executive",
      icon: Briefcase,
      description: "Business-focused strategy",
      color: "from-green-500 to-emerald-600",
      tone: "Strategic & Concise"
    },
    {
      id: "academic",
      name: "Academic",
      icon: GraduationCap,
      description: "Analytical and evidence-based",
      color: "from-indigo-500 to-purple-600",
      tone: "Analytical & Rigorous"
    },
    {
      id: "visionary",
      name: "Visionary",
      icon: Eye,
      description: "Future-focused transformation",
      color: "from-orange-500 to-red-500",
      tone: "Inspirational & Transformative"
    },
  ];

  const AVAILABLE_MODELS = [
    { id: "gemini", name: "Google Gemini", description: "Fast and creative", icon: "🔷" },
    { id: "claude", name: "Anthropic Claude", description: "Thoughtful and detailed", icon: "🟠" },
    { id: "xiaomi", name: "Xiaomi Mimo", description: "Free via OpenRouter", icon: "🔴" },
    { id: "allenai", name: "AllenAI Olmo", description: "Free via OpenRouter", icon: "🟢" },
    { id: "nvidia", name: "NVIDIA Nemotron", description: "Free via OpenRouter", icon: "💚" },
    { id: "deepseek", name: "Deepseek Nex", description: "Free via OpenRouter", icon: "🔶" },
  ];

  const [aiMode, setAiMode] = useState("single");
  const [singleAiModel, setSingleAiModel] = useState("gemini");
  const [agentModels, setAgentModels] = useState({
    idea: "gemini",
    critic: "allenai",
    refiner: "deepseek",
    presenter: "nvidia",
  });

  // Load topic from URL state if available
  useEffect(() => {
    if (location.state?.topic) {
      setTopic(location.state.topic);
    }
  }, [location.state]);

  const agents = [
    {
      name: "Idea Agent",
      icon: Lightbulb,
      description: "Generates innovative concepts",
      color: "yellow",
      role: "Innovation Strategist"
    },
    {
      name: "Critic Agent",
      icon: AlertCircle,
      description: "Analyzes risks and opportunities",
      color: "red",
      role: "Risk Analyst"
    },
    {
      name: "Refiner Agent",
      icon: RefreshCw,
      description: "Enhances concepts iteratively",
      color: "blue",
      role: "Refinement Specialist"
    },
    {
      name: "Presenter Agent",
      icon: Presentation,
      description: "Creates executive presentations",
      color: "green",
      role: "Executive Presenter"
    },
  ];

  // Update agent models when single AI model changes
  useEffect(() => {
    if (aiMode === "single") {
      const updatedModels = {};
      Object.keys(agentModels).forEach((key) => {
        updatedModels[key] = singleAiModel;
      });
      setAgentModels(updatedModels);
    }
  }, [singleAiModel, aiMode]);

  const getAgentEndpoint = (agentName) => {
    const agentKey = agentName.toLowerCase().replace(" agent", "");
    return `/ai/agents/${agentKey}`;
  };
  const exportSession = () => {
    const data = {
      topic,
      finalOutput,
      workflow,
      aiMode,
      singleAiModel,
      agentModels,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autonomous-studio-${topic
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const callAgent = async (url, payload, agentName) => {
  const fullUrl = `${API_BASE}${url}`;
  const agentKey = agentName.toLowerCase().replace(" agent", "");
  const selectedModel = agentModels[agentKey];

  try {
    const res = await fetch(fullUrl, {
      method: "POST",
      headers: getAuthHeaders(), // Changed from manual headers
      body: JSON.stringify({
        ...payload,
        agent: selectedModel,
        promptStyle: promptStyle,
      }),
    });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      logout();
      return;
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

  const runStudio = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first");
      return;
    }

    const startTime = Date.now();
    setRunning(true);
    setWorkflow([]);
    setFinalOutput(null);
    setShowDetails({});
    setConceptFeedback({});
    setExecutionTime(null);

    try {
      /* -------- Idea Agent -------- */
      setCurrentStage("idea");
      const ideaRes = await callAgent(
        getAgentEndpoint("Idea Agent"),
        { topic },
        "Idea Agent"
      );

      const ideaStep = {
        agent: "Idea Agent",
        icon: "idea",
        output: ideaRes.output,
        timestamp: new Date().toISOString(),
        duration: `${ideaRes.executionTime || 2}s`,
        status: "completed",
        provider: agentModels.idea,
        promptStyle: promptStyle,
      };
      setWorkflow((prev) => [...prev, ideaStep]);

      const concepts = ideaRes.output?.concepts || [];

      if (concepts.length === 0) {
        throw new Error("No concepts generated by Idea Agent");
      }

      /* -------- Critic Agent -------- */
      setCurrentStage("critic");
      const criticRes = await callAgent(
        getAgentEndpoint("Critic Agent"),
        {
          topic,
          concepts,
        },
        "Critic Agent"
      );

      const criticStep = {
        agent: "Critic Agent",
        icon: "critic",
        output: criticRes.output,
        timestamp: new Date().toISOString(),
        duration: `${criticRes.executionTime || 3}s`,
        status: "completed",
        provider: agentModels.critic,
        promptStyle: promptStyle,
      };
      setWorkflow((prev) => [...prev, criticStep]);

      const critiques = criticRes.output?.critiques || [];

      /* -------- Refiner Agent -------- */
      setCurrentStage("refiner");
      const refinerRes = await callAgent(
        getAgentEndpoint("Refiner Agent"),
        {
          topic,
          concepts,
          critiques,
        },
        "Refiner Agent"
      );

      const refinerStep = {
        agent: "Refiner Agent",
        icon: "refiner",
        output: refinerRes.output,
        timestamp: new Date().toISOString(),
        duration: `${refinerRes.executionTime || 4}s`,
        status: "completed",
        provider: agentModels.refiner,
        promptStyle: promptStyle,
      };
      setWorkflow((prev) => [...prev, refinerStep]);

      const refined = refinerRes.output?.refined || [];

      /* -------- Presenter Agent -------- */
      setCurrentStage("presenter");
      const presenterRes = await callAgent(
        getAgentEndpoint("Presenter Agent"),
        {
          topic,
          refined,
        },
        "Presenter Agent"
      );
      

      const presenterStep = {
        agent: "Presenter Agent",
        icon: "presenter",
        output: presenterRes.output,
        timestamp: new Date().toISOString(),
        duration: `${presenterRes.executionTime || 3}s`,
        status: "completed",
        provider: agentModels.presenter,
        promptStyle: promptStyle,
      };
      setWorkflow((prev) => [...prev, presenterStep]);

      setFinalOutput(presenterRes.output);
      setCurrentStage("complete");

      // Calculate execution time
      const endTime = Date.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(1));
    } catch (err) {
      console.error("Studio workflow error:", err);
      const errorStep = {
        agent: "Error",
        icon: "error",
        output: { error: err.message },
        timestamp: new Date().toISOString(),
        status: "error",
        provider: "error",
        promptStyle: promptStyle,
      };
      setWorkflow((prev) => [...prev, errorStep]);
      alert(`Error: ${err.message}`);
    } finally {
      setRunning(false);
      setCurrentStage("");
    }
  };

  const getStageColor = (agent) => {
    const colors = {
      "Idea Agent":
        "border-l-yellow-500 bg-yellow-50",
      "Critic Agent":
        "border-l-red-500 bg-red-50",
      "Refiner Agent":
        "border-l-blue-500 bg-blue-50",
      "Presenter Agent":
        "border-l-green-500 bg-green-50",
      Error:
        "border-l-gray-500 bg-gray-50",
    };
    return (
      colors[agent] ||
      "border-l-gray-500 bg-gray-50"
    );
  };

  const getAgentIconColor = (agent) => {
    const colors = {
      "Idea Agent": "text-yellow-600",
      "Critic Agent": "text-red-600",
      "Refiner Agent": "text-blue-600",
      "Presenter Agent": "text-green-600",
    };
    return colors[agent] || "text-gray-600";
  };

  const getProviderColor = (provider) => {
    const colors = {
      gemini: "from-blue-500 to-blue-600",
      claude: "from-orange-500 to-orange-600",
      deepseek: "from-blue-600 to-blue-700",
      xiaomi: "from-red-500 to-red-600",
      allenai: "from-green-500 to-green-600",
      nvidia: "from-emerald-500 to-emerald-600",
    };
    return colors[provider] || "from-gray-500 to-gray-600";
  };

  const getProviderName = (provider) => {
    const names = {
      gemini: "Google Gemini",
      claude: "Anthropic Claude",
      xiaomi: "Xiaomi Mimo",
      allenai: "AllenAI Olmo",
      nvidia: "NVIDIA Nemotron",
      deepseek: "DeepSeek Nex",
    };
    return names[provider] || provider;
  };

  const getPromptStyleColor = (style) => {
    const styleObj = PROMPT_STYLES.find(s => s.id === style);
    return styleObj ? styleObj.color : "from-blue-500 to-blue-600";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const renderOutput = (agent, output) => {
    if (!output) return null;

    if (output.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error:</p>
          <p className="text-red-600 text-sm">
            {output.error}
          </p>
        </div>
      );
    }

    switch (agent) {
      case "Idea Agent":
        return (
          <div className="space-y-4">
            {output.strategyOverview && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl mb-4">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <TargetIcon size={18} /> Strategy Overview
                </h4>
                <p className="text-blue-700">{output.strategyOverview}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {output.concepts?.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Concept {c.id || idx + 1}
                    </span>
                    <div className="flex gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${c.feasibility === 'High' ? 'bg-green-100 text-green-800' : c.feasibility === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {c.feasibility || 'Medium'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${c.novelty === 'High' ? 'bg-purple-100 text-purple-800' : c.novelty === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.novelty || 'Medium'}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {c.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {c.description}
                  </p>
                  
                  {c.innovation && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Innovation Points:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {c.innovation.map((item, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <div className="w-1 h-1 mt-1.5 rounded-full bg-blue-500"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {c.impact && (
                    <div className="mb-3 p-2 bg-green-50 rounded">
                      <p className="text-xs font-semibold text-green-700 mb-1">Potential Impact:</p>
                      <ul className="text-xs text-green-600">
                        {c.impact.map((item, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <div className="w-1 h-1 mt-1.5 rounded-full bg-green-500"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {c.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "Critic Agent":
        return (
          <div className="space-y-4">
            {output.comparativeAnalysis && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl mb-4">
                <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                  <BarChart3 size={18} /> Comparative Analysis
                </h4>
                <p className="text-red-700">{output.comparativeAnalysis}</p>
              </div>
            )}
            {output.critiques?.map((c, idx) => (
              <div
                key={c.id || idx}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Critique for Concept {c.id || idx + 1}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${c.riskLevel === 'High' ? 'bg-red-100 text-red-800' : c.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      Risk: {c.riskLevel || 'Medium'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${c.potentialROI === 'High' ? 'bg-green-100 text-green-800' : c.potentialROI === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      ROI: {c.potentialROI || 'Medium'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                      <CheckCircle size={12} /> Strengths
                    </p>
                    <ul className="text-xs text-green-600 space-y-1">
                      {Array.isArray(c.strengths) ? c.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <div className="w-1 h-1 mt-1.5 rounded-full bg-green-500"></div>
                          {s}
                        </li>
                      )) : <p className="text-sm text-green-600">{c.strengths}</p>}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Weaknesses
                    </p>
                    <ul className="text-xs text-red-600 space-y-1">
                      {Array.isArray(c.weaknesses) ? c.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <div className="w-1 h-1 mt-1.5 rounded-full bg-red-500"></div>
                          {w}
                        </li>
                      )) : <p className="text-sm text-red-600">{c.weaknesses}</p>}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                      <Zap size={12} /> Suggestions
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      {Array.isArray(c.suggestions) ? c.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <div className="w-1 h-1 mt-1.5 rounded-full bg-blue-500"></div>
                          {s}
                        </li>
                      )) : <p className="text-sm text-blue-600">{c.suggestions}</p>}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                      <TrendingUpIcon size={12} /> Market Viability
                    </p>
                    <p className="text-xs text-purple-600">{c.marketViability || 'To be assessed'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "Refiner Agent":
        return (
          <div className="space-y-4">
            {output.refinementSummary && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl mb-4">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <RefreshCw size={18} /> Refinement Summary
                </h4>
                <p className="text-blue-700">{output.refinementSummary}</p>
              </div>
            )}
            {output.refined?.map((r, idx) => (
              <div
                key={r.id || idx}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-500" />
                    <span className="font-bold text-gray-900">
                      {r.title}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    Enhanced Concept
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      {r.description}
                    </p>
                    {r.valueProposition && (
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-xs font-semibold text-green-700 mb-1">Value Proposition:</p>
                        <p className="text-xs text-green-600">{r.valueProposition}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {r.improvements && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Key Improvements:</p>
                        <ul className="text-xs text-blue-600 space-y-1">
                          {Array.isArray(r.improvements) ? r.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <div className="w-1 h-1 mt-1.5 rounded-full bg-blue-500"></div>
                              {imp}
                            </li>
                          )) : <p className="text-sm text-blue-600">{r.improvements}</p>}
                        </ul>
                      </div>
                    )}
                    
                    {r.riskMitigations && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-xs font-semibold text-yellow-700 mb-1">Risk Mitigations:</p>
                        <ul className="text-xs text-yellow-600 space-y-1">
                          {r.riskMitigations.map((mit, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <div className="w-1 h-1 mt-1.5 rounded-full bg-yellow-500"></div>
                              {mit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "Presenter Agent":
        return (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Presentation className="text-green-600" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Executive Summary
                  </h3>
                  <p className="text-sm text-gray-600">Strategic overview and key insights</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {output.summary}
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommendation */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target size={18} className="text-blue-500" /> Final Recommendation
                </h4>
                <p className="text-gray-600 mb-4">
                  {output.recommendation}
                </p>
                
                {output.successMetrics && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <LineChart size={14} /> Success Metrics
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-medium text-blue-600 mb-1">Short Term:</p>
                        <ul className="text-xs text-blue-600 space-y-1">
                          {output.successMetrics.shortTerm?.slice(0, 2).map((metric, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-600 mb-1">Long Term:</p>
                        <ul className="text-xs text-blue-600 space-y-1">
                          {output.successMetrics.longTerm?.slice(0, 2).map((metric, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Concept */}
              {output.topConcept && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Star size={18} className="text-yellow-500" /> Top Concept
                    </h4>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      Recommended Implementation
                    </span>
                  </div>
                  
                  <h5 className="font-bold text-lg text-gray-900 mb-2">
                    {output.topConcept.title}
                  </h5>
                  <p className="text-sm text-gray-600 mb-3">
                    {output.topConcept.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white/50 rounded-lg">
                      <h6 className="text-sm font-semibold text-purple-700 mb-1 flex items-center gap-2">
                        <Brain size={14} /> Selection Rationale
                      </h6>
                      <p className="text-sm text-purple-600">
                        {output.topConcept.rationale}
                      </p>
                    </div>
                    
                    {output.topConcept.implementationTimeline && (
                      <div className="p-3 bg-white/50 rounded-lg">
                        <h6 className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-2">
                          <Calendar size={14} /> Implementation Timeline
                        </h6>
                        <p className="text-sm text-green-600">
                          {output.topConcept.implementationTimeline}
                        </p>
                      </div>
                    )}
                    
                    {output.topConcept.competitiveAdvantage && (
                      <div className="p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded">
                        <h6 className="text-xs font-semibold text-blue-700 mb-1">Competitive Advantages:</h6>
                        <div className="flex flex-wrap gap-1">
                          {output.topConcept.competitiveAdvantage.map((adv, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                              {adv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps */}
            {output.nextSteps && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckSquare size={18} className="text-green-500" /> Next Steps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {output.nextSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">Step {idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg p-4">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            autonomous-studio
          </h1>
          <p className="text-gray-600 mt-2">
            Multi-agent creative workflow with professional presentation generation
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
            navigate("/preview", {
              state: {
                finalOutput,
                topic,
                workflow,
                aiMode,
                singleAiModel,
                agentModels,
              },
            })
          }
            disabled={!finalOutput}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            <Eye size={20} />
            Preview
          </button>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                AI-Powered Creative Session
              </h2>
              <p className="text-gray-600">
                Configure AI models and creative style for your innovation workflow
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Prompt Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                🎨 Creative Style & Tone
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {PROMPT_STYLES.map((style) => {
                  const StyleIcon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setPromptStyle(style.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        promptStyle === style.id
                          ? "border-blue-500 bg-white shadow-lg"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`p-3 rounded-lg mb-3 bg-gradient-to-r ${style.color}`}
                        >
                          <StyleIcon className="text-white" size={20} />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          {style.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {style.tone}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {style.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Palette size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Selected Style: {PROMPT_STYLES.find(s => s.id === promptStyle)?.name}
                  </span>
                </div>
                <p className="text-sm text-blue-600">
                  {PROMPT_STYLES.find(s => s.id === promptStyle)?.description}
                </p>
              </div>
            </div>

            {/* AI Configuration Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                ⚙️ AI Configuration Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setAiMode("single")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    aiMode === "single"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        aiMode === "single"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Server size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">
                        Single AI Model
                      </h4>
                      <p className="text-sm text-gray-500">
                        Consistent style across all agents
                      </p>
                    </div>
                    {aiMode === "single" && (
                      <CheckCircle
                        className="text-blue-500 ml-auto"
                        size={20}
                      />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setAiMode("multi")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    aiMode === "multi"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        aiMode === "multi"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Network size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">
                        Multi-AI Ensemble
                      </h4>
                      <p className="text-sm text-gray-500">
                        Different AI for specialized tasks
                      </p>
                    </div>
                    {aiMode === "multi" && (
                      <CheckCircle
                        className="text-purple-500 ml-auto"
                        size={20}
                      />
                    )}
                  </div>
                </button>
              </div>

              {/* Single AI Selection */}
              {aiMode === "single" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select AI Model for all agents:
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSingleAiModel(model.id)}
                        className={`p-3 rounded-lg border transition-all ${
                          singleAiModel === model.id
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-lg mb-2">{model.icon}</div>
                          <span
                            className={`text-sm font-medium ${
                              singleAiModel === model.id
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {model.name.split(" ")[0]}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {model.id === "gemini" || model.id === "claude"
                              ? "Premium"
                              : "Free"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CpuIcon
                        size={16}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-medium text-blue-700">
                        Current Configuration:
                      </span>
                    </div>
                    <p className="text-sm text-blue-600">
                      All 4 agents using <span className="font-semibold">{getProviderName(singleAiModel)}</span> with <span className="font-semibold">{PROMPT_STYLES.find(s => s.id === promptStyle)?.name}</span> style
                    </p>
                  </div>
                </div>
              )}

              {/* Multi AI Selection */}
              {aiMode === "multi" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    🔧 Configure AI Models for Each Agent
                  </label>
                  <div className="space-y-4">
                    {agents.map((agent) => {
                      const agentKey = agent.name
                        .toLowerCase()
                        .replace(" agent", "");
                      return (
                        <div
                          key={agentKey}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getAgentIconColor(agent.name)} bg-opacity-10`}>
                              <agent.icon
                                size={18}
                                className={getAgentIconColor(agent.name)}
                              />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{agent.name}</span>
                              <p className="text-xs text-gray-500">
                                {agent.role}
                              </p>
                            </div>
                          </div>
                          <select
                            value={agentModels[agentKey]}
                            onChange={(e) =>
                              setAgentModels((prev) => ({
                                ...prev,
                                [agentKey]: e.target.value,
                              }))
                            }
                            className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm min-w-[140px]"
                          >
                            {AVAILABLE_MODELS.map((model) => (
                              <option key={model.id} value={model.id}>
                                {model.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700">
                      💡 <span className="font-medium">Pro Tip:</span> Use different models to leverage their unique strengths
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Creative Topic or Challenge
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe your innovation challenge, business problem, or creative opportunity..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Examples: "Sustainable packaging for e-commerce", "AI-powered fitness app", "Smart home security innovation"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={runStudio}
                disabled={running || !topic.trim()}
                className={`px-6 py-4 bg-gradient-to-r ${getPromptStyleColor(promptStyle)} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
              >
                {running ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Running Creative Workflow...
                  </>
                ) : (
                  <>
                    <Rocket size={24} />
                    Launch Creative Session
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (!topic.trim()) {
                    alert("Please enter a topic first");
                    return;
                  }
                  // Run a quick demo with sample output
                  setRunning(true);
                  setTimeout(() => {
                    setRunning(false);
                    alert("Quick demo mode - Enter a topic and click 'Launch Creative Session' for full AI-powered workflow");
                  }, 1000);
                }}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
              >
                <ZapIcon size={24} />
                Quick Demo
              </button>
            </div>

            {/* Progress Indicator */}
            {running && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-gray-700">
                      Current stage:{" "}
                      <span className="capitalize font-semibold text-blue-600">
                        {currentStage}
                      </span>
                    </p>
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                      {workflow.length} of 4 agents completed
                    </span>
                  </div>
                  <span className="px-3 py-1 text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full">
                    {aiMode === "single"
                      ? getProviderName(singleAiModel)
                      : getProviderName(agentModels[currentStage] || "gemini")}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getPromptStyleColor(promptStyle)} transition-all duration-500`}
                    style={{ width: `${(workflow.length / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Status Grid */}
      {(running || workflow.length > 0) && (
        <div className="grid lg:grid-cols-4 gap-4">
          {agents.map((agent, idx) => {
            const step = workflow.find((s) => s.agent === agent.name);
            const isCurrent =
              currentStage === agent.name.toLowerCase().replace(" agent", "");
            const Icon = agent.icon;
            const agentKey = agent.name.toLowerCase().replace(" agent", "");
            const agentModel = agentModels[agentKey];

            return (
              <div
                key={idx}
                className={`bg-white border rounded-xl p-4 transition-all ${
                  step
                    ? "border-green-200 bg-green-50"
                    : isCurrent
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${getAgentIconColor(
                      agent.name
                    )} bg-opacity-10`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {agent.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {agent.role}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${getProviderColor(agentModel).replace('from-', 'bg-gradient-to-r from-').replace('to-', 'to-')} text-white`}
                      >
                        {getProviderName(agentModel)}
                      </span>
                      {step?.promptStyle && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">
                          {step.promptStyle}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {step ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : isCurrent ? (
                      <Loader2
                        className="animate-spin text-blue-500"
                        size={20}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    )}
                  </div>
                </div>

                {step && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(step.output, null, 2))}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Copy size={12} /> Copy
                    </button>
                    <button
                      onClick={() =>
                        setShowDetails((prev) => ({
                          ...prev,
                          [agent.name]: !prev[agent.name],
                        }))
                      }
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <MessageSquare size={12} /> Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Workflow Progress */}
      {workflow.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Creative Workflow Progress
            </h2>
            <div className="flex items-center gap-4">
              {executionTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>Total time: {executionTime}s</span>
                </div>
              )}
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getPromptStyleColor(promptStyle)} text-white`}
              >
                {PROMPT_STYLES.find(s => s.id === promptStyle)?.name} Style
              </div>
            </div>
          </div>

          {workflow.map((step, idx) => {
            const Icon = iconMap[step.icon] || Lightbulb;

            return (
              <div
                key={idx}
                className={`border-l-4 ${getStageColor(
                  step.agent
                )} rounded-r-xl shadow-lg`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getAgentIconColor(
                          step.agent
                        )} bg-opacity-10`}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {step.agent}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>
                            {new Date(step.timestamp).toLocaleTimeString()}
                          </span>
                          {step.duration && <span>• {step.duration}</span>}
                          <span
                            className={`px-2 py-0.5 text-xs rounded bg-gradient-to-r ${getProviderColor(step.provider)} text-white`}
                          >
                            {getProviderName(step.provider)}
                          </span>
                          {step.promptStyle && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                              {step.promptStyle}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {step.status === "completed" && (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                    {step.status === "error" && (
                      <XCircle className="text-red-500" size={20} />
                    )}
                  </div>

                  <div className="mt-4">
                    {renderOutput(step.agent, step.output)}
                  </div>

                  {showDetails[step.agent] && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Raw JSON Output</h4>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(step.output, null, 2))}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          Copy JSON
                        </button>
                      </div>
                      <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-60">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Final Presentation */}
      {finalOutput && (
        <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-200 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <Presentation className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Executive Presentation
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">
                    Complete creative solution for "{topic}"
                  </p>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded bg-gradient-to-r ${getPromptStyleColor(promptStyle)} text-white`}
                    >
                      {PROMPT_STYLES.find(s => s.id === promptStyle)?.name} Style
                    </span>
                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded">
                      {aiMode === "single"
                        ? getProviderName(singleAiModel)
                        : "Multi-AI Ensemble"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(JSON.stringify(finalOutput, null, 2))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Copy presentation"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={exportSession}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Export session"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          {renderOutput("Presenter Agent", finalOutput)}
        </div>
      )}

      {/* Empty State - How It Works */}
      {!running && workflow.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
            How the autonomous-studio Works
          </h3>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              {agents.map((agent, idx) => (
                <React.Fragment key={agent.name}>
                  <div className="text-center w-full md:w-auto mb-8 md:mb-0">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${getProviderColor(
                        aiMode === "single"
                          ? singleAiModel
                          : agentModels[
                              agent.name.toLowerCase().replace(" agent", "")
                            ]
                      )} mb-4`}
                    >
                      <agent.icon className="text-white" size={32} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {agent.name}
                    </h4>
                    <p className="text-sm text-gray-600 max-w-[200px] mx-auto">
                      {agent.role}
                    </p>
                  </div>
                  {idx < agents.length - 1 && (
                    <div className="hidden md:block relative">
                      <div className="h-1 w-16 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                      <ChevronRight className="text-gray-400 absolute -right-2 top-1/2 transform -translate-y-1/2" size={24} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers className="text-blue-600" size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900">Iterative Refinement</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Each agent builds upon previous work, creating a refinement loop that enhances quality at every stage.
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Cpu className="text-purple-600" size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900">AI Specialization</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Different AI models excel at different tasks - choose the perfect combination for your creative challenge.
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="text-green-600" size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900">Professional Output</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Get executive-ready presentations with strategic insights, actionable recommendations, and clear next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
        <div>
          <h3 className="font-bold text-gray-900">Ready to Transform Your Ideas?</h3>
          <p className="text-sm text-gray-600">Start your AI-powered creative journey today</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            Back to Top
          </button>
          <button
            onClick={runStudio}
            disabled={!topic.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Studio;