# User controller - business logic for user CRUD operations
from app.models import db
from app.models.user import User
from app.controllers import donation_controller, volunteer_registration_controller

def get_all_users():
    """
    Get data of all users
    """
    allUsers = User.query.all()
    
    if not allUsers:
        return None, "Couldn't find users"

    return [user.to_dict() for user in allUsers]

def get_leaderboard_users():
    """
    Get data of top 5 users based on vol and donate points
    """
    topUsers = User.query.filter(User.role!='admin').order_by((User.volunteer_points*25+User.donation_points).desc()).slice(0,5)
    
    if not topUsers:
        return None, "Couldn't find users"

    return [user.to_dict() for user in topUsers], None

def get_user_by_id(id):
    """
    Get data of user with selected id
    """
    user = User.query.filter_by(id=id).first()
    
    if not user:
        return None, "Couldn't find user with selected id"

    return user.to_dict(), None

def get_user_role(id):
    """
    Get role of user with selected id
    """
    user = User.query.filter_by(id=id).first()
    if not user:
        return None, "Couldn't find user with selected id"
    return user.role, None

def add_volunteer_points(id):
    """
    Add volunteering points to user
    """
    user = User.query.filter_by(id=id).first()
    
    if not user:
        return None, "User not found for giving volunteerting points"
    
    user.volunteer_points += 1
    db.session.commit()
     
    return user.to_dict(), None


def get_user_profile(user_id):
    """
    Get complete user profile with donor and volunteer levels
    """
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return None, "User not found"
    
    donor_level = donation_controller.get_donor_level(user_id)
    volunteer_level = volunteer_registration_controller.get_volunteer_level(user_id)
    
    return {
        'user': user.to_dict(),
        'donor_level': donor_level,
        'volunteer_level': volunteer_level,
    }, None