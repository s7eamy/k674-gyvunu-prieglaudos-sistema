# Subscription routes - manage user subscriptions
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import subscription_controller

subscription_bp = Blueprint('subscriptions', __name__)


@subscription_bp.route('', methods=['POST'])
@jwt_required()
def create_subscription():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    sub, error = subscription_controller.create_or_update_subscription(int(user_id), data)
    if error:
        return jsonify({'error': error}), 400
    return jsonify(sub), 201


@subscription_bp.route('', methods=['GET'])
@jwt_required()
def list_subscriptions():
    user_id = get_jwt_identity()
    subs = subscription_controller.get_user_subscriptions(int(user_id))
    return jsonify({'subscriptions': subs}), 200


@subscription_bp.route('/<int:sub_id>', methods=['DELETE'])
@jwt_required()
def delete_subscription(sub_id):
    user_id = get_jwt_identity()
    sub, error = subscription_controller.delete_subscription(int(user_id), sub_id)
    if error:
        return jsonify({'error': error}), 404
    return jsonify(sub), 200
