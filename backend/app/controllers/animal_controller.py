# Animal controller - business logic for animal CRUD operations
from app.models.animal import Animal
from datetime import datetime,  timedelta

def get_animals(args):
    """
    Get all animals that meet selected filters
    Get all animals from db if no filters selected
    Returns list of animal dictionaries
    """
    # By which paramters animal entries can be filtered by
    # created_at is not here because it needs special actions
    regular_filters = {
        'id', 'name', 'type', 'breed', 'size', 'age', 
        'vaccinated', 'temperament', 'description', 
        'adopted'
    }

    filter_data = {key: value for key, value in args.items() if key in regular_filters}

    query = Animal.query.filter_by(**filter_data)

    # created_at special actions
    if 'created_at' in args:
        try:
            date_value = args['created_at']
            start_date = datetime.strptime(date_value, "%Y-%m-%d")
            end_date = start_date + timedelta(days=1)

            query = query.filter(Animal.created_at >= start_date, Animal.created_at < end_date)
        except ValueError:
            pass
    
    animals = query.all()
    return [animal.to_dict() for animal in animals]

"""
Deprecated by method above

def get_animal_by_id(animal_id):
    
    Get a single animal by ID
    Returns animal dictionary or None if not found
    
    animal = Animal.query.get(animal_id)
    return animal.to_dict() if animal else None

"""


