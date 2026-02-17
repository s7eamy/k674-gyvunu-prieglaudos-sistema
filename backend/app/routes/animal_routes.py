# Animal routes - Flask blueprint defining API endpoints for /api/animals
from flask import Blueprint, jsonify, request
from app.controllers.animal_controller import get_all_animals

animal_bp = Blueprint('animal_bp', __name__)

@animal_bp.route("/api/animals", methods=['GET'])
def animals():
    data = get_all_animals()
    return jsonify({"animals": data})