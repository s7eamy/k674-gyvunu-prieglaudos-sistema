# Entry point for `python -m app`, import create_app from __init__ and run the dev server
from app import create_app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
