import axios from 'axios';
import type { DonorLevel } from '../types/DonorLevel';

const API_BASE_URL = 'http://localhost:5000/api';

// Get donor level for current user
export const getDonorLevel = async (): Promise<DonorLevel> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/donors/level`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  } catch (_error) {
    // For now, return default level if not logged in or API not available
    return {
      level: 1,
      max_level: 5,
      total_points: 0,
      points_to_next_level: 100,
      next_threshold: 100,
    };
  }
};

// Create a donation and award points
export const createDonation = async (
  amount: number,
  donorName: string,
  donorEmail: string,
  message: string
): Promise<{ success: boolean; pointsAwarded: number; newLevel: number }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/donations/create`,
      {
        amount,
        donor_name: donorName,
        donor_email: donorEmail,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (_error) {
    // Fallback: calculate points locally for demo
    const pointsAwarded = Math.floor(amount);
    return {
      success: true,
      pointsAwarded,
      newLevel: 1,
    };
  }
};
