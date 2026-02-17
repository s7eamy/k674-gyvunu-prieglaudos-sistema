# Animal Shelter Management System

A CRUD web application for managing an animal shelter, built with **React (TypeScript)**, **Flask (Python)**, and **SQLite**, following the **MVC architecture**.

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App setup
│   │   ├── __main__.py          # Entry point for `python -m app`
│   │   ├── models/              # MODEL - ORM classes
│   │   │   └── animal.py
│   │   ├── controllers/         # CONTROLLER - Business logic
│   │   │   └── animal_controller.py
│   │   └── routes/              # VIEW - API endpoint blueprints
│   │       └── animal_routes.py
│   ├── tests/
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── components/          # VIEW - Reusable UI components
        │   ├── common/          #   Buttons, forms, tables, modals
        │   └── layout/          #   Navbar, sidebar, footer
        ├── pages/               # VIEW - Page-level components
        │   └── Animals/
        ├── services/            # API call layer
        │   ├── api.ts           #   Base Axios/fetch config
        │   └── animalService.ts
        ├── types/               # TypeScript interfaces mirroring backend models
        │   └── Animal.ts
        ├── App.tsx
        └── main.tsx
```

## Architecture (MVC)

| MVC Layer      | Backend                 | Frontend                    |
| -------------- | ----------------------- | --------------------------- |
| **Model**      | `models/` — ORM classes | `types/` — TS interfaces    |
| **View**       | `routes/` — REST API    | `pages/` + `components/`    |
| **Controller** | `controllers/` — logic  | `services/` — API calls     |

### Request Flow

```
User Action → React Page → Service → HTTP Request → Flask Route → Controller → Model → SQLite
```

## Where to Put Things

### `app/__init__.py`

Contains everything needed to start the app in one place:
- **Configuration** — DB URI (SQLite path), secret key, CORS settings
- **Extensions** — SQLAlchemy instance and any other plugin instances
- **App factory** — `create_app()` function that wires it all together
- **Blueprint registration** — connects route modules to the app

### Adding a new entity (e.g., Adoption)

1. **Backend model** — Create `backend/app/models/adoption.py` with the SQLAlchemy model
2. **Backend controller** — Create `backend/app/controllers/adoption_controller.py` with business logic
3. **Backend route** — Create `backend/app/routes/adoption_routes.py` with the API blueprint, register it in `app/__init__.py`
4. **Frontend type** — Create `frontend/src/types/Adoption.ts` matching the model
5. **Frontend service** — Create `frontend/src/services/adoptionService.ts` with API calls
6. **Frontend page** — Create `frontend/src/pages/Adoptions/AdoptionsPage.tsx` and add route in `App.tsx`

### Guidelines

- **Routes** handle only HTTP concerns: parse the request, call the controller, return a response with a status code
- **Controllers** hold business logic: validation, data transformation, orchestrating model calls
- **Models** define the database schema and relationships — no business logic here
- **Services** (frontend) are the only place that makes API calls — components never call `fetch` directly
- **Types** must stay in sync with backend models

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m app
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Flask, Flask-SQLAlchemy, Flask-CORS
- **Database**: SQLite
