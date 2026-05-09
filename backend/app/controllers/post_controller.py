# Post controller - business logic for post CRUD operations
from app.models import db
from app.models.post import Post


def create_post(data, user_id):
    """
    Create a new post.
    Required fields: title, content
    Optional fields: image_url
    Returns (post_dict, None) on success or (None, error_message) on failure.
    """
    if not isinstance(data, dict):
        return None, 'Invalid request body'

    title = str(data.get('title', '')).strip()
    content = str(data.get('content', '')).strip()
    image_url_value = data.get('image_url')
    image_url = str(image_url_value).strip() if image_url_value is not None else None

    if not title:
        return None, 'title is required'

    if not content:
        return None, 'content is required'

    post = Post(
        title=title,
        content=content,
        image_url=image_url if image_url else None,
        created_by=user_id,
    )

    try:
        db.session.add(post)
        db.session.commit()
        return post.to_dict(), None
    except Exception as exc:
        db.session.rollback()
        return None, f'Database error: {str(exc)}'


def get_posts():
    """
    Get all posts ordered by newest first.
    Returns list of post dictionaries.
    """
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return [post.to_dict() for post in posts]
