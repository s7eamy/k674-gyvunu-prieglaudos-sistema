# Auth routes - Flask blueprint defining API endpoints for /api/auth
from flask import Blueprint, jsonify, request
from app.controllers import auth_controller

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    # POST /api/auth/register - register a new user
    data = request.get_json()

    if not data or not data.get('name') or not data.get('password'):
        return jsonify({'error': 'Name and password are required'}), 400

    user, error = auth_controller.register_user(data['name'], data['password'])

    if error:
        return jsonify({'error': error}), 409

    return jsonify(user), 201
