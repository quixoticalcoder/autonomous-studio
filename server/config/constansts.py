"""Application constants and configuration"""

# Model mapping for different AI providers
AGENT_MODEL_MAP = {
    "gemini": "google/gemini-2.0-flash-exp:free",
    "xiaomi": "xiaomi/mimo-v2-flash:free",
    "allenai": "allenai/olmo-3.1-32b-think:free",
    "nvidia": "nvidia/nemotron-3-nano-30b-a3b:free",
    "deepseek": "nex-agi/deepseek-v3.1-nex-n1:free"
}

# Prompt templates for different creative styles
PROMPT_TEMPLATES = {
    "standard": {
        "tone": "professional and balanced",
        "style": "clear and structured"
    },
    "creative": {
        "tone": "innovative and imaginative",
        "style": "bold and unconventional"
    },
    "professional": {
        "tone": "executive and strategic",
        "style": "concise and business-focused"
    },
    "academic": {
        "tone": "analytical and evidence-based",
        "style": "detailed and rigorous"
    },
    "visionary": {
        "tone": "inspirational and forward-thinking",
        "style": "aspirational and transformative"
    }
}

# Model recommendations for different agents
MODEL_RECOMMENDATIONS = {
    "idea": "gemini",
    "critic": "allenai",
    "refiner": "deepseek",
    "presenter": "nvidia"
}

# API Configuration
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_TIMEOUT = 90
MAX_TOKENS = 2048