# Animal routes - Flask blueprint defining API endpoints for /api/animals
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import animal_controller, user_controller

animal_bp = Blueprint('animals', __name__)

@animal_bp.route('', methods=['GET'])
def get_animals():
    # get list of animals based on arguments in args
    animals_list = animal_controller.get_animals(request.args)
    return jsonify({"animals": animals_list}), 200


@animal_bp.route('', methods=['POST'])
@jwt_required()
def add_animal():
    # POST /api/animals - add a new animal (admin only)
    user_id = get_jwt_identity()
    user_role, error = user_controller.get_user_role(user_id)
    if error:
        return jsonify({'error': error}), 404
    
    if user_role != 'admin':
        return jsonify({'error': 'Access denied: admin role required'}), 403
    
    data = request.form
    files = request.files

    print(f"Form Data: {data}") 
    print(f"Files: {files}")

    animal, error = animal_controller.add_animal(data, files)
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify(animal), 201