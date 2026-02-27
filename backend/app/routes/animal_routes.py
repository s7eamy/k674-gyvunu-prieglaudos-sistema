# Animal routes - Flask blueprint defining API endpoints for /api/animals
from flask import Blueprint, jsonify, request
from app.controllers import animal_controller

animal_bp = Blueprint('animals', __name__)

@animal_bp.route('', methods=['GET'])
def get_animals():
    # get list of animals based on arguments in args
    animals_list = animal_controller.get_animals(request.args)
    return jsonify({"animals": animals_list}), 200

"""
Methods bellow not needed? All animals can be returned with empty query

Returns animal with selected id (/api/animals/1 returns animal with id=1)

@animal_bp.route('/<int:animal_id>', methods=['GET'])
def get_animal(animal_id):
    # GET /api/animals/<id> - get a single animal by ID
    animal = animal_controller.get_animal_by_id(animal_id)
    
    if animal is None:
        return jsonify({'error': 'Animal not found'}), 404
    
    return jsonify(animal), 200

 Returns all animals form table 

@animal_bp.route('', methods=['GET'])
def get_animals():
    # GET /api/animals - get all animals
    animals_list = animal_controller.get_all_animals()
    return jsonify({"animals": animals_list}), 200

"""