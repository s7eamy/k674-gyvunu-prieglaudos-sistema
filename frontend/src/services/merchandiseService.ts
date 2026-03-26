// Merchandise service — API calls for creating and managing merchandise orders
import api from './api';
import type { Merchandise, CreateMerchandiseRequest } from '../types/Merchandise';

export const createOrder = async (orderData: CreateMerchandiseRequest): Promise<Merchandise> => {
  const response = await api.post<{ order: Merchandise }>('/api/merchandise', orderData);
  return response.data.order;
};

export const getUserOrders = async (): Promise<Merchandise[]> => {
  const response = await api.get<{ orders: Merchandise[] }>('/api/merchandise/user');
  return response.data.orders;
};

export const getOrder = async (orderId: number): Promise<Merchandise> => {
  const response = await api.get<{ order: Merchandise }>(`/api/merchandise/${orderId}`);
  return response.data.order;
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<Merchandise> => {
  const response = await api.patch<{ order: Merchandise }>(`/api/merchandise/${orderId}/status`, {
    status
  });
  return response.data.order;
};

export const deleteOrder = async (orderId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/api/merchandise/${orderId}`);
  return response.data;
};

// Available merchandise options
export const AVAILABLE_COLORS = ['black', 'white'];
export const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const AVAILABLE_DESIGNS = [
  {
    id: 'shelter-love',
    name: 'Shelter Love',
    description: 'Cute cat design',
    image: '/images/merch/cat.png'
  },
  {
    id: 'rescue-me',
    name: 'Rescue Me',
    description: 'Cute puppy design',
    image: '/images/merch/dog.png'
  },
  {
    id: 'mix',
    name: 'Mix Animals',
    description: 'Mix of cute rescue animals',
    image: '/images/merch/mix.png'
  },
  {
    id: 'plain',
    name: 'Plain T-Shirt',
    description: 'Simple shirt with no design',
    image: '/images/merch/black_shirt.png'
  }
];
export const MERCHANDISE_PRICE = 19.99;  // Price in euros
