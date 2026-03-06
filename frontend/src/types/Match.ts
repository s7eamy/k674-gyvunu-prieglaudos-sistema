// Match types — TypeScript interfaces for questionnaire and match results
import type { Animal } from './Animal';

export interface QuestionnaireAnswers {
    animal_type: 'dog' | 'cat' | 'either';
    living_space: 'apartment' | 'house_no_yard' | 'house_yard';
    activity_level: 'low' | 'moderate' | 'high';
    experience: 'first_time' | 'some_experience' | 'experienced';
    time_at_home: 'rarely' | 'sometimes' | 'often';
    children: 'yes_young' | 'yes_older' | 'no';
    other_pets: 'yes' | 'no';
    preferred_size: 'small' | 'medium' | 'large' | 'no_preference';
    preferred_age: 'young' | 'adult' | 'senior' | 'no_preference';
    energy_match: 'calm' | 'moderate' | 'energetic';
}

export interface AnimalMatch extends Animal {
    match_score: number;
}
