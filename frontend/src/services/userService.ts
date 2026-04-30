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
