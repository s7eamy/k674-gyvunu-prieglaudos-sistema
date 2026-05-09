// Animal service — API calls for animal CRUD (getAll, getById, create, update, delete)
import api from './api';
import axios from 'axios';
import type { Animal } from '../types/Animal';

export type AnimalFilters = {
  size?: string;
  temperament?: string;
  type?: string;
  vaccinated?: 0 | 1;
  adopted?: 0 | 1;
  ageMin?: number;
  ageMax?: number;
};

export const getAll = async (filters?: AnimalFilters): Promise<Animal[]> => {
  const response = await api.get<{ animals: Animal[] }>("/api/animals", {
    params: filters,
  });
  return response.data.animals;
};

export const getFavoriteAnimals = async (filters?: AnimalFilters): Promise<Animal[]> => {
  const response = await api.get<{ favorite_animals: Animal[] }>("/api/animals/favorites", {
    params: filters,
  });
  return response.data.favorite_animals;
};

export const addFavoriteAnimal = async (animalId: number) :
 Promise<Record<string, unknown>> => {
  try {
    const response = await api.post("/api/animals/favorites/add", {
      animal_id: animalId,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("NOT_LOGGED_IN");
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || "Validation error");
      }
    }
    throw error;
  }
};

export const removeFavoriteAnimal = async (animalId: number) :
 Promise<Record<string, unknown>> => {
  try {
    const response = await api.post("/api/animals/favorites/remove", {
      animal_id: animalId,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("NOT_LOGGED_IN");
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || "Validation error");
      }
    }
    throw error;
  }
};