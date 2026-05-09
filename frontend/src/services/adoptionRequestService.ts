import api from './api';
import axios from 'axios';
import type { AdoptionRequest } from '../types/AdoptionRequest';

export const createAdoptionRequest = async (animalId: number): Promise<AdoptionRequest> => {
  try {
    const response = await api.post<AdoptionRequest>('/api/adoption-requests', { animal_id: animalId });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('NOT_LOGGED_IN');
      if (error.response?.data?.error) throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const getUserAdoptionRequests = async (): Promise<AdoptionRequest[]> => {
  try {
    const response = await api.get<{ adoptionRequests: AdoptionRequest[] }>('/api/adoption-requests');
    return response.data.adoptionRequests;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('NOT_LOGGED_IN');
    }
    throw error;
  }
};

export const getAdminAdoptionRequests = async (): Promise<AdoptionRequest[]> => {
  try {
    const response = await api.get<{ adoptionRequests: AdoptionRequest[] }>('/api/admin/adoption-requests');
    return response.data.adoptionRequests;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('NOT_LOGGED_IN');
      if (error.response?.status === 403) throw new Error('USER_NOT_ADMIN');
    }
    throw error;
  }
};

export const approveAdoptionRequest = async (id: number): Promise<AdoptionRequest> => {
  try {
    const response = await api.post<AdoptionRequest>('/api/admin/approveAdoption', { id });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('NOT_LOGGED_IN');
      if (error.response?.status === 403) throw new Error('USER_NOT_ADMIN');
      if (error.response?.data?.error) throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const rejectAdoptionRequest = async (id: number): Promise<AdoptionRequest> => {
  try {
    const response = await api.post<AdoptionRequest>('/api/admin/rejectAdoption', { id });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('NOT_LOGGED_IN');
      if (error.response?.status === 403) throw new Error('USER_NOT_ADMIN');
      if (error.response?.data?.error) throw new Error(error.response.data.error);
    }
    throw error;
  }
};
