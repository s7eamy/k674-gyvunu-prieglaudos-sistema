# Volunteer Registration controller - business logic for CRUD operations
from app.models.volunteer_registration import Volunteer_Registration
from app.models import db


def get_volunteer_registrations(user_id):
    """
    Get all volunteer registrations that belong to user
    """
    registrations = Volunteer_Registration.query.filter_by(user_id=user_id).all()
    
    return [registration.to_dict() for registration in registrations]

def create_volunteer_registration(user_id, date, time_from, time_to):
    """
    Create new volunteer registration
    """

    registration = Volunteer_Registration(
        user_id=user_id,
        date=date,
        time_from=time_from,
        time_to=time_to
    )

    db.session.add(registration)
    db.session.commit()
     
    return registration.to_dict()
