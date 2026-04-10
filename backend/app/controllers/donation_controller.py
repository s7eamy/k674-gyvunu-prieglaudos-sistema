from datetime import datetime
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

import stripe
from flask import abort, current_app

from app.models import db
from app.models.donation import Donation
from app.models.user import User


DONOR_LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000]


def _set_stripe_key():
    stripe.api_key = current_app.config.get('STRIPE_SECRET_KEY', '')
    if not stripe.api_key:
        abort(500, description='Stripe is not configured')


def _amount_to_cents(amount):
    try:
        amount_decimal = Decimal(str(amount))
    except (InvalidOperation, TypeError, ValueError):
        abort(400, description='A valid donation amount is required')

    amount_cents = int((amount_decimal * Decimal('100')).quantize(Decimal('1'), rounding=ROUND_HALF_UP))
    if amount_cents <= 0:
        abort(400, description='Donation amount must be greater than zero')

    return amount_cents


def _build_donor_level(total_points):
    max_level = len(DONOR_LEVEL_THRESHOLDS)
    level = 1

    for index in range(len(DONOR_LEVEL_THRESHOLDS) - 1, -1, -1):
        if total_points >= DONOR_LEVEL_THRESHOLDS[index]:
            level = index + 1
            break

    if level >= max_level:
        return {
            'level': max_level,
            'max_level': max_level,
            'total_points': total_points,
            'points_to_next_level': 0,
            'next_threshold': None,
        }

    next_threshold = DONOR_LEVEL_THRESHOLDS[level]
    return {
        'level': level,
        'max_level': max_level,
        'total_points': total_points,
        'points_to_next_level': max(0, next_threshold - total_points),
        'next_threshold': next_threshold,
    }


def get_donor_level(user_id):
    user = User.query.get(user_id) if user_id else None
    total_points = user.donation_points if user else 0
    return _build_donor_level(total_points)


def create_donation_payment_intent(data, user_id=None):
    _set_stripe_key()

    amount_cents = _amount_to_cents(data.get('amount'))
    donor_name = (data.get('donorName') or '').strip()
    donor_email = (data.get('donorEmail') or '').strip()
    message = (data.get('message') or '').strip() or None
    is_anonymous = bool(data.get('isAnonymous', False))

    if is_anonymous:
        donor_name = donor_name or 'Anonymous'
        donor_email = None
    else:
        if not donor_name:
            abort(400, description='Donor name is required')
        if not donor_email:
            abort(400, description='Donor email is required')

    donation = Donation(
        user_id=user_id,
        donor_name=donor_name,
        donor_email=donor_email,
        message=message,
        amount_cents=amount_cents,
        currency=current_app.config.get('STRIPE_CURRENCY', 'eur'),
        is_anonymous=is_anonymous,
        payment_status='requires_payment_method',
    )

    db.session.add(donation)
    db.session.flush()

    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=donation.currency,
            automatic_payment_methods={'enabled': True},
            receipt_email=donor_email,
            description='Animal shelter donation',
            metadata={
                'donation_id': str(donation.id),
                'user_id': str(user_id or ''),
                'donor_name': donor_name,
                'is_anonymous': 'true' if is_anonymous else 'false',
            },
        )
    except stripe.error.StripeError as error:
        db.session.rollback()
        abort(502, description=f"Stripe payment intent could not be created: {error.user_message or str(error)}")

    donation.stripe_payment_intent_id = payment_intent.id
    donation.payment_status = payment_intent.status

    db.session.commit()

    return {
        'donation': donation.to_dict(),
        'client_secret': payment_intent.client_secret,
    }


def _mark_donation_succeeded(payment_intent):
    donation = Donation.query.filter_by(stripe_payment_intent_id=payment_intent.id).first()
    if not donation:
        donation_id = payment_intent.metadata.get('donation_id')
        if donation_id:
            donation = Donation.query.get(int(donation_id))

    if not donation or donation.payment_status == 'succeeded':
        return

    donation.payment_status = 'succeeded'
    donation.paid_at = datetime.utcnow()

    points_awarded = donation.amount_cents // 100
    donation.points_awarded = points_awarded

    if donation.user_id and points_awarded > 0:
        user = User.query.get(donation.user_id)
        if user:
            user.donation_points = (user.donation_points or 0) + points_awarded

    db.session.commit()


def finalize_donation_payment(payment_intent_id, user_id=None):
    _set_stripe_key()

    if not payment_intent_id:
        abort(400, description='paymentIntentId is required')

    try:
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
    except stripe.error.StripeError as error:
        abort(502, description=f"Stripe payment intent retrieval failed: {error.user_message or str(error)}")

    donation = Donation.query.filter_by(stripe_payment_intent_id=payment_intent.id).first()
    if not donation:
        abort(404, description='Donation was not found for this payment intent')

    if donation.user_id and user_id and donation.user_id != user_id:
        abort(403, description='You are not allowed to finalize this donation')

    if payment_intent.status != 'succeeded':
        abort(400, description=f"Payment is not completed yet (status: {payment_intent.status})")

    _mark_donation_succeeded(payment_intent)

    refreshed_donation = Donation.query.get(donation.id)
    donor_level = get_donor_level(refreshed_donation.user_id) if refreshed_donation.user_id else None

    return {
        'donation': refreshed_donation.to_dict(),
        'donor_level': donor_level,
    }