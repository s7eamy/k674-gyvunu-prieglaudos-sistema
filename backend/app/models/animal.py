# Animal model
from flask_sqlalchemy import SQLAlchemy
<<<<<<< HEAD
from datetime import datetime
=======
>>>>>>> b844412e72058fe6d01fd4e06c3cb5e261b9eb76

db = SQLAlchemy()

class Animal(db.Model):
<<<<<<< HEAD
    __tablename__ = 'animals'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text)
    type = db.Column(db.Text, nullable=False)  # dog, cat, etc.
    breed = db.Column(db.Text)
    size = db.Column(db.Text)  # small, medium, large
    age = db.Column(db.Integer)
    vaccinated = db.Column(db.Integer, default=0)  # 0 = false, 1 = true
    temperament = db.Column(db.Text)  # calm, energetic, friendly
    description = db.Column(db.Text)
    adopted = db.Column(db.Integer, default=0)  # 0 = available, 1 = adopted
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        # Convert model instance to dict for JSON
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'breed': self.breed,
            'size': self.size,
            'age': self.age,
            'vaccinated': bool(self.vaccinated),
            'temperament': self.temperament,
            'description': self.description,
            'adopted': bool(self.adopted),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
=======
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    species = db.Column(db.String(80), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "species": self.species}
>>>>>>> b844412e72058fe6d01fd4e06c3cb5e261b9eb76
