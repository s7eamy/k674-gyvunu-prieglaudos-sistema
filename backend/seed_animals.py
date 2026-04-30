from datetime import datetime

from app import create_app
from app.models import db
from app.models.animal import Animal, AnimalImage
from app.models.user import User
from app.models.volunteer_registration import Volunteer_Registration
from werkzeug.security import generate_password_hash


ADMIN_SEED_USER = {
    "name": "admin",
    "email": "admin@shelter.local",
    "password": "admin1234",
}

REGULAR_SEED_USER = {
    "name": "user",
    "email": "user@shelter.local",
    "password": "user1234",
}

# donation_points >= 100 → donor level 2  (DONOR_LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000])
REGULAR_USER_DONATION_POINTS = 100

IMAGE_BASE_PATH = "frontend/public/images/animals"
IMAGE_BASE_URL = "/images/animals"

_ANIMAL_MODEL_FIELDS = {"name", "type", "breed", "size", "age", "vaccinated", "temperament", "description", "adopted"}

# 3 cats, 4 dogs, 1 rabbit — 7 of 8 have images (87.5% ≈ 80%)
SEED_ANIMALS = [
    # --- Cats (3) ---
    {
        "name": "Luna",
        "type": "cat",
        "breed": "Domestic Shorthair",
        "size": "small",
        "age": 2,
        "vaccinated": 1,
        "temperament": "friendly",
        "description": "Curious and affectionate, loves window naps and gentle playtime.",
        "adopted": 0,
        "image_filename": "luna.jpg",
        "image_alt": "Luna the Domestic Shorthair cat",
    },
    {
        "name": "Oliver",
        "type": "cat",
        "breed": "British Shorthair",
        "size": "medium",
        "age": 6,
        "vaccinated": 1,
        "temperament": "calm",
        "description": "Independent but sweet, enjoys quiet evenings by the fireplace.",
        "adopted": 0,
        "image_filename": "oliver.jpg",
        "image_alt": "Oliver the British Shorthair cat",
    },
    {
        "name": "Nala",
        "type": "cat",
        "breed": "Siamese",
        "size": "small",
        "age": 1,
        "vaccinated": 1,
        "temperament": "energetic",
        "description": "Playful chatterbox who loves interactive toys.",
        "adopted": 0,
        "image_filename": None,
        "image_alt": None,
    },
    # --- Dogs (4) ---
    {
        "name": "Buddy",
        "type": "dog",
        "breed": "Labrador Retriever",
        "size": "large",
        "age": 3,
        "vaccinated": 1,
        "temperament": "friendly",
        "description": "Happy-go-lucky family dog who loves fetch.",
        "adopted": 0,
        "image_filename": "buddy.jpg",
        "image_alt": "Buddy the Labrador Retriever",
    },
    {
        "name": "Max",
        "type": "dog",
        "breed": "German Shepherd",
        "size": "large",
        "age": 4,
        "vaccinated": 1,
        "temperament": "energetic",
        "description": "Smart and active, thrives with training and regular play.",
        "adopted": 0,
        "image_filename": "max.jpg",
        "image_alt": "Max the German Shepherd",
    },
    {
        "name": "Daisy",
        "type": "dog",
        "breed": "Beagle",
        "size": "medium",
        "age": 2,
        "vaccinated": 1,
        "temperament": "friendly",
        "description": "Nose-led explorer with a cheerful and sociable personality.",
        "adopted": 0,
        "image_filename": "daisy.jpg",
        "image_alt": "Daisy the Beagle",
    },
    {
        "name": "Rocky",
        "type": "dog",
        "breed": "Boxer",
        "size": "large",
        "age": 5,
        "vaccinated": 0,
        "temperament": "energetic",
        "description": "Goofy and athletic, loves outdoor adventures.",
        "adopted": 0,
        "image_filename": "rocky.jpg",
        "image_alt": "Rocky the Boxer",
    },
    # --- Other (1) ---
    {
        "name": "Peanut",
        "type": "rabbit",
        "breed": "Holland Lop",
        "size": "small",
        "age": 1,
        "vaccinated": 1,
        "temperament": "calm",
        "description": "Floppy-eared and gentle, enjoys leafy greens and quiet company.",
        "adopted": 0,
        "image_filename": "peanut.jpg",
        "image_alt": "Peanut the Holland Lop rabbit",
    },
]


