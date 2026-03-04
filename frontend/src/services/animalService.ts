// Animal service — API calls for animal CRUD (getAll, getById, create, update, delete)
import api from './api';
import type { Animal } from '../types/Animal';

export const getAll = async (): Promise<Animal[]> => {
    const response = await api.get<{ animals: Animal[] }>('/api/animals');
    return response.data.animals;
};