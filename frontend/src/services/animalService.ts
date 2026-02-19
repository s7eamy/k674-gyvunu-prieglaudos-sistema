// Animal service — API calls for animal CRUD (getAll, getById, create, update, delete)
import axios from 'axios';
import type { Animal } from '../types/Animal';

const API_URL = "http://localhost:8081/api/animals";

export const getAll = async (): Promise<Animal[]> => {
    const response = await axios.get<{ animals: Animal[] }>(API_URL);
    return response.data.animals;
};