#!/usr/bin/env python3
"""
Database seeder - populates the database with mock animal data
Usage: python seed.py
"""

from app import create_app, db
from app.models.animal import Animal
from datetime import datetime

def seed_database():
    """Populate database with mock animal data"""
    app = create_app()
    
    with app.app_context():
        # Clear existing animals
        Animal.query.delete()
        db.session.commit()
        
        # Create mock animals
        animals = [
            Animal(
                name="Max",
                type="Dog",
                breed="Golden Retriever",
                size="large",
                age=3,
                vaccinated=1,
                temperament="friendly",
                description="Max is a loving and gentle Golden Retriever who adores children and other pets. He's well-trained and loves to play fetch.",
                adopted=0,
                created_at=datetime(2024, 1, 15)
            ),
            Animal(
                name="Whiskers",
                type="Cat",
                breed="Tabby",
                size="small",
                age=2,
                vaccinated=1,
                temperament="calm",
                description="Whiskers is a sweet and quiet tabby cat who enjoys lounging in sunny spots and gentle petting sessions.",
                adopted=0,
                created_at=datetime(2024, 2, 20)
            ),
            Animal(
                name="Buddy",
                type="Dog",
                breed="Beagle",
                size="medium",
                age=1,
                vaccinated=1,
                temperament="energetic",
                description="Buddy is a playful Beagle puppy with lots of energy! He loves going on adventures and making new friends.",
                adopted=0,
                created_at=datetime(2024, 3, 10)
            ),
            Animal(
                name="Fluffy",
                type="Cat",
                breed="Persian",
                size="medium",
                age=4,
                vaccinated=1,
                temperament="calm",
                description="Fluffy is a beautiful Persian cat with a luxurious coat. She's independent but loves attention on her own terms.",
                adopted=1,
                created_at=datetime(2023, 12, 5)
            ),
            Animal(
                name="Rex",
                type="Dog",
                breed="German Shepherd",
                size="large",
                age=5,
                vaccinated=1,
                temperament="friendly",
                description="Rex is a loyal and intelligent German Shepherd. He's great with families and has excellent obedience training.",
                adopted=0,
                created_at=datetime(2024, 1, 25)
            ),
            Animal(
                name="Luna",
                type="Cat",
                breed="Siamese",
                size="small",
                age=1,
                vaccinated=1,
                temperament="energetic",
                description="Luna is a stunning Siamese kitten with bright blue eyes. She's playful, vocal, and loves interactive toys.",
                adopted=0,
                created_at=datetime(2024, 2, 28)
            ),
            Animal(
                name="Shadow",
                type="Dog",
                breed="Labrador Retriever",
                size="large",
                age=6,
                vaccinated=1,
                temperament="calm",
                description="Shadow is a mature and mellow Black Lab. He's the perfect companion for relaxed walks and quiet evenings at home.",
                adopted=0,
                created_at=datetime(2023, 11, 10)
            ),
        ]
        
        # Add all animals to session
        for animal in animals:
            db.session.add(animal)
        
        # Commit to database
        db.session.commit()
        print(f"✓ Successfully seeded database with {len(animals)} animals!")

if __name__ == "__main__":
    seed_database()
