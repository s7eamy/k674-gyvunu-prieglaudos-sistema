import api from './api';
import type { DonorLevel } from '../types/DonorLevel';
import type { CreateDonationPaymentIntentRequest, DonationFinalizeResponse, DonationPaymentIntentResponse } from '../types/Donation';

export const getDonorLevel = async (): Promise<DonorLevel> => {
  const response = await api.get<{ donor_level: DonorLevel }>('/api/donations/level');
  return response.data.donor_level;
};

export const createDonationPaymentIntent = async (
  donationData: CreateDonationPaymentIntentRequest
): Promise<DonationPaymentIntentResponse> => {
  const response = await api.post<DonationPaymentIntentResponse>('/api/donations/payment-intents', donationData);
  return response.data;
};

export const finalizeDonationPayment = async (paymentIntentId: string): Promise<DonationFinalizeResponse> => {
  const response = await api.post<DonationFinalizeResponse>('/api/donations/finalize', { paymentIntentId });
  return response.data;
};
