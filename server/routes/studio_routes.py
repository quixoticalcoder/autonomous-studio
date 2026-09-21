"""Routes for studio workflow endpoints - Protected with authentication"""

from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from controllers.studio_controller import run_complete_workflow

studio_bp = Blueprint('studio', __name__)

@studio_bp.route('/run', methods=['POST'])
@token_required
def run_studio():
    """Execute complete autonomous-studio workflow - Protected"""
    response, status = run_complete_workflow(request.json)
    return jsonify(response), status