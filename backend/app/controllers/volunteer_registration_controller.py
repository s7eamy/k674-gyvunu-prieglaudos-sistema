# Volunteer Registration controller - business logic for CRUD operations
from app.models.volunteer_registration import Volunteer_Registration
from app.models import db

# Thresholds: level n requires 2^n - 1 completed volunteerings
LEVEL_THRESHOLDS = [0, 1, 3, 7, 15, 31]
MAX_LEVEL = len(LEVEL_THRESHOLDS) - 1  # 5


def _calculate_level(completed_count):
    """Calculate volunteer level based on completed volunteering count."""
    level = 0
    for i, threshold in enumerate(LEVEL_THRESHOLDS):
        if completed_count >= threshold:
            level = i
        else:
            break
    return level


def get_volunteer_registrations(user_id):
    """
    Get all volunteer registrations that belong to user
    """
    registrations = Volunteer_Registration.query.filter_by(user_id=user_id).all()

    return [registration.to_dict() for registration in registrations]

def get_all_volunteer_registrations():
    """
    Get all volunteer registrations from all users
    """
    registrations = Volunteer_Registration.query.all()

    return [registration.to_dict() for registration in registrations]


def get_volunteer_level(user_id):
    """
    Calculate volunteer level based on number of attended registrations.
    """
    completed_count = Volunteer_Registration.query.filter_by(
        user_id=user_id, attended=1
    ).count()

    level = _calculate_level(completed_count)
    next_threshold = LEVEL_THRESHOLDS[level + 1] if level < MAX_LEVEL else None

    return {
        "level": level,
        "max_level": MAX_LEVEL,
        "completed_count": completed_count,
        "next_threshold": next_threshold,
    }


def get_attended_value(id):
    """
    Get attended attribute value of registration
    """
    registration = Volunteer_Registration.query.filter_by(id=id).first()
    return registration.attended

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

def approve_volunteer_registration(id):
    """
    Approve volunteer registration
    """
    registration = Volunteer_Registration.query.filter_by(id=id).first()
    
    if not registration:
        return None, "Registration not found"
    
    registration.approved = 1
    db.session.commit()
     
    return registration.to_dict(), None

def mark_attendace_registration(id):
    """
    Mark volunteer registration attendance
    """
    registration = Volunteer_Registration.query.filter_by(id=id).first()
    
    if not registration:
        return None, "Registration not found"
    
    registration.attended = 1
    db.session.commit()
     
    return registration.to_dict(), None


