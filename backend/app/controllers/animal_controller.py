# Animal controller — business logic for animal CRUD operations (validation, data transformation)
from app.models.animal import Animal, db

def get_all_animals():
    animals = Animal.query.all()
    return [animal.to_dict() for animal in animals]
