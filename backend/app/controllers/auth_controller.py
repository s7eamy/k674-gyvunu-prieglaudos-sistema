# Auth controller - business logic for authentication
from app.models import db
from app.models.user import User
from werkzeug.security import generate_password_hash


def register_user(name, password):
    """
    Register a new user.
    Returns (user_dict, None) on success or (None, error_message) on failure.
    """
    existing_user = User.query.filter_by(name=name).first()
    if existing_user:
        return None, "Username already exists"

    password_hash = generate_password_hash(password)
    user = User(name=name, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    return user.to_dict(), None
