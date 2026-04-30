from app import db

user_favorite_animals = db.Table('user_favorite_animals',
     db.Column('user_id', db.Integer , db.ForeignKey('users.id'), primary_key=True),
    db.Column('animal_id', db.Integer, db.ForeignKey('animals.id'), primary_key=True))