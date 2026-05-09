# Post routes - Flask blueprint defining API endpoints for /api/posts
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.controllers import post_controller, user_controller

post_bp = Blueprint('posts', __name__)


@post_bp.route('', methods=['GET'])
def get_posts():
    posts = post_controller.get_posts()
    return jsonify({'posts': posts}), 200


@post_bp.route('', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({'error': error}), 404

    if user_role != 'admin':
        return jsonify({'error': 'Access denied: admin role required'}), 403

    data = request.get_json() or {}
    post, error = post_controller.create_post(data, user_id)
    if error:
        return jsonify({'error': error}), 400

    return jsonify(post), 201
