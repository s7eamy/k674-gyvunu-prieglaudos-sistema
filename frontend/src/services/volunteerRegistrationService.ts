// VolunteerRegistration service — API calls for animal CRUD (getAll, getById, create, update, delete)
import api from './api';
import axios from 'axios';
import type { VolunteerRegistration } from '../types/VolunteerRegistration';


export const getAll = async (): Promise<VolunteerRegistration[]> => {
  try {
    const response = await api.get<{ volunteerRegistrations: VolunteerRegistration[] }>("/api/volunteer", {});
    return response.data.volunteerRegistrations;
  } catch (error: unknown) { 
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("NOT_LOGGED_IN");
      }
    }
    // Re-throw the original error if it's not a 401
    throw error;
  }
};

export const createRegistration = async (date:string, time_from:string, time_to:string):
Promise<VolunteerRegistration> => {
  
  const response = await api.post<VolunteerRegistration>(
    "/api/volunteer",
    {date, time_from, time_to}
  );

  return response.data;
}