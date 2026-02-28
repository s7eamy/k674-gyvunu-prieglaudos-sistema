# Animal routes - Flask blueprint defining API endpoints for /api/animals
from flask import Blueprint, jsonify, request
from app.controllers import animal_controller

animal_bp = Blueprint('animals', __name__)

@animal_bp.route('', methods=['GET'])
def get_animals():
    # get list of animals based on arguments in args
    animals_list = animal_controller.get_animals(request.args)
    return jsonify({"animals": animals_list}), 200