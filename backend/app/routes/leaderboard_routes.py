# Leaderboard - Flask blueprint defining API endpoints for /api/leaderboard
from flask import Blueprint, jsonify
from app.controllers import user_controller

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('', methods=['GET'])
def get_all_users():
    topUsers, error = user_controller.get_leaderboard_users()
    if error:
        return jsonify({"error": error}), 404

    return jsonify({"leaderboardUsers": topUsers}), 200