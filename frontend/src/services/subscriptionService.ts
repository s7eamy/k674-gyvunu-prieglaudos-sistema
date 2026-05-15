import api from './api';

export type SubscriptionRequest = {
  animal_type?: string | null;
  size?: string[] | null;
  temperament?: string[] | null;
  active?: boolean;
};

export type Subscription = {
  id: number;
  animal_type?: string | null;
  size?: string | null;
  temperament?: string | null;
  active?: boolean;
};

export const createOrUpdateSubscription = async (data: SubscriptionRequest) => {
  const response = await api.post('/api/subscriptions', data);
  return response.data;
};

export const getMySubscriptions = async () => {
  const response = await api.get('/api/subscriptions');
  return response.data;
};

export const deleteSubscription = async (id: number) => {
  const response = await api.delete(`/api/subscriptions/${id}`);
  return response.data;
};
