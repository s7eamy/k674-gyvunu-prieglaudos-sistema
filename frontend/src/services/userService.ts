import api from './api';
import type { User } from '../types/User';
import type { DonorLevel } from '../types/DonorLevel';
import type { VolunteerLevel } from '../types/VolunteerLevel';

export interface UserProfile {
  user: User;
  donor_level: DonorLevel;
  volunteer_level: VolunteerLevel;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

export const uploadAvatar = async (file: File): Promise<{ avatar_filename: string }> => {
  const form = new FormData();
  form.append('file', file);
  const response = await api.post('/api/auth/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteAvatar = async (): Promise<void> => {
  await api.delete('/api/auth/avatar');
};
