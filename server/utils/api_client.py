"""OpenRouter API client utilities"""

import os
import requests
from config.constansts import AGENT_MODEL_MAP, OPENROUTER_API_URL, API_TIMEOUT, MAX_TOKENS

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def get_model_for_agent(agent_model):
    """Map agent model names to OpenRouter model strings"""
    return AGENT_MODEL_MAP.get(agent_model, "xiaomi/mimo-v2-flash:free")

def call_openrouter(prompt, agent_model="xiaomi", temperature=0.7):
    """Call OpenRouter API with specific model"""
    model = get_model_for_agent(agent_model)
    
    try:
        response = requests.post(
            OPENROUTER_API_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "autonomous-studio",
            },
            json={
                "model": model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an AI assistant specialized in creative problem-solving. Respond ONLY with valid JSON. Ensure responses are professional, insightful, and actionable."
                    },
                    {"role": "user", "content": prompt}
                ],
                "temperature": temperature,
                "max_tokens": MAX_TOKENS,
                "top_p": 0.9,
                "frequency_penalty": 0.2,
                "presence_penalty": 0.1
            },
            timeout=API_TIMEOUT
        )

        if response.status_code != 200:
            return {
                "error": f"OpenRouter API error {response.status_code}: {response.text}",
                "status": response.status_code
            }

        return response.json()["choices"][0]["message"]["content"]
    
    except requests.exceptions.Timeout:
        return {"error": "Request timeout - API is taking too long to respond"}
    except Exception as e:
        return {"error": f"API call failed: {str(e)}"}