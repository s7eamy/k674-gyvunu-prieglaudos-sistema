# Donation model for Stripe-backed shelter donations
from datetime import datetime

from app.models import db


class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    donor_name = db.Column(db.Text, nullable=False)
    donor_email = db.Column(db.Text, nullable=True)
    message = db.Column(db.Text, nullable=True)
    amount_cents = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.Text, nullable=False, default='eur')
    is_anonymous = db.Column(db.Boolean, default=False)
    points_awarded = db.Column(db.Integer, default=0)
    payment_status = db.Column(db.Text, default='requires_payment_method')
    stripe_payment_intent_id = db.Column(db.Text, unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    paid_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'donor_name': self.donor_name,
            'donor_email': self.donor_email,
            'message': self.message,
            'amount_cents': self.amount_cents,
            'amount': round(self.amount_cents / 100, 2),
            'currency': self.currency,
            'is_anonymous': self.is_anonymous,
            'points_awarded': self.points_awarded,
            'payment_status': self.payment_status,
            'stripe_payment_intent_id': self.stripe_payment_intent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }