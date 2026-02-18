# Animal routes - Flask blueprint defining API endpoints for /api/animals
<<<<<<< HEAD
from flask import Blueprint, jsonify
from app.controllers import animal_controller

animal_bp = Blueprint('animals', __name__)

@animal_bp.route('', methods=['GET'])
def get_animals():
    # GET /api/animals - get all animals
    animals = animal_controller.get_all_animals()
    return jsonify(animals), 200

@animal_bp.route('/<int:animal_id>', methods=['GET'])
def get_animal(animal_id):
    # GET /api/animals/<id> - get a single animal by ID
    animal = animal_controller.get_animal_by_id(animal_id)
    
    if animal is None:
        return jsonify({'error': 'Animal not found'}), 404
    
    return jsonify(animal), 200
=======
from flask import Blueprint, jsonify, request
from app.controllers.animal_controller import get_all_animals

animal_bp = Blueprint('animal_bp', __name__)

@animal_bp.route("/api/animals", methods=['GET'])
def animals():
    data = get_all_animals()
    return jsonify({"animals": data})
>>>>>>> b844412e72058fe6d01fd4e06c3cb5e261b9eb76
