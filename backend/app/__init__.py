# Flask app setup - configurations, extensions, blueprint registration, etc
from datetime import timedelta
from pathlib import Path
import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.models import db

jwt = JWTManager()

load_dotenv(Path(__file__).resolve().parents[2] / '.env')

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///shelter.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']
    app.config['FRONTEND_URL'] = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    app.config['STRIPE_SECRET_KEY'] = os.getenv('STRIPE_SECRET_KEY', '')
    app.config['STRIPE_CURRENCY'] = os.getenv('STRIPE_CURRENCY', 'eur')
    app.config['SMTP_HOST'] = os.getenv('SMTP_HOST', 'smtp.gmail.com')
    app.config['SMTP_PORT'] = os.getenv('SMTP_PORT', '587')
    app.config['SMTP_USER'] = os.getenv('SMTP_USER', '')
    app.config['SMTP_PASSWORD'] = os.getenv('SMTP_PASSWORD', '')
    app.config['SMTP_FROM_EMAIL'] = os.getenv('SMTP_FROM_EMAIL', '')
    app.config['SMTP_USE_TLS'] = os.getenv('SMTP_USE_TLS', 'true')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register token blocklist checker for logout support
    from app.blocklist import BLOCKLIST

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return jwt_payload['jti'] in BLOCKLIST
    
    # Register blueprints
    from app.routes.animal_routes import animal_bp
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(animal_bp, url_prefix='/api/animals')
    from app.routes.match_routes import match_bp
    app.register_blueprint(match_bp, url_prefix='/api/animals')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    from app.routes.volunteer_registration_routes import volunteer_registration_bp
    app.register_blueprint(volunteer_registration_bp, url_prefix='/api')
    from app.routes.admin_routes import admin_registration_bp
    app.register_blueprint(admin_registration_bp, url_prefix='/api')
    from app.routes.adoption_request_routes import adoption_request_bp
    app.register_blueprint(adoption_request_bp, url_prefix='/api')
    from app.routes.donation_routes import donation_bp
    app.register_blueprint(donation_bp, url_prefix='/api/donations')
    from app.routes.merchandise_routes import merchandise_bp
    app.register_blueprint(merchandise_bp, url_prefix='/api/merchandise')
    from app.routes.post_routes import post_bp
    app.register_blueprint(post_bp, url_prefix='/api/posts')
    from app.routes.subscription_routes import subscription_bp
    app.register_blueprint(subscription_bp, url_prefix='/api/subscriptions')
    from app.routes.leaderboard_routes import leaderboard_bp
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')

    # Import all models so db.create_all() picks them up
    from app.models import animal, donation, user, volunteer_registration, merchandise, post, adoption_request, subscription # noqa: F401

    # Create tables if they dont exist
    with app.app_context():
        db.create_all()
    
    return app
