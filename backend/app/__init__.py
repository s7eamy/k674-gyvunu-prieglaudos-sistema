<<<<<<< HEAD
# Flask app setup - configurations, extensions, blueprint registration, etc
from flask import Flask
from flask_cors import CORS
from app.models.animal import db

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
    app.register_blueprint(animal_bp, url_prefix='/api/animals')
    
    # Create tables if they dont exist
    with app.app_context():
        db.create_all()
    
    return app
=======
# Flask app setup — configuration, extensions, blueprint registration, etc
from flask import Flask
from flask_cors import CORS
from app.models.animal import db
from app.routes.animal_routes import animal_bp

def create_app():
    app = Flask(__name__)
    cors = CORS(app, origins='*') # accepts all origins, nebereikia?
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shelter.db'
    #app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
   #galima visas lenteles vienoje eiluteje?
    app.register_blueprint(animal_bp)
    
    with app.app_context():
        db.create_all() # Creates db file
        
    return app

#@app.route("/api/animals", methods=['GET'])
#def animals():
  #  return jsonify(
  #      {
  #          "animals":[
 #               'animal1',
   #             'animal2'
 #          ]
  #      }
  #  )
>>>>>>> b844412e72058fe6d01fd4e06c3cb5e261b9eb76
