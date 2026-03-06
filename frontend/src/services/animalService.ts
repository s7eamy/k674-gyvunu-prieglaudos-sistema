// Animal service — API calls for animal CRUD (getAll, getById, create, update, delete)
import api from "./api";
import type { Animal } from "../types/Animal";

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