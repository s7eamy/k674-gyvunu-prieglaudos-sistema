// Animal service — API calls for animal CRUD (getAll, getById, create, update, delete)
import axios from 'axios';
import type { Animal } from '../types/Animal';
import { getImageForAnimal } from '../data/animals';

const API_URL = "http://localhost:8081/api/animals";

export const getAll = async (): Promise<Animal[]> => {
    try {
        const response = await axios.get<{ animals: Animal[] }>(API_URL);
        const animals = response.data.animals || [];
        
        // If backend returns empty, use mock data
        if (animals.length === 0) {
            const { mockAnimals } = await import('../data/animals');
            return mockAnimals;
        }
        
        // Add mock images to animals from backend that don't have images
        return animals.map((animal, index) => ({
            ...animal,
            imageUrl: getImageForAnimal(animal, index)
        }));
    } catch (error) {
        console.error('Error fetching animals from backend:', error);
        throw error;
    }
};

export const getById = async (id: number): Promise<Animal> => {
    try {
        const response = await axios.get<Animal>(`${API_URL}/${id}`);
        const animal = response.data;
        
        // Add mock image if the animal doesn't have one
        return {
            ...animal,
            imageUrl: animal.imageUrl || getImageForAnimal(animal, id)
        };
    } catch (error) {
        console.error(`Error fetching animal ${id}:`, error);
        throw error;
    }
};

export const create = async (animal: Omit<Animal, 'id' | 'created_at'>): Promise<Animal> => {
    try {
        const response = await axios.post<Animal>(API_URL, animal);
        return response.data;
    } catch (error) {
        console.error('Error creating animal:', error);
        throw error;
    }
};

export const update = async (id: number, animal: Partial<Animal>): Promise<Animal> => {
    try {
        const response = await axios.put<Animal>(`${API_URL}/${id}`, animal);
        return response.data;
    } catch (error) {
        console.error(`Error updating animal ${id}:`, error);
        throw error;
    }
};

export const delete_ = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting animal ${id}:`, error);
        throw error;
    }
};