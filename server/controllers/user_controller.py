"""Controller for user operations"""

from models.user_schema import User
from middleware.auth_middleware import generate_token, refresh_token

def register_user(data):
    """Register a new user"""
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    role = data.get('role', 'user')
    
    # Validation
    if not username or not email or not password:
        return {"error": "Username, email, and password are required"}, 400
    
    if len(password) < 6:
        return {"error": "Password must be at least 6 characters long"}, 400
    
    # Create user
    user, error = User.create_user(username, email, password, full_name, role)
    
    if error:
        return {"error": error}, 400
    
    # Generate JWT token
    token = generate_token(user._id, user.username)
    
    return {
        "message": "User registered successfully",
        "user": user.to_dict(),
        "token": token
    }, 201

def login_user(data):
    """Authenticate user and return user data with token"""
    username_or_email = data.get('username') or data.get('email')
    password = data.get('password')
    
    if not username_or_email or not password:
        return {"error": "Username/email and password are required"}, 400
    
    user, error = User.authenticate(username_or_email, password)
    
    if error:
        return {"error": error}, 401
    
    # Generate JWT token
    token = generate_token(user._id, user.username)
    
    return {
        "message": "Login successful",
        "user": user.to_dict(),
        "token": token
    }, 200

def refresh_user_token(user_id):
    """Refresh JWT token for user"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    if not user.is_active:
        return {"error": "Account is deactivated"}, 403
    
    # Generate new token
    new_token = refresh_token(user._id, user.username)
    
    return {
        "message": "Token refreshed successfully",
        "token": new_token
    }, 200

def get_user_profile(user_id):
    """Get user profile by ID"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    return {
        "user": user.to_dict()
    }, 200

def get_current_user(user_id):
    """Get current authenticated user profile"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    return {
        "user": user.to_dict()
    }, 200

def update_user_profile(user_id, data):
    """Update user profile"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    # Remove password from update data if present
    data.pop('password', None)
    
    success = user.update(data)
    
    if not success:
        return {"error": "Failed to update user"}, 500
    
    # Get updated user
    updated_user = User.find_by_id(user_id)
    
    return {
        "message": "User profile updated successfully",
        "user": updated_user.to_dict()
    }, 200

def change_password(user_id, data):
    """Change user password"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    new_password = data.get('new_password')
    
    if not new_password:
        return {"error": "New password is required"}, 400
    
    if len(new_password) < 6:
        return {"error": "Password must be at least 6 characters long"}, 400
    
    success = user.update_password(new_password)
    
    if not success:
        return {"error": "Failed to update password"}, 500
    
    return {
        "message": "Password changed successfully"
    }, 200

def update_user_preferences(user_id, data):
    """Update user preferences"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    preferences = data.get('preferences', {})
    
    success = user.update_preferences(preferences)
    
    if not success:
        return {"error": "Failed to update preferences"}, 500
    
    # Get updated user
    updated_user = User.find_by_id(user_id)
    
    return {
        "message": "Preferences updated successfully",
        "preferences": updated_user.preferences
    }, 200

def deactivate_user_account(user_id):
    """Deactivate user account"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    success = user.deactivate()
    
    if not success:
        return {"error": "Failed to deactivate account"}, 500
    
    return {
        "message": "Account deactivated successfully"
    }, 200

def activate_user_account(user_id):
    """Activate user account"""
    user = User.find_by_id(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    success = user.activate()
    
    if not success:
        return {"error": "Failed to activate account"}, 500
    
    return {
        "message": "Account activated successfully"
    }, 200

def delete_user_account(user_id):
    """Delete user account"""
    success = User.delete_user(user_id)
    
    if not success:
        return {"error": "Failed to delete user or user not found"}, 404
    
    return {
        "message": "User deleted successfully"
    }, 200

def get_all_users(page=1, per_page=50, active_only=True):
    """Get all users with pagination"""
    skip = (page - 1) * per_page
    
    users = User.get_all_users(skip=skip, limit=per_page, active_only=active_only)
    total_users = User.count_users(active_only=active_only)
    
    return {
        "users": [user.to_dict() for user in users],
        "total": total_users,
        "page": page,
        "per_page": per_page,
        "total_pages": (total_users + per_page - 1) // per_page
    }, 200