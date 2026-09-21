import React from "react";
import {
  Lightbulb,
  AlertCircle,
  RefreshCw,
  Presentation,
  Brain,
  Zap,
  Target,
  Users,
  Workflow,
  BarChart3,
  Shield,
  Rocket,
  Star,
  Clock,
  Cpu,
  Layers,
  GitBranch,
  Bot,
  Server,
  Network,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Globe,
  Palette,
  Sparkles,
  Search,
  Filter,
  Code,
  BookOpen,
  Download,
  Copy,
  ExternalLink,
  Upload,
} from "lucide-react";

const Agents = ({ onBack }) => {
  const agents = [
    {
      name: "Idea Agent",
      icon: Lightbulb,
      role: "Innovation Strategist",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
      description:
        "Generates groundbreaking creative concepts and strategic ideas",
      capabilities: [
        "Concept generation and ideation",
        "Innovation strategy development",
        "Market opportunity identification",
        "Creative problem-solving",
        "Trend analysis and forecasting",
      ],
      bestFor: [
        "Brainstorming sessions",
        "Innovation workshops",
        "Product discovery",
        "Strategic planning",
        "Creative campaigns",
      ],
      promptStyle: {
        creative: "Generates bold, unconventional ideas with high novelty",
        standard: "Balanced approach with practical innovation",
        professional: "Business-aligned concepts with clear ROI",
        academic: "Research-backed, evidence-based concepts",
        visionary: "Future-focused transformative ideas",
      },
      modelRecommendations: [
        {
          model: "gemini",
          reason: "Excellent for creative and diverse ideation",
        },
        {
          model: "xiaomi",
          reason: "Fast iteration and cost-effective brainstorming",
        },
        {
          model: "deepseek",
          reason: "Deep analytical thinking for complex problems",
        },
      ],
      outputFormat: {
        type: "Structured JSON",
        fields: [
          "Concepts array with titles & descriptions",
          "Innovation points and impact analysis",
          "Feasibility and novelty ratings",
          "Strategic overview",
          "Tags and categorization",
        ],
      },
    },
    {
      name: "Critic Agent",
      icon: AlertCircle,
      role: "Risk & Opportunity Analyst",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
      borderColor: "border-red-200",
      description:
        "Conducts rigorous evaluation and identifies risks/opportunities",
      capabilities: [
        "Risk assessment and analysis",
        "Strengths/weaknesses evaluation",
        "Market viability testing",
        "Competitive analysis",
        "ROI and feasibility assessment",
      ],
      bestFor: [
        "Due diligence",
        "Investment analysis",
        "Risk management",
        "Quality assurance",
        "Strategic review",
      ],
      promptStyle: {
        creative: "Identifies unconventional risks and opportunities",
        standard: "Balanced critical analysis",
        professional: "Business risk assessment with financial focus",
        academic: "Evidence-based critical evaluation",
        visionary: "Future-risk analysis and opportunity spotting",
      },
      modelRecommendations: [
        {
          model: "allenai",
          reason: "Excellent analytical and critical thinking",
        },
        { model: "nvidia", reason: "Strong in technical risk assessment" },
        { model: "claude", reason: "Thoughtful and detailed analysis" },
      ],
      outputFormat: {
        type: "Analytical JSON",
        fields: [
          "Critiques with strengths/weaknesses",
          "Risk levels and potential ROI",
          "Market viability analysis",
          "Implementation challenges",
          "Comparative analysis",
        ],
      },
    },
    {
      name: "Refiner Agent",
      icon: RefreshCw,
      role: "Innovation Refinement Specialist",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      description: "Enhances and synthesizes concepts based on feedback",
      capabilities: [
        "Iterative concept improvement",
        "Risk mitigation strategy development",
        "Value proposition enhancement",
        "Implementation planning",
        "Cross-concept synthesis",
      ],
      bestFor: [
        "Concept refinement",
        "Prototype development",
        "Solution optimization",
        "Risk mitigation planning",
        "MVP definition",
      ],
      promptStyle: {
        creative: "Radical improvements and innovative solutions",
        standard: "Balanced refinement addressing key issues",
        professional: "Business-focused optimizations",
        academic: "Systematic, evidence-based improvements",
        visionary: "Transformative enhancements for future readiness",
      },
      modelRecommendations: [
        {
          model: "deepseek",
          reason: "Excellent at synthesis and iterative improvement",
        },
        { model: "gemini", reason: "Creative problem-solving and enhancement" },
        { model: "nvidia", reason: "Technical optimization and refinement" },
      ],
      outputFormat: {
        type: "Enhanced JSON",
        fields: [
          "Refined concepts with improvements",
          "Risk mitigation strategies",
          "Enhanced features and value propositions",
          "Implementation steps",
          "Refinement summary",
        ],
      },
    },
    {
      name: "Presenter Agent",
      icon: Presentation,
      role: "Executive Presentation Strategist",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      description:
        "Creates compelling executive presentations and recommendations",
      capabilities: [
        "Executive summary creation",
        "Business case development",
        "Stakeholder communication",
        "Presentation structuring",
        "Recommendation formulation",
      ],
      bestFor: [
        "Executive presentations",
        "Investor pitches",
        "Board meetings",
        "Project proposals",
        "Strategy communications",
      ],
      promptStyle: {
        creative: "Engaging and memorable presentations",
        standard: "Clear, professional executive summaries",
        professional: "Business-focused strategic recommendations",
        academic: "Detailed, evidence-based presentations",
        visionary: "Inspirational and forward-looking communications",
      },
      modelRecommendations: [
        {
          model: "nvidia",
          reason: "Excellent for structured professional presentations",
        },
        {
          model: "claude",
          reason: "Thoughtful and comprehensive communication",
        },
        { model: "gemini", reason: "Engaging and persuasive storytelling" },
      ],
      outputFormat: {
        type: "Presentation JSON",
        fields: [
          "Executive summary",
          "Recommendation with rationale",
          "Top concept selection",
          "Success metrics (KPIs)",
          "Next steps and timeline",
        ],
      },
    },
  ];

  const workflowStages = [
    {
      stage: "1. Ideation",
      agent: "Idea Agent",
      description: "Generate 3 innovative concepts",
      duration: "2-3 seconds",
      input: "Topic/Challenge",
      output: "Structured concepts",
    },
    {
      stage: "2. Analysis",
      agent: "Critic Agent",
      description: "Evaluate risks and opportunities",
      duration: "3-4 seconds",
      input: "Concepts from Idea Agent",
      output: "Critical analysis",
    },
    {
      stage: "3. Refinement",
      agent: "Refiner Agent",
      description: "Enhance concepts based on feedback",
      duration: "4-5 seconds",
      input: "Concepts + Critiques",
      output: "Improved concepts",
    },
    {
      stage: "4. Presentation",
      agent: "Presenter Agent",
      description: "Create executive presentation",
      duration: "3-4 seconds",
      input: "Refined concepts",
      output: "Complete presentation",
    },
  ];

  const modelStrengths = [
    {
      model: "Google Gemini",
      icon: "🔷",
      strengths: ["Creative thinking", "Fast iteration", "Diverse ideation"],
      bestFor: "Idea generation & creative tasks",
      cost: "Premium",
    },
    {
      model: "Xiaomi Mimo",
      icon: "🔴",
      strengths: ["Cost-effective", "Fast response", "Good for brainstorming"],
      bestFor: "Quick iterations & budget work",
      cost: "Free",
    },
    {
      model: "AllenAI Olmo",
      icon: "🟢",
      strengths: [
        "Analytical thinking",
        "Critical analysis",
        "Research-oriented",
      ],
      bestFor: "Critique & analysis tasks",
      cost: "Free",
    },
    {
      model: "NVIDIA Nemotron",
      icon: "💚",
      strengths: ["Structured output", "Technical depth", "Professional tone"],
      bestFor: "Presentation & refinement",
      cost: "Free",
    },
    {
      model: "DeepSeek Nex",
      icon: "🔶",
      strengths: [
        "Deep synthesis",
        "Iterative improvement",
        "Complex problem-solving",
      ],
      bestFor: "Refinement & synthesis",
      cost: "Free",
    },
  ];

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Agents Documentation
          </h1>
          <p className="text-gray-600 mt-2">
            Complete guide to our specialized AI agents and their capabilities
          </p>
        </div>
        <div className="flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              ← Back to Studio
            </button>
          )}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <BookOpen size={20} />
            Quick Guide
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Multi-Agent Creative Workflow
            </h2>
            <p className="text-gray-600">
              Four specialized AI agents working in sequence to transform ideas
              into executive-ready presentations
            </p>
          </div>
        </div>

        {/* Workflow Visualization */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Workflow size={20} className="text-blue-500" />
            Workflow Stages
          </h3>
          <div className="relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {workflowStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        idx === 0
                          ? "bg-yellow-100 text-yellow-600"
                          : idx === 1
                          ? "bg-red-100 text-red-600"
                          : idx === 2
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {idx === 0 && <Lightbulb size={20} />}
                      {idx === 1 && <AlertCircle size={20} />}
                      {idx === 2 && <RefreshCw size={20} />}
                      {idx === 3 && <Presentation size={20} />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500">
                        {stage.stage}
                      </span>
                      <h4 className="font-bold text-gray-900">{stage.agent}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {stage.description}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-gray-500">{stage.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download size={12} className="text-gray-400" />
                      <span className="text-gray-500">
                        Input: {stage.input}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Upload size={12} className="text-gray-400" />
                      <span className="text-gray-500">
                        Output: {stage.output}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="text-blue-600" size={20} />
              </div>
              <h4 className="font-semibold text-gray-900">
                Iterative Refinement
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              Each agent builds upon previous work, creating a continuous
              improvement loop that enhances quality at every stage.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cpu className="text-purple-600" size={20} />
              </div>
              <h4 className="font-semibold text-gray-900">AI Specialization</h4>
            </div>
            <p className="text-sm text-gray-600">
              Different AI models excel at different tasks - choose the perfect
              combination for each stage of your creative workflow.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="text-green-600" size={20} />
              </div>
              <h4 className="font-semibold text-gray-900">Time Efficiency</h4>
            </div>
            <p className="text-sm text-gray-600">
              Complete complex creative workflows in seconds instead of days,
              with AI handling the heavy lifting.
            </p>
          </div>
        </div>
      </div>

      {/* AI Models Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Server size={24} className="text-blue-500" />
          Available AI Models
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {modelStrengths.map((model, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{model.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900">{model.model}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      model.cost === "Premium"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {model.cost}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Strengths:
                </p>
                <ul className="space-y-1">
                  {model.strengths.map((strength, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-600 flex items-start gap-1"
                    >
                      <div className="w-1 h-1 mt-1.5 rounded-full bg-blue-500"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs font-medium text-gray-700">Best For:</p>
                <p className="text-xs text-gray-600">{model.bestFor}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">
                Pro Configuration Tips
              </h4>
              <p className="text-sm text-blue-700">
                Mix and match models based on their strengths. Use creative
                models for ideation, analytical models for critique, and
                structured models for presentations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Agent Cards */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Agent Details & Specifications
      </h2>

      <div className="space-y-8">
        {agents.map((agent, idx) => {
          const AgentIcon = agent.icon;

          return (
            <div
              key={idx}
              className={`rounded-2xl border-2 ${agent.borderColor} overflow-hidden`}
            >
              {/* Agent Header */}
              <div className={`p-6 ${agent.bgColor}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${agent.color}`}
                    >
                      <AgentIcon className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-3 py-1 text-sm bg-white/80 rounded-full font-medium">
                          {agent.role}
                        </span>
                        <span className="text-sm text-gray-600">
                          Stage {idx + 1} of 4
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const jsonStr = JSON.stringify(
                          {
                            agent: agent.name,
                            role: agent.role,
                            capabilities: agent.capabilities,
                            outputFormat: agent.outputFormat,
                          },
                          null,
                          2
                        );
                        navigator.clipboard.writeText(jsonStr);
                        alert(`${agent.name} details copied to clipboard!`);
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Copy size={16} />
                      Copy Specs
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-gray-700">{agent.description}</p>
              </div>

              {/* Agent Details */}
              <div className="p-6 bg-white">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap size={18} className="text-blue-500" />
                        Key Capabilities
                      </h4>
                      <ul className="space-y-2">
                        {agent.capabilities.map((capability, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle
                              size={16}
                              className="text-green-500 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-gray-600">{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target size={18} className="text-red-500" />
                        Best Used For
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.bestFor.map((use, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Palette size={18} className="text-purple-500" />
                        Prompt Style Behavior
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(agent.promptStyle).map(
                          ([style, behavior]) => (
                            <div key={style} className="flex items-start gap-2">
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded capitalize min-w-[80px] text-center">
                                {style}
                              </span>
                              <span className="text-sm text-gray-600 flex-1">
                                {behavior}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Bot size={18} className="text-green-500" />
                        Recommended Models
                      </h4>
                      <div className="space-y-3">
                        {agent.modelRecommendations.map((rec, i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">
                                {rec.model.charAt(0).toUpperCase() +
                                  rec.model.slice(1)}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                {rec.model === "gemini" ||
                                rec.model === "claude"
                                  ? "Premium"
                                  : "Free"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {rec.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Output Format */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Code size={18} className="text-indigo-500" />
                    Output Format
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                        {agent.outputFormat.type}
                      </div>
                      <span className="text-sm text-gray-600">
                        Structured JSON response
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {agent.outputFormat.fields.map((field, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span className="text-sm font-medium text-gray-700">
                              Field {i + 1}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{field}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          🚀 Quick Start Guide
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900">Choose Your Topic</h4>
            </div>
            <p className="text-sm text-gray-600">
              Start with a clear creative challenge, business problem, or
              innovation opportunity. The more specific, the better the results.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900">
                Configure AI Models
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              Select single AI for consistency or multi-AI ensemble for
              specialized performance. Choose creative style that matches your
              needs.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900">Launch & Review</h4>
            </div>
            <p className="text-sm text-gray-600">
              Run the workflow and review each agent's output. Export the final
              presentation or copy specific sections for further use.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
        <div>
          <h3 className="font-bold text-gray-900">Ready to Start Creating?</h3>
          <p className="text-sm text-gray-600">
            Return to the studio to begin your AI-powered creative session
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            Back to Top
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              ← Return to Studio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agents;
