from app.models.merchandise import Merchandise
from app.models.user import User
from app.models import db
from flask import abort


def create_order(user_id, color, size, design, quantity, price):
    if not user_id or not color or not size or not design or not quantity or not price:
        abort(400, description="Missing required fields")

    user = User.query.get(user_id)
    if not user:
        abort(404, description="User not found")

    donation_points = int(price * 0.1 * 10)

    order = Merchandise(
        user_id=user_id,
        color=color,
        size=size,
        design=design,
        quantity=quantity,
        price=price,
        donation_points=donation_points,
        order_status='pending'
    )

    try:
        db.session.add(order)
        db.session.commit()
        return order.to_dict()
    except Exception as e:
        db.session.rollback()
        abort(400, description=f"Error creating order: {e}")


def get_user_orders(user_id):
    user = User.query.get(user_id)
    if not user:
        abort(404, description="User not found")
    orders = Merchandise.query.filter_by(user_id=user_id).all()
    return [o.to_dict() for o in orders]


def get_order(order_id):
    order = Merchandise.query.get(order_id)
    if not order:
        abort(404, description="Order not found")
    return order.to_dict()


def update_order_status(order_id, new_status):
    order = Merchandise.query.get(order_id)
    if not order:
        abort(404, description="Order not found")

    valid_statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
    if new_status not in valid_statuses:
        abort(400, description=f"Invalid status: {new_status}")

    order.order_status = new_status
    db.session.commit()
    return order.to_dict()


def get_merchandise_config():
    """Get available merchandise configuration (public endpoint)"""
    return {
        "colors": ["black", "white"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "designs": [
            {
                "id": "shelter-love",
                "name": "Shelter Love",
                "description": "Cute cat design"
            },
            {
                "id": "rescue-me",
                "name": "Rescue Me", 
                "description": "Cute puppy design"
            },
            {
                "id": "mix",
                "name": "Mix Animals",
                "description": "Mix of cute rescue animals"
            },
            {
                "id": "plain",
                "name": "Plain T-Shirt",
                "description": "Simple shirt with no design"
            }
        ],
        "price": 19.99
    }


def delete_order(order_id):
    order = Merchandise.query.get(order_id)
    if not order:
        abort(404, description="Order not found")
    if order.order_status != 'pending':
        abort(400, description="Only pending orders can be deleted")

    db.session.delete(order)
    db.session.commit()
    return {"message": "Order deleted"} 
