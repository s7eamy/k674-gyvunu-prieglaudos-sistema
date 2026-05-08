from app.models import db
from app.models.adoption_request import AdoptionRequest
from app.models.animal import Animal


def create_adoption_request(user_id, animal_id):
    animal = Animal.query.get(animal_id)
    if not animal:
        return None, "Animal not found"

    if animal.adopted == 1:
        return None, "This animal has already been adopted"

    existing = AdoptionRequest.query.filter_by(
        user_id=user_id, animal_id=animal_id, status='pending'
    ).first()
    if existing:
        return None, "You already have a pending request for this animal"

    try:
        request = AdoptionRequest(
            user_id=user_id,
            animal_id=animal_id,
            status='pending'
        )
        db.session.add(request)
        db.session.commit()
        return request.to_dict(), None
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def get_user_adoption_requests(user_id):
    requests = AdoptionRequest.query.filter_by(user_id=user_id)\
        .order_by(AdoptionRequest.created_at.desc()).all()
    return [r.to_dict() for r in requests]


def get_all_pending_requests():
    requests = AdoptionRequest.query.filter_by(status='pending')\
        .order_by(AdoptionRequest.created_at.asc()).all()
    return [r.to_dict() for r in requests]


def approve_adoption_request(request_id):
    adoption_request = AdoptionRequest.query.get(request_id)
    if not adoption_request:
        return None, "Adoption request not found"

    if adoption_request.status != 'pending':
        return None, "This request is no longer pending"

    try:
        adoption_request.status = 'approved'

        animal = Animal.query.get(adoption_request.animal_id)
        if animal:
            animal.adopted = 1

        AdoptionRequest.query.filter(
            AdoptionRequest.animal_id == adoption_request.animal_id,
            AdoptionRequest.id != request_id,
            AdoptionRequest.status == 'pending'
        ).update({'status': 'cancelled'})

        db.session.commit()
        return adoption_request.to_dict(), None
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def reject_adoption_request(request_id):
    adoption_request = AdoptionRequest.query.get(request_id)
    if not adoption_request:
        return None, "Adoption request not found"

    if adoption_request.status != 'pending':
        return None, "This request is no longer pending"

    try:
        adoption_request.status = 'rejected'
        db.session.commit()
        return adoption_request.to_dict(), None
    except Exception as e:
        db.session.rollback()
        return None, str(e)
