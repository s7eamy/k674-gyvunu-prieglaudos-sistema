from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.merchandise_controller import (
    create_order,
    get_user_orders,
    get_order,
    update_order_status,
    delete_order,
)

merchandise_bp = Blueprint('merchandise', __name__)


@merchandise_bp.route('', methods=['POST'])
@jwt_required()
def create_order_route():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    order = create_order(
        user_id=user_id,
        color=data.get('color'),
        size=data.get('size'),
        design=data.get('design'),
        quantity=data.get('quantity', 1),
        price=data.get('price'),
    )
    return jsonify({'order': order}), 201


@merchandise_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_orders_route():
    user_id = get_jwt_identity()
    orders = get_user_orders(user_id)
    return jsonify({'orders': orders}), 200


@merchandise_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_route(order_id):
    order = get_order(order_id)
    return jsonify({'order': order}), 200


@merchandise_bp.route('/<int:order_id>/status', methods=['PATCH'])
@jwt_required()
def update_order_status_route(order_id):
    data = request.get_json() or {}
    order = update_order_status(order_id, data.get('status'))
    return jsonify({'order': order}), 200


@merchandise_bp.route('/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order_route(order_id):
    result = delete_order(order_id)
    return jsonify(result), 200