def seed_animals():
    existing_animals = {
        (a.name, a.type, a.breed): a
        for a in Animal.query.all()
    }

    inserted = 0
    updated = 0

    for entry in SEED_ANIMALS:
        image_filename = entry.get("image_filename")
        image_alt = entry.get("image_alt")
        animal_data = {k: v for k, v in entry.items() if k in _ANIMAL_MODEL_FIELDS}
        animal_key = (animal_data["name"], animal_data["type"], animal_data["breed"])

        if animal_key in existing_animals:
            animal = existing_animals[animal_key]
            for key, value in animal_data.items():
                setattr(animal, key, value)
            updated += 1
        else:
            animal = Animal(**animal_data)
            db.session.add(animal)
            db.session.flush()
            inserted += 1

        # Sync image: replace existing seeded image with the one in SEED_ANIMALS
        for img in list(animal.images):
            db.session.delete(img)
        db.session.flush()
        if image_filename:
            db.session.add(AnimalImage(
                animal_id=animal.id,
                url=f"{IMAGE_BASE_URL}/{image_filename}",
                alt_text=image_alt,
            ))

    db.session.commit()

    total_count = Animal.query.count()
    print(f"Animals: inserted {inserted}, updated {updated}. Total in DB: {total_count}.")

    animals_with_images = [(e["name"], e["type"], e["breed"], e["image_filename"]) for e in SEED_ANIMALS if e["image_filename"]]
    animals_without_images = [(e["name"], e["type"]) for e in SEED_ANIMALS if not e["image_filename"]]

    print(f"\nAnimal images should be placed in: {IMAGE_BASE_PATH}/")
    for name, atype, breed, fname in animals_with_images:
        print(f"  {fname:<20} — {name} ({atype}, {breed})")
    if animals_without_images:
        print("  No image:")
        for name, atype in animals_without_images:
            print(f"    {name} ({atype})")


def seed_admin_user():
    user = User.query.filter_by(name=ADMIN_SEED_USER["name"]).first()
    if not user:
        user = User.query.filter_by(email=ADMIN_SEED_USER["email"]).first()

    if user:
        if user.role != "admin":
            user.role = "admin"
            db.session.commit()
            print(f"Promoted existing user '{user.name}' to admin.")
        else:
            print(f"Admin user '{user.name}' already exists.")
    else:
        user = User(
            name=ADMIN_SEED_USER["name"],
            email=ADMIN_SEED_USER["email"],
            password_hash=generate_password_hash(ADMIN_SEED_USER["password"]),
            role="admin",
        )
        db.session.add(user)
        db.session.commit()
        print(f"Created admin user '{user.name}' ({user.email}).")

    print("\nAdmin credentials:")
    print(f"  Email:    {ADMIN_SEED_USER['email']}")
    print(f"  Password: {ADMIN_SEED_USER['password']}")


def seed_regular_user():
    user = User.query.filter_by(name=REGULAR_SEED_USER["name"]).first()
    if not user:
        user = User.query.filter_by(email=REGULAR_SEED_USER["email"]).first()

    if not user:
        user = User(
            name=REGULAR_SEED_USER["name"],
            email=REGULAR_SEED_USER["email"],
            password_hash=generate_password_hash(REGULAR_SEED_USER["password"]),
            role="user",
            donation_points=REGULAR_USER_DONATION_POINTS,
        )
        db.session.add(user)
        db.session.commit()
        print(f"Created regular user '{user.name}' ({user.email}).")
    else:
        print(f"Regular user '{user.name}' already exists.")
        if user.donation_points < REGULAR_USER_DONATION_POINTS:
            user.donation_points = REGULAR_USER_DONATION_POINTS
            db.session.commit()
            print(f"  Updated donation_points to {REGULAR_USER_DONATION_POINTS}.")

    # Ensure at least 1 attended volunteer registration → volunteer level 1
    # (LEVEL_THRESHOLDS = [0, 1, 3, 7, 15, 31]; level 1 requires completed_count >= 1)
    attended_count = Volunteer_Registration.query.filter_by(user_id=user.id, attended=1).count()
    if attended_count == 0:
        reg = Volunteer_Registration(
            user_id=user.id,
            date=datetime(2026, 4, 1, 9, 0),
            time_from="09:00",
            time_to="17:00",
            approved=1,
            attended=1,
        )
        db.session.add(reg)
        db.session.commit()
        print("  Added 1 attended volunteer registration → volunteer level 1.")

    print("\nRegular user credentials:")
    print(f"  Email:    {REGULAR_SEED_USER['email']}")
    print(f"  Password: {REGULAR_SEED_USER['password']}")
    print(f"  Donor level:     2  (donation_points={user.donation_points})")
    print("  Volunteer level: 1  (1 attended registration)")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        print("=== Seeding animals ===")
        seed_animals()
        print("\n=== Seeding admin user ===")
        seed_admin_user()
        print("\n=== Seeding regular user ===")
        seed_regular_user()
