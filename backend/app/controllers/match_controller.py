# Match controller - business logic for finding best animal matches
from app.models.animal import Animal


def score_animal(animal, answers):
    """
    Calculate match score for an animal based on user answers.
    Returns -1.0 for hard mismatches, otherwise returns float score (0-100).
    """
    
    # --- ANIMAL TYPE (20pts) - HARD FILTER ---
    animal_type_answer = answers.get("animal_type", "either")
    if animal_type_answer in ("dog", "cat"):
        if animal.type != animal_type_answer:
            return -1.0
    animal_type_score = 20.0
    
    # --- LIVING SPACE (15pts) ---
    living_space = answers.get("living_space", "apartment")
    size = animal.size or ""
    
    living_space_multiplier = 0.0
    if living_space == "apartment":
        if size == "small":
            living_space_multiplier = 1.0
        elif size == "medium":
            living_space_multiplier = 0.5
        elif size == "large":
            living_space_multiplier = 0.0
    elif living_space == "house_no_yard":
        if size == "small":
            living_space_multiplier = 1.0
        elif size == "medium":
            living_space_multiplier = 0.8
        elif size == "large":
            living_space_multiplier = 0.5
    elif living_space == "house_yard":
        living_space_multiplier = 1.0
    
    living_space_score = 15.0 * living_space_multiplier
    
    # --- ACTIVITY LEVEL (15pts) ---
    activity_level = answers.get("activity_level", "moderate")
    temperament = animal.temperament or ""
    
    activity_level_multiplier = 0.0
    if activity_level == "low":
        if temperament == "calm":
            activity_level_multiplier = 1.0
        elif temperament == "friendly":
            activity_level_multiplier = 0.6
        elif temperament == "energetic":
            activity_level_multiplier = 0.1
    elif activity_level == "moderate":
        if temperament == "calm":
            activity_level_multiplier = 0.7
        elif temperament == "friendly":
            activity_level_multiplier = 1.0
        elif temperament == "energetic":
            activity_level_multiplier = 0.7
    elif activity_level == "high":
        if temperament == "calm":
            activity_level_multiplier = 0.2
        elif temperament == "friendly":
            activity_level_multiplier = 0.7
        elif temperament == "energetic":
            activity_level_multiplier = 1.0
    
    activity_level_score = 15.0 * activity_level_multiplier
    
    # --- EXPERIENCE (10pts) ---
    experience = answers.get("experience", "some_experience")
    
    experience_multiplier = 1.0
    if animal.type == "dog":
        if experience == "first_time":
            experience_multiplier = 0.5
        elif experience == "some_experience":
            experience_multiplier = 0.8
        elif experience == "experienced":
            experience_multiplier = 1.0
    
    experience_score = 10.0 * experience_multiplier
    
    # --- TIME AT HOME (10pts) ---
    time_at_home = answers.get("time_at_home", "sometimes")
    
    time_at_home_multiplier = 0.0
    if time_at_home == "rarely":
        if temperament == "calm":
            time_at_home_multiplier = 0.8
        elif temperament == "friendly":
            time_at_home_multiplier = 0.4
        elif temperament == "energetic":
            time_at_home_multiplier = 0.2
    elif time_at_home == "sometimes":
        if temperament == "calm":
            time_at_home_multiplier = 0.9
        elif temperament == "friendly":
            time_at_home_multiplier = 0.8
        elif temperament == "energetic":
            time_at_home_multiplier = 0.6
    elif time_at_home == "often":
        time_at_home_multiplier = 1.0
    
    time_at_home_score = 10.0 * time_at_home_multiplier
    
    # --- CHILDREN (10pts) ---
    children = answers.get("children", "no")
    
    children_multiplier = 1.0
    if children == "yes_young":
        if temperament == "calm":
            children_multiplier = 1.0
        elif temperament == "friendly":
            children_multiplier = 1.0
        elif temperament == "energetic":
            children_multiplier = 0.4
    elif children == "yes_older":
        if temperament == "calm":
            children_multiplier = 0.8
        elif temperament == "friendly":
            children_multiplier = 1.0
        elif temperament == "energetic":
            children_multiplier = 0.8
    elif children == "no":
        children_multiplier = 1.0
    
    children_score = 10.0 * children_multiplier
    
    # --- OTHER PETS (5pts) ---
    other_pets = answers.get("other_pets", "no")
    
    other_pets_multiplier = 1.0
    if other_pets == "yes":
        if temperament == "calm":
            other_pets_multiplier = 1.0
        elif temperament == "friendly":
            other_pets_multiplier = 1.0
        elif temperament == "energetic":
            other_pets_multiplier = 0.6
    elif other_pets == "no":
        other_pets_multiplier = 1.0
    
    other_pets_score = 5.0 * other_pets_multiplier
    
    # --- PREFERRED SIZE (10pts) - SOFT preference ---
    preferred_size = answers.get("preferred_size", "no_preference")
    
    preferred_size_multiplier = 1.0
    if preferred_size != "no_preference":
        if size == preferred_size:
            preferred_size_multiplier = 1.0
        else:
            preferred_size_multiplier = 0.2
    
    preferred_size_score = 10.0 * preferred_size_multiplier
    
    # --- PREFERRED AGE (5pts) - SOFT preference ---
    preferred_age = answers.get("preferred_age", "no_preference")
    
    # Age buckets: young = age <= 2, adult = 3–7, senior = age >= 8
    age_bucket = ""
    if animal.age is not None:
        if animal.age <= 2:
            age_bucket = "young"
        elif animal.age <= 7:
            age_bucket = "adult"
        else:
            age_bucket = "senior"
    
    preferred_age_multiplier = 1.0
    if preferred_age != "no_preference":
        if age_bucket == preferred_age:
            preferred_age_multiplier = 1.0
        else:
            preferred_age_multiplier = 0.2
    
    preferred_age_score = 5.0 * preferred_age_multiplier
    
    # --- ENERGY MATCH (10pts) ---
    energy_match = answers.get("energy_match", "moderate")
    
    energy_match_multiplier = 0.0
    if energy_match == "calm":
        if temperament == "calm":
            energy_match_multiplier = 1.0
        elif temperament == "friendly":
            energy_match_multiplier = 0.7
        elif temperament == "energetic":
            energy_match_multiplier = 0.1
    elif energy_match == "moderate":
        if temperament == "calm":
            energy_match_multiplier = 0.7
        elif temperament == "friendly":
            energy_match_multiplier = 1.0
        elif temperament == "energetic":
            energy_match_multiplier = 0.7
    elif energy_match == "energetic":
        if temperament == "calm":
            energy_match_multiplier = 0.2
        elif temperament == "friendly":
            energy_match_multiplier = 0.7
        elif temperament == "energetic":
            energy_match_multiplier = 1.0
    
    energy_match_score = 10.0 * energy_match_multiplier
    
    # --- TOTAL SCORE ---
    total_score = (
        animal_type_score +
        living_space_score +
        activity_level_score +
        experience_score +
        time_at_home_score +
        children_score +
        other_pets_score +
        preferred_size_score +
        preferred_age_score +
        energy_match_score
    )
    
    return total_score


def get_matches(answers):
    """
    Find best animal matches based on user answers.
    Returns list of top 3 matched animals as dicts with match_score added.
    """
    # Query all non-adopted animals
    animals = Animal.query.filter_by(adopted=0).all()
    
    # Score each animal once and collect results
    scored_animals = []
    for animal in animals:
        score = score_animal(animal, answers)
        if score != -1.0:  # Exclude hard mismatches
            animal_dict = animal.to_dict()
            animal_dict['match_score'] = score
            scored_animals.append(animal_dict)
    
    # Sort by score descending and return top 3
    scored_animals.sort(key=lambda x: x['match_score'], reverse=True)
    return scored_animals[:3]
