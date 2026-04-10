from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.controllers.donation_controller import (
    create_donation_payment_intent,
    finalize_donation_payment,
    get_donor_level,
)

donation_bp = Blueprint('donation', __name__)


@donation_bp.route('/level', methods=['GET'])
@jwt_required(optional=True)
def get_donor_level_route():
    user_id = get_jwt_identity()
    donor_level = get_donor_level(int(user_id)) if user_id else get_donor_level(None)
    return jsonify({'donor_level': donor_level}), 200


@donation_bp.route('/payment-intents', methods=['POST'])
@jwt_required(optional=True)
def create_donation_payment_intent_route():
    data = request.get_json() or {}
    user_id = get_jwt_identity()
    result = create_donation_payment_intent(data, user_id=int(user_id) if user_id else None)
    return jsonify(result), 201


@donation_bp.route('/finalize', methods=['POST'])
@jwt_required(optional=True)
def finalize_donation_payment_route():
    data = request.get_json() or {}
    user_id = get_jwt_identity()
    payment_intent_id = (data.get('paymentIntentId') or '').strip()
    result = finalize_donation_payment(payment_intent_id, user_id=int(user_id) if user_id else None)
    return jsonify(result), 200