# Entry point for `python -m app`, import create_app from __init__ and run the dev server
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=8081)