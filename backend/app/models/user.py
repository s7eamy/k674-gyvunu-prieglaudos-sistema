# User model
from app.models import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.Text, default='user')
    donation_points = db.Column(db.Integer, default=0)
    volunteer_points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'donation_points': self.donation_points,
            'volunteer_points': self.volunteer_points,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
