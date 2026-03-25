// Admin service — API calls for admin exclusive CRUD
import api from './api';
import axios from 'axios';
import type { VolunteerRegistration } from '../types/VolunteerRegistration';
import type { User } from '../types/User';

export const getAll = async (): Promise<VolunteerRegistration[]> => {
  try {
    const response = await api.get<{ adminRegistrations: VolunteerRegistration[] }>("/api/admin", {});
    return response.data.adminRegistrations;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("NOT_LOGGED_IN");
      }
      else if (error.response?.status === 403) {
        throw new Error("USER_NOT_ADMIN");
      }
    }
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<{ adminUsers: User[] }>("/api/admin/users", {});
    return response.data.adminUsers;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("NOT_LOGGED_IN");
      }
      else if (error.response?.status === 403) {
        throw new Error("USER_NOT_ADMIN");
      }
    }
    throw error;
  }
};

export const approveRegistration = async (id:number):
Promise<VolunteerRegistration> => {
  try{
  const response = await api.post<VolunteerRegistration>(
    "/api/admin/approveRegistration",
    {id}
  );

  return response.data;
}
 catch (error) {
    console.error("Failed to approve registration:", error);
    throw error;
  }
}

export const markAttendanceRegistration = async (id:number, user_id: number):
Promise<VolunteerRegistration> => {
  try{
  const response = await api.post<VolunteerRegistration>(
    "/api/admin/markAttendance",
    {id, user_id}
  );

  return response.data;
}
 catch (error) {
    console.error("Failed to mark registration attendance:", error);
    throw error;
  }
}
export const addAnimal = async (data: {
  name: string;
  type: string;
  breed: string;
  size: string;
  age: number;
  vaccinated: number;
  temperament: string;
  description?: string;
}): Promise<Record<string, unknown>> => {
  try {
    const response = await api.post<Record<string, unknown>>("/api/animals", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("NOT_LOGGED_IN");
      } else if (error.response?.status === 403) {
        throw new Error("USER_NOT_ADMIN");
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || "Validation error");
      }
    }
    throw error;
  }
};