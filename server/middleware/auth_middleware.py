"""Authentication middleware for protected routes"""

from functools import wraps
from flask import request, jsonify
import jwt
import os
from datetime import datetime, timedelta
from models.user_schema import User

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRATION_HOURS = 24

def generate_token(user_id, username):
    """Generate JWT token for authenticated user"""
    payload = {
        "user_id": str(user_id),
        "username": username,
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

def decode_token(token):
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to protect routes - requires valid JWT token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                # Expected format: "Bearer <token>"
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({
                    "error": "Invalid token format",
                    "message": "Token should be in format: Bearer <token>"
                }), 401
        
        # Check for token in request body (optional fallback)
        elif request.is_json:
            token = request.json.get('token')
        
        if not token:
            return jsonify({
                "error": "Authentication required",
                "message": "No token provided"
            }), 401
        
        # Decode and validate token
        payload = decode_token(token)
        
        if not payload:
            return jsonify({
                "error": "Invalid or expired token",
                "message": "Please login again"
            }), 401
        
        # Get user from database
        user = User.find_by_id(payload['user_id'])
        
        if not user:
            return jsonify({
                "error": "User not found",
                "message": "User associated with this token no longer exists"
            }), 401
        
        if not user.is_active:
            return jsonify({
                "error": "Account deactivated",
                "message": "Your account has been deactivated"
            }), 403
        
        # Add user to request context
        request.current_user = user
        request.user_id = payload['user_id']
        
        return f(*args, **kwargs)
    
    return decorated_function

def optional_token(f):
    """Decorator for routes where authentication is optional"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                pass
        
        if token:
            payload = decode_token(token)
            if payload:
                user = User.find_by_id(payload['user_id'])
                if user and user.is_active:
                    request.current_user = user
                    request.user_id = payload['user_id']
        
        return f(*args, **kwargs)
    
    return decorated_function

def admin_required(f):
    """Decorator to protect admin-only routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # First check authentication
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({
                    "error": "Invalid token format"
                }), 401
        
        if not token:
            return jsonify({
                "error": "Authentication required"
            }), 401
        
        payload = decode_token(token)
        
        if not payload:
            return jsonify({
                "error": "Invalid or expired token"
            }), 401
        
        user = User.find_by_id(payload['user_id'])
        
        if not user:
            return jsonify({
                "error": "User not found"
            }), 401
        
        if not user.is_active:
            return jsonify({
                "error": "Account deactivated"
            }), 403
        
        # Check admin role
        if user.role != 'admin':
            return jsonify({
                "error": "Admin access required",
                "message": "You don't have permission to access this resource"
            }), 403
        
        request.current_user = user
        request.user_id = payload['user_id']
        
        return f(*args, **kwargs)
    
    return decorated_function

def refresh_token(user_id, username):
    """Generate a new token (for token refresh endpoint)"""
    return generate_token(user_id, username)