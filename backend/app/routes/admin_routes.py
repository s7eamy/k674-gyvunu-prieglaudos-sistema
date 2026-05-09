# Admin routes - Flask blueprint defining API endpoints for /api/admin
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import volunteer_registration_controller, user_controller, adoption_request_controller

admin_registration_bp = Blueprint('adminRegistrations', __name__)

@admin_registration_bp.route('/admin', methods=['GET'])
@jwt_required()
def get_all_volunteer_registrations():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({"error": error}), 404
    
    if(user_role!='admin'):
        return jsonify({"error": "/admin access permitted for admins only"}), 403
    
    registrations = volunteer_registration_controller.get_all_volunteer_registrations()
    return jsonify({"adminRegistrations": registrations}), 200

@admin_registration_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({"error": error}), 404
    
    if(user_role!='admin'):
        return jsonify({"error": "/admin access permitted for admins only"}), 403
    
    allUsers = user_controller.get_all_users()
    return jsonify({"adminUsers": allUsers}), 200


@admin_registration_bp.route('/admin/approveRegistration', methods=['POST'])
@jwt_required()
def approve_registration():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({"error": error}), 404
    
    if(user_role!='admin'):
        return jsonify({"error": "/admin/approveRegistration access permitted for admins only"}), 403
    
    data = request.get_json()
    reg_id = data.get('id')

    if not reg_id:
        return jsonify({"error": "ID is required"}), 400
    
    registration, error = volunteer_registration_controller.approve_volunteer_registration(reg_id)
    if error:
        return jsonify({"error": error}), 404
    
    return jsonify(registration), 201

@admin_registration_bp.route('/admin/markAttendance', methods=['POST'])
@jwt_required()
def attendance_registration():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({"error": error}), 404
    
    if(user_role!='admin'):
        return jsonify({"error": "/admin/markAttendance access permitted for admins only"}), 403
    
    data = request.get_json()
    reg_id = data.get('id')
    user_id = data.get('user_id')
    if not reg_id or not user_id:
        return jsonify({"error": "registration and user ID is required"}), 400
    
    if(volunteer_registration_controller.get_attended_value(reg_id)!=1):
        user, error = user_controller.add_volunteer_points(user_id)
        if error:
            return jsonify({"error": error}), 404
        
    registration, error = volunteer_registration_controller.mark_attendace_registration(reg_id)
    if error:
        return jsonify({"error": error}), 404



    return jsonify(registration), 201


@admin_registration_bp.route('/admin/adoption-requests', methods=['GET'])
@jwt_required()
def get_all_adoption_requests():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({"error": error}), 404

    if(user_role!='admin'):
        return jsonify({"error": "/admin/adoption-requests access permitted for admins only"}), 403

    requests = adoption_request_controller.get_all_pending_requests()
    return jsonify({"adoptionRequests": requests}), 200


@admin_registration_bp.route('/admin/approveAdoption', methods=['POST'])
@jwt_required()
def approve_adoption():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({"error": error}), 404

    if(user_role!='admin'):
        return jsonify({"error": "/admin/approveAdoption access permitted for admins only"}), 403

    data = request.get_json()
    req_id = data.get('id')

    if not req_id:
        return jsonify({"error": "ID is required"}), 400

    adoption_request, error = adoption_request_controller.approve_adoption_request(req_id)
    if error:
        return jsonify({"error": error}), 404

    return jsonify(adoption_request), 201


@admin_registration_bp.route('/admin/rejectAdoption', methods=['POST'])
@jwt_required()
def reject_adoption():
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({"error": error}), 404

    if(user_role!='admin'):
        return jsonify({"error": "/admin/rejectAdoption access permitted for admins only"}), 403

    data = request.get_json()
    req_id = data.get('id')

    if not req_id:
        return jsonify({"error": "ID is required"}), 400

    adoption_request, error = adoption_request_controller.reject_adoption_request(req_id)
    if error:
        return jsonify({"error": error}), 404

    return jsonify(adoption_request), 201
