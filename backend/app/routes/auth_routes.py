# Auth routes - Flask blueprint defining API endpoints for /api/auth
from flask import Blueprint, jsonify, request, current_app, send_from_directory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from app.controllers import auth_controller, user_controller
from werkzeug.utils import secure_filename
from uuid import uuid4
import os
from app.models.user import User

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


# Allowed avatar extensions
ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg'}


def allowed_file(filename):
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXTENSIONS


@auth_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Unsupported file type'}), 400

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1].lower()
    new_filename = f"user_{user_id}_{uuid4().hex}{ext}"
    upload_folder = current_app.config.get('AVATAR_UPLOAD_FOLDER')
    if not upload_folder:
        return jsonify({'error': 'Server misconfiguration'}), 500

    # Remove old avatar if exists
    if user.avatar_filename:
        try:
            old_path = os.path.join(upload_folder, user.avatar_filename)
            if os.path.exists(old_path):
                os.remove(old_path)
        except Exception:
            pass

    save_path = os.path.join(upload_folder, new_filename)
    file.save(save_path)
    user.avatar_filename = new_filename
    from app.models import db
    db.session.commit()

    return jsonify({'avatar_filename': new_filename}), 200


@auth_bp.route('/avatar/<filename>', methods=['GET'])
def serve_avatar(filename):
    upload_folder = current_app.config.get('AVATAR_UPLOAD_FOLDER')
    if not upload_folder:
        return jsonify({'error': 'Server misconfiguration'}), 500
    return send_from_directory(upload_folder, filename)


@auth_bp.route('/avatar', methods=['DELETE'])
@jwt_required()
def delete_avatar():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.avatar_filename:
        return jsonify({'error': 'No avatar to delete'}), 400

    upload_folder = current_app.config.get('AVATAR_UPLOAD_FOLDER')
    try:
        path = os.path.join(upload_folder, user.avatar_filename)
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass

    user.avatar_filename = None
    from app.models import db
    db.session.commit()

    return jsonify({'message': 'Avatar deleted'}), 200
