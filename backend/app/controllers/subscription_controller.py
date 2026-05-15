from app.models import db
from app.models.subscription import Subscription
from app.models.user import User
from app.models.animal import Animal
from flask import current_app
from app.controllers.email_service import send_new_animal_email


def _normalize_list(value):
    if value is None:
        return None
    if isinstance(value, list):
        cleaned = [str(v).strip().lower() for v in value if str(v).strip()]
        return ','.join(cleaned) if cleaned else None
    cleaned = str(value).strip().lower()
    return cleaned or None


def _parse_list(value):
    if not value:
        return []
    if isinstance(value, list):
        return [str(v).strip().lower() for v in value if str(v).strip()]
    return [v.strip().lower() for v in str(value).split(',') if v.strip()]


def create_or_update_subscription(user_id, data):
    # find existing subscription for user, overwrite if present
    sub = Subscription.query.filter_by(user_id=user_id).first()
    if not sub:
        sub = Subscription(user_id=user_id)

    sub.animal_type = _normalize_list(data.get('animal_type'))
    sub.size = _normalize_list(data.get('size'))
    sub.temperament = _normalize_list(data.get('temperament'))
    sub.active = bool(data.get('active', True))

    db.session.add(sub)
    db.session.commit()
    return sub.to_dict(), None


def get_user_subscriptions(user_id):
    subs = Subscription.query.filter_by(user_id=user_id).all()
    return [s.to_dict() for s in subs]


def delete_subscription(user_id, sub_id):
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return None, 'Subscription not found'
    db.session.delete(sub)
    db.session.commit()
    return sub.to_dict(), None


def _matches(sub: Subscription, animal: Animal):
    if not sub.active:
        return False
    animal_type = animal.type.lower()
    animal_size = animal.size.lower()
    animal_temperament = animal.temperament.lower()

    if sub.animal_type and animal_type not in _parse_list(sub.animal_type):
        return False
    if sub.size and animal_size not in _parse_list(sub.size):
        return False
    if sub.temperament and animal_temperament not in _parse_list(sub.temperament):
        return False
    return True


def notify_subscribers_for_animal(animal):
    # find subs and send emails synchronously for now
    subs = Subscription.query.filter_by(active=True).all()
    matched = [s for s in subs if _matches(s, animal)]
    for s in matched:
        user = User.query.get(s.user_id)
        if not user:
            continue
        try:
            send_new_animal_email(user.email, user.name, animal)
        except Exception as e:
            current_app.logger.exception('Failed to send subscription email: %s', e)
