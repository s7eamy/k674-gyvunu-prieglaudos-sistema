from app import create_app
from app.models import db
from app.models.animal import Animal


SEED_ANIMALS = [
    {
        "name": "Luna",
        "type": "cat",
        "breed": "Domestic Shorthair",
        "size": "small",
        "age": 2,
        "vaccinated": 1,
        "temperament": "friendly",
        "description": "Curious and affectionate, loves window naps.",
        "adopted": 0,
    },
    {
        "name": "Milo",
        "type": "cat",
        "breed": "Maine Coon",
        "size": "large",
        "age": 4,
        "vaccinated": 1,
        "temperament": "calm",
        "description": "Gentle giant with a fluffy coat and soft purr.",
        "adopted": 0,
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
    },
    {
        "name": "Oliver",
        "type": "cat",
        "breed": "British Shorthair",
        "size": "medium",
        "age": 6,
        "vaccinated": 1,
        "temperament": "calm",
        "description": "Independent but sweet, enjoys quiet evenings.",
        "adopted": 0,
    },
    {
        "name": "Cleo",
        "type": "cat",
        "breed": "Tabby",
        "size": "medium",
        "age": 3,
        "vaccinated": 0,
        "temperament": "friendly",
        "description": "Social and curious, always first to greet visitors.",
        "adopted": 0,
    },
    {
        "name": "Bella",
        "type": "cat",
        "breed": "Persian",
        "size": "small",
        "age": 8,
        "vaccinated": 1,
        "temperament": "calm",
        "description": "Relaxed lap cat who enjoys gentle grooming.",
        "adopted": 0,
    },
    {
        "name": "Charlie",
        "type": "cat",
        "breed": "Domestic Longhair",
        "size": "medium",
        "age": 5,
        "vaccinated": 1,
        "temperament": "friendly",
        "description": "Loyal companion with a soft spot for treats.",
        "adopted": 0,
    },
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
    },
    {
        "name": "Max",
        "type": "dog",
        "breed": "German Shepherd",
        "size": "large",
        "age": 4,
        "vaccinated": 1,
        "temperament": "energetic",
        "description": "Smart and active, thrives with training and play.",
        "adopted": 0,
    },
    {
        "name": "Daisy",
        "type": "dog",
        "breed": "Beagle",
        "size": "medium",
        "age": 2,
        "vaccinated": 1,
        "temperament": "friendly",
        "description": "Nose-led explorer with a cheerful personality.",
        "adopted": 0,
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
    },
    {
        "name": "Coco",
        "type": "dog",
        "breed": "Poodle",
        "size": "medium",
        "age": 7,
        "vaccinated": 1,
        "temperament": "calm",
        "description": "Elegant and intelligent, enjoys calm routines.",
        "adopted": 0,
    },
    {
        "name": "Leo",
        "type": "dog",
        "breed": "Shih Tzu",
        "size": "small",
        "age": 6,
        "vaccinated": 1,
        "temperament": "friendly",
        "description": "Small companion dog who adores human attention.",
        "adopted": 0,
    },
    {
        "name": "Maya",
        "type": "dog",
        "breed": "Border Collie",
        "size": "medium",
        "age": 1,
        "vaccinated": 1,
        "temperament": "energetic",
        "description": "Very bright and playful, perfect for active homes.",
        "adopted": 0,
    },
    {
        "name": "Teddy",
        "type": "dog",
        "breed": "Cavalier King Charles Spaniel",
        "size": "small",
        "age": 9,
        "vaccinated": 1,
        "temperament": "calm",
        "description": "Sweet senior who enjoys cuddles and short walks.",
        "adopted": 0,
    },
]


def seed_animals():
    existing_keys = {
        (animal.name, animal.type, animal.breed)
        for animal in Animal.query.all()
    }

    inserted = 0
    for animal_data in SEED_ANIMALS:
        animal_key = (animal_data["name"], animal_data["type"], animal_data["breed"])
        if animal_key in existing_keys:
            continue

        db.session.add(Animal(**animal_data))
        inserted += 1

    db.session.commit()

    total_count = Animal.query.count()
    print(f"Seeding complete. Inserted {inserted} animals. Total animals in DB: {total_count}.")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_animals()
