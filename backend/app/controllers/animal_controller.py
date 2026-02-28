# Animal controller - business logic for animal CRUD operations
from app.models.animal import Animal
from datetime import datetime,  timedelta
from flask import abort

def get_animals(args):
    """
    Get all animals that meet selected filters
    Get all animals from db if no filters selected
    Returns list of animal dictionaries
    """
    # By which parameters animal entries can be filtered by
    # created_at is not here because it needs special actions
    regular_filters = {
        'id', 'name', 'type', 'breed', 'size', 'age', 
        'vaccinated', 'tem  perament', 'description', 
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
            abort(400, description="Invalid date format, use YYYY-MM-DD")
    
    animals = query.all()
    return [animal.to_dict() for animal in animals]