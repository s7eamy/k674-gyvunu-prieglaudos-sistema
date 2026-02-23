# Flask app setup - configurations, extensions, blueprint registration, etc
from flask import Flask
from flask_cors import CORS
from app.models import db

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shelter.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'dev-secret-key' # Change later for production
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.routes.animal_routes import animal_bp
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(animal_bp, url_prefix='/api/animals')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Import all models so db.create_all() picks them up
    from app.models import animal, user  # noqa: F401

    # Create tables if they dont exist
    with app.app_context():
        db.create_all()
    
    return app
