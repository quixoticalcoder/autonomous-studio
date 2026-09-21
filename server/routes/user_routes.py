"""Routes for user management endpoints"""

from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required, admin_required
from controllers.user_controller import (
    register_user,
    login_user,
    refresh_user_token,
    get_user_profile,
    get_current_user,
    update_user_profile,
    change_password,
    update_user_preferences,
    deactivate_user_account,
    activate_user_account,
    delete_user_account,
    get_all_users
)

user_bp = Blueprint('users', __name__)

# Public routes (no authentication required)
@user_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    response, status = register_user(request.json)
    return jsonify(response), status

@user_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    response, status = login_user(request.json)
    return jsonify(response), status

# Protected routes (authentication required)
@user_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    """Get current authenticated user profile"""
    response, status = get_current_user(request.user_id)
    return jsonify(response), status

@user_bp.route('/refresh', methods=['POST'])
@token_required
def refresh_token():
    """Refresh JWT token"""
    response, status = refresh_user_token(request.user_id)
    return jsonify(response), status

@user_bp.route('/<user_id>', methods=['GET'])
@token_required
def get_profile(user_id):
    """Get user profile (own profile or admin only)"""
    # Users can only view their own profile unless they're admin
    if request.user_id != user_id and request.current_user.role != 'admin':
        return jsonify({"error": "Unauthorized to view this profile"}), 403
    
    response, status = get_user_profile(user_id)
    return jsonify(response), status

@user_bp.route('/<user_id>', methods=['PUT'])
@token_required
def update_profile(user_id):
    """Update user profile (own profile only)"""
    # Users can only update their own profile
    if request.user_id != user_id:
        return jsonify({"error": "Unauthorized to update this profile"}), 403
    
    response, status = update_user_profile(user_id, request.json)
    return jsonify(response), status

@user_bp.route('/<user_id>/password', methods=['PUT'])
@token_required
def update_password(user_id):
    """Change user password (own password only)"""
    # Users can only change their own password
    if request.user_id != user_id:
        return jsonify({"error": "Unauthorized to change this password"}), 403
    
    response, status = change_password(user_id, request.json)
    return jsonify(response), status

@user_bp.route('/<user_id>/preferences', methods=['PUT'])
@token_required
def update_preferences(user_id):
    """Update user preferences (own preferences only)"""
    # Users can only update their own preferences
    if request.user_id != user_id:
        return jsonify({"error": "Unauthorized to update these preferences"}), 403
    
    response, status = update_user_preferences(user_id, request.json)
    return jsonify(response), status

@user_bp.route('/<user_id>/deactivate', methods=['PUT'])
@token_required
def deactivate_account(user_id):
    """Deactivate user account (own account or admin)"""
    # Users can deactivate their own account, admins can deactivate any
    if request.user_id != user_id and request.current_user.role != 'admin':
        return jsonify({"error": "Unauthorized to deactivate this account"}), 403
    
    response, status = deactivate_user_account(user_id)
    return jsonify(response), status

# Admin-only routes
@user_bp.route('/<user_id>/activate', methods=['PUT'])
@admin_required
def activate_account(user_id):
    """Activate user account (admin only)"""
    response, status = activate_user_account(user_id)
    return jsonify(response), status

@user_bp.route('/<user_id>', methods=['DELETE'])
@admin_required
def delete_account(user_id):
    """Delete user account (admin only)"""
    response, status = delete_user_account(user_id)
    return jsonify(response), status

@user_bp.route('/', methods=['GET'])
@admin_required
def list_users():
    """Get all users with pagination (admin only)"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    active_only = request.args.get('active_only', 'true').lower() == 'true'
    
    response, status = get_all_users(page, per_page, active_only)
    return jsonify(response), status