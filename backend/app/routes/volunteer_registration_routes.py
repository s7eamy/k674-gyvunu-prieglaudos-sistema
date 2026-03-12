# Volunteer Registration routes - Flask blueprint defining API endpoints for /api/volunteer
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import volunteer_registration_controller
from datetime import datetime

volunteer_registration_bp = Blueprint('volunteerRegistrations', __name__)

@volunteer_registration_bp.route('/volunteer', methods=['GET'])
@jwt_required()
def get_volunteer_registrations():
    user_id = get_jwt_identity()
    print(user_id)
    # get list of volunteer registrations
    registrations = volunteer_registration_controller.get_volunteer_registrations(user_id)
    return jsonify({"volunteerRegistrations": registrations}), 200

@volunteer_registration_bp.route('/volunteer', methods=['POST'])
@jwt_required()
def create_volunteer_registration():

    data = request.get_json()
    user_id = get_jwt_identity()

    if not data or not data.get("date") or not data.get("time_from") or not data.get("time_to"):
        return jsonify({"error": "date, time_from and time_to are required"}), 400

    registration = volunteer_registration_controller.create_volunteer_registration(
        user_id=user_id,
        date=datetime.strptime(data["date"], "%Y-%m-%d"),
        time_from=data["time_from"],
        time_to=data["time_to"]
    )

    return jsonify(registration), 201