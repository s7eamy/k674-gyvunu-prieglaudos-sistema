from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import adoption_request_controller

adoption_request_bp = Blueprint('adoptionRequests', __name__)


@adoption_request_bp.route('/adoption-requests', methods=['POST'])
@jwt_required()
def create_adoption_request():
    user_id = get_jwt_identity()
    data = request.get_json()
    animal_id = data.get('animal_id')

    if not animal_id:
        return jsonify({"error": "animal_id is required"}), 400

    adoption_request, error = adoption_request_controller.create_adoption_request(user_id, animal_id)
    if error:
        return jsonify({"error": error}), 400

    return jsonify(adoption_request), 201


@adoption_request_bp.route('/adoption-requests', methods=['GET'])
@jwt_required()
def get_user_adoption_requests():
    user_id = get_jwt_identity()
    requests = adoption_request_controller.get_user_adoption_requests(user_id)
    return jsonify({"adoptionRequests": requests}), 200
