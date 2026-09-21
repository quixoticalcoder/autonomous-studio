"""Routes for history management endpoints"""

from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from controllers.history_controller import (
    get_user_history,
    get_history_by_id,
    delete_history_entry,
    clear_user_history
)

history_bp = Blueprint('history', __name__)

# Test endpoint to verify route is working
@history_bp.route('/test', methods=['GET'])
def test_route():
    """Test endpoint to verify history routes are working"""
    return jsonify({"message": "History routes are working!"}), 200

# Main history list - handle both with and without trailing slash
@history_bp.route('', methods=['GET'])
@history_bp.route('/', methods=['GET'])
@token_required
def list_history():
    """Get user's history with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    response, status = get_user_history(request.user_id, page, per_page)
    return jsonify(response), status

@history_bp.route('/<history_id>', methods=['GET'])
@token_required
def get_history(history_id):
    """Get a specific history entry"""
    response, status = get_history_by_id(history_id, request.user_id)
    return jsonify(response), status

@history_bp.route('/<history_id>', methods=['DELETE'])
@token_required
def delete_history(history_id):
    """Delete a specific history entry"""
    response, status = delete_history_entry(history_id, request.user_id)
    return jsonify(response), status

@history_bp.route('/clear', methods=['DELETE'])
@token_required
def clear_history():
    """Clear all history for the current user"""
    response, status = clear_user_history(request.user_id)
    return jsonify(response), status