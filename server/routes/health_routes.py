"""Routes for health check endpoints"""

from flask import Blueprint, jsonify
from config.constansts import AGENT_MODEL_MAP, PROMPT_TEMPLATES

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "autonomous-studio API",
        "version": "2.0.0",
        "availableModels": list(AGENT_MODEL_MAP.keys()),
        "availableStyles": list(PROMPT_TEMPLATES.keys())
    })