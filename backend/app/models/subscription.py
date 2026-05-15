from app.models import db
from datetime import datetime


class Subscription(db.Model):
    __tablename__ = 'subscriptions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    animal_type = db.Column(db.Text, nullable=True)  # 'dog', 'cat', or None for any
    size = db.Column(db.Text, nullable=True)  # e.g. 'small', 'medium', 'large'
    temperament = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'animal_type': self.animal_type,
            'size': self.size,
            'temperament': self.temperament,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
