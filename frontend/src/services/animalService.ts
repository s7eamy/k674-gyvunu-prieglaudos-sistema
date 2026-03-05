// Animal service — API calls for animal CRUD (getAll, getById, create, update, delete)
import api from "./api";
import type { Animal } from "../types/Animal";

export type AnimalFilters = {
  size?: string;
  temperament?: string;
  type?: string;
  age?: number;
  vaccinated?: 0 | 1;
  adopted?: 0 | 1;
};

export const getAll = async (filters?: AnimalFilters): Promise<Animal[]> => {
  const response = await api.get<{ animals: Animal[] }>("/api/animals", {
    params: filters,
  });
  return response.data.animals;
};