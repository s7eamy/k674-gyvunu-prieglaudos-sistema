# VolunteerRegistration model
from app.models import db
from datetime import datetime


class Volunteer_Registration(db.Model):
    __tablename__ = 'volunteer_registrations'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id  = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False) # which day the volunteer arrives
    time_from = db.Column(db.Text, nullable=False) # when work starts
    time_to = db.Column(db.Text, nullable=False) # work ends
    approved = db.Column(db.Integer, default=0)  # admin approval before confirming registration 0 - not approved
    attended = db.Column(db.Integer, default=0)  # confirm if volunteer attended, 0 - hasnt attended
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        # Convert model instance to dict for JSON
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'time_from': self.time_from,
            'time_to': self.time_to,
            'approved': bool(self.approved), 
            'attended': bool(self.attended),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
