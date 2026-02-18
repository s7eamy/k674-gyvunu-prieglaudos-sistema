# Animal controller - business logic for animal CRUD operations
from app.models.animal import Animal, db

def get_all_animals():
    """
    Get all animals from db
    Returns list of animal dictionaries
    """
    animals = Animal.query.all()
    return [animal.to_dict() for animal in animals]

def get_animal_by_id(animal_id):
    """
    Get a single animal by ID
    Returns animal dictionary or None if not found
    """
    animal = Animal.query.get(animal_id)
    return animal.to_dict() if animal else None
