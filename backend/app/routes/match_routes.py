# Match routes - Flask blueprint defining API endpoints for matching animals
from flask import Blueprint, jsonify, request
from app.controllers import match_controller

match_bp = Blueprint('match', __name__)

@match_bp.route('/match', methods=['POST'])
def get_matches():
    # Get JSON body and check for answers key
    data = request.get_json()
    if data is None or 'answers' not in data:
        return jsonify({"error": "answers are required"}), 400
    
    # Get matches based on answers
    matches = match_controller.get_matches(data['answers'])
    return jsonify({"matches": matches}), 200
