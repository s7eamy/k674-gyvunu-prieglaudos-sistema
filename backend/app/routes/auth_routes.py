# Auth routes - Flask blueprint defining API endpoints for /api/auth
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from app.controllers import auth_controller, user_controller

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    # POST /api/auth/register - register a new user
    data = request.get_json()

    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Name, email and password are required'}), 400

    user, error = auth_controller.register_user(data['name'], data['email'], data['password'])

    if error:
        return jsonify({'error': error}), 409

    return jsonify(user), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    # POST /api/auth/login - verify credentials and return a JWT access token
    data = request.get_json()

    if not data or not data.get('name') or not data.get('password'):
        return jsonify({'error': 'Name and password are required'}), 400

    user, error = auth_controller.login_user(data['name'], data['password'])

    if error:
        return jsonify({'error': error}), 401

    access_token = create_access_token(identity=str(user['id']))
    return jsonify({'access_token': access_token, 'user': user}), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # POST /api/auth/logout - revoke the current JWT token
    from app.blocklist import BLOCKLIST
    jti = get_jwt()['jti']
    BLOCKLIST.add(jti)
    return jsonify({'message': 'Successfully logged out'}), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    # GET /api/auth/profile - get current user's profile with levels
    user_id = get_jwt_identity()
    profile_data, error = user_controller.get_user_profile(int(user_id))
    
    if error:
        return jsonify({'error': error}), 404
    
    return jsonify(profile_data), 200
