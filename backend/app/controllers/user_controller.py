# User controller - business logic for user CRUD operations
from app.models import db
from app.models.user import User

def get_all_users():
    """
    Get data of all users
    """
    allUsers = User.query.all()
    
    if not allUsers:
        return None, "Couldn't find users"

    return [user.to_dict() for user in allUsers]

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