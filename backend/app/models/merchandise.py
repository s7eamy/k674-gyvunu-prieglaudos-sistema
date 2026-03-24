# Merchandise model - prekių užsakymams
from app.models import db
from datetime import datetime


class Merchandise(db.Model):
    __tablename__ = 'merchandise'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    color = db.Column(db.Text, nullable=False)      # black/white
    size = db.Column(db.Text, nullable=False)       # XS, S, M, L, XL, XXL
    design = db.Column(db.Text, nullable=False)     # dizaino id/pavadinimas
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Float, nullable=False)      # suma eurais
    donation_points = db.Column(db.Integer, default=0)  # leidžiama taškus
    order_status = db.Column(db.Text, default='pending')  # pending|paid|shipped|delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'color': self.color,
            'size': self.size,
            'design': self.design,
            'quantity': self.quantity,
            'price': self.price,
            'donation_points': self.donation_points,
            'order_status': self.order_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
