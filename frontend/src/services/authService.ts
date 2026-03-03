// Auth service - API calls for authentication
import { AxiosError } from 'axios';
import api from './api';
import type { User, RegisterRequest } from '../types/User';

 // Register a new user
 // throws error with status and message on fail

export const register = async (data: RegisterRequest): Promise<User> => {
  try {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error: string }>;
    if (axiosError.response) {
      // backend returned error response
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.error || 'Registration failed'
      };
    }
    // network or other error
    throw {
      status: 500,
      message: 'Network error. Please try again.'
    };
  }
};
