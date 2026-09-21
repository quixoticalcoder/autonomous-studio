"""Routes for AI agent endpoints - Protected with authentication"""

from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from controllers.agent_controller import process_agent_request

agent_bp = Blueprint('agents', __name__)

@agent_bp.route('/idea', methods=['POST'])
@token_required
def idea_agent():
    """Handle Idea Agent requests - Protected"""
    response, status = process_agent_request('idea', request.json, request.user_id)
    return jsonify(response), status

@agent_bp.route('/critic', methods=['POST'])
@token_required
def critic_agent():
    """Handle Critic Agent requests - Protected"""
    response, status = process_agent_request('critic', request.json, request.user_id)
    return jsonify(response), status

@agent_bp.route('/refiner', methods=['POST'])
@token_required
def refiner_agent():
    """Handle Refiner Agent requests - Protected"""
    response, status = process_agent_request('refiner', request.json, request.user_id)
    return jsonify(response), status

@agent_bp.route('/presenter', methods=['POST'])
@token_required
def presenter_agent():
    """Handle Presenter Agent requests - Protected"""
    # This will save to history automatically
    response, status = process_agent_request('presenter', request.json, request.user_id)
    return jsonify(response), status