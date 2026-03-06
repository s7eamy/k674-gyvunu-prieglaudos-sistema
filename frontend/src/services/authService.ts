// Auth service - API calls for authentication
import { AxiosError } from 'axios';
import api from './api';
import type { User, RegisterRequest, LoginRequest, AuthResponse } from '../types/User';

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


// Login user and get JWT token
// throws error with status and message on fail

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.error || 'Login failed'
      };
    }
    throw {
      status: 500,
      message: 'Network error. Please try again.'
    };
  }
};


// Logout current user and revoke JWT token
// throws error with status and message on fail

export const logout = async (): Promise<{ message: string }> => {
  const token = localStorage.getItem('access_token');

  try {
    const response = await api.post<{ message: string }>(
      '/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.error || 'Logout failed'
      };
    }
    throw {
      status: 500,
      message: 'Network error. Please try again.'
    };
  }
};
