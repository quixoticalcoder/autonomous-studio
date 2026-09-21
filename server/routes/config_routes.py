"""Routes for configuration endpoints"""

from flask import Blueprint, jsonify
from config.constansts import PROMPT_TEMPLATES, AGENT_MODEL_MAP, MODEL_RECOMMENDATIONS

config_bp = Blueprint('config', __name__)

@config_bp.route('/styles', methods=['GET'])
def get_prompt_styles():
    """Get available prompt styles"""
    return jsonify({
        "styles": PROMPT_TEMPLATES,
        "default": "standard"
    })

@config_bp.route('/models', methods=['GET'])
def get_available_models():
    """Get available AI models"""
    return jsonify({
        "models": AGENT_MODEL_MAP,
        "recommendations": MODEL_RECOMMENDATIONS
    })