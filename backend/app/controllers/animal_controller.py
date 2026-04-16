# Animal controller - business logic for animal CRUD operations
from app.models import db
from app.models.animal import Animal, AnimalImage
from datetime import datetime,  timedelta
from flask import abort
from werkzeug.utils import secure_filename
import os
from pathlib import Path

current_file = Path(__file__).resolve()
project_root = current_file.parents[3] # location of k674 folder

UPLOAD_FOLDER = project_root / 'frontend' / 'public' / 'images' / 'animals'

def get_animals(args):
    """
    Get all animals that meet selected filters
    Get all animals from db if no filters selected
    Returns list of animal dictionaries
    """
    # By which parameters animal entries can be filtered by
    # created_at is not here because it needs special actions
    regular_filters = {
        'id', 'name', 'type', 'breed', 'size', 
        'vaccinated', 'temperament', 'description', 
        'adopted'
    }

    filter_data = {key: value for key, value in args.items() if key in regular_filters}

    query = Animal.query.filter_by(**filter_data)

    # age range special actions
    if 'ageMin' in args:
        try:
            query = query.filter(Animal.age >= int(args['ageMin']))
        except ValueError:
            abort(400, description="Invalid ageMin, use integer")

    if 'ageMax' in args:
        try:
            query = query.filter(Animal.age <= int(args['ageMax']))
        except ValueError:
            abort(400, description="Invalid ageMax, use integer")

    # created_at special actions
    if 'created_at' in args:
        try:
            date_value = args['created_at']
            start_date = datetime.strptime(date_value, "%Y-%m-%d")
            end_date = start_date + timedelta(days=1)

            query = query.filter(Animal.created_at >= start_date, Animal.created_at < end_date)
        except ValueError:
            abort(400, description="Invalid date format, use YYYY-MM-DD")
    
    animals = query.all()
    return [animal.to_dict() for animal in animals]


def add_animal(data, files):
    """
    Add a new animal to the system.
    Required fields: name, type, breed, size, age, vaccinated, temperament
    Optional fields: description
    Returns (animal_dict, None) on success or (None, error_message) on failure.
    """
    # Validate required fields
    required_fields = ['name', 'type', 'breed', 'size', 'age', 'vaccinated', 'temperament']
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == '':
            return None, f"{field} is required"
    
    # Validate age is integer and non-negative
    try:
        age = int(data['age'])
        if age < 0:
            return None, "Age must be non-negative"
    except (ValueError, TypeError):
        return None, "Age must be a valid integer"
    
    # Validate vaccinated is boolean-like (0 or 1)
    try:
        vaccinated = int(data['vaccinated'])
        if vaccinated not in [0, 1]:
            return None, "Vaccinated must be 0 (no) or 1 (yes)"
    except (ValueError, TypeError):
        return None, "Vaccinated must be 0 or 1"
    
    # Create animal
    animal = Animal(
        name=data['name'],
        type=data['type'],
        breed=data['breed'],
        size=data['size'],
        age=age,
        vaccinated=vaccinated,
        temperament=data['temperament'],
        description=data.get('description', ''),
        adopted=0  # New animals are available by default
    )
    
    try:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        db.session.add(animal)
        db.session.flush() # allows to get animal id?

        #adding images
        if 'images' in files:
            uploaded_files = files.getlist('images')
            for file in uploaded_files:
                if file and file.filename != '':
                    
                    filename = secure_filename(file.filename)
                    unique_filename = f"{animal.id}_{filename}"
                    file.save(os.path.join(UPLOAD_FOLDER, unique_filename))
                    
                    new_image = AnimalImage(
                        animal_id=animal.id,
                        url=f"/images/animals/{unique_filename}"
                    )
                    db.session.add(new_image)

        db.session.commit()
        return animal.to_dict(), None
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"