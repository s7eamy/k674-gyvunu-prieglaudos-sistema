// VolunteerRegistration service — API calls for volunteer registration CRUD
import api from './api';
import axios from 'axios';
import type { VolunteerRegistration } from '../types/VolunteerRegistration';
import type { VolunteerLevel } from '../types/VolunteerLevel';

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
    throw error;
  }
};

export const getLevel = async (): Promise<VolunteerLevel> => {
  try {
    const response = await api.get<{ volunteerLevel: VolunteerLevel }>("/api/volunteer/level", {});
    return response.data.volunteerLevel;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("NOT_LOGGED_IN");
      }
    }
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