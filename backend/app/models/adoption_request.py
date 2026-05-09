from app.models import db
from datetime import datetime


class AdoptionRequest(db.Model):
    __tablename__ = 'adoption_requests'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'), nullable=False)
    status = db.Column(db.Text, nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    animal = db.relationship('Animal', backref='adoption_requests')
    user = db.relationship('User', backref='adoption_requests')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'animal_id': self.animal_id,
            'animal_name': self.animal.name if self.animal else None,
            'animal_type': self.animal.type if self.animal else None,
            'user_name': self.user.name if self.user else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
