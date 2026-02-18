# Entry point for `python -m app`, import create_app from __init__ and run the dev server
from app import create_app

<<<<<<< HEAD
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
=======
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=8081)
>>>>>>> b844412e72058fe6d01fd4e06c3cb5e261b9eb76
