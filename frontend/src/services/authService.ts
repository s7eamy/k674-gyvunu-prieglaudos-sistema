// Auth service - API calls for authentication
import axios, { AxiosError } from 'axios';
import type { User, RegisterRequest } from '../types/User';

const API_BASE_URL = 'http://localhost:8081/api/auth';

 // Register a new user
 // throws error with status and message on fail

export const register = async (data: RegisterRequest): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_BASE_URL}/register`, data);
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
