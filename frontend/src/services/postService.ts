// Post service — API calls for listing and creating posts
import axios from 'axios';

import api from './api';
import type { CreatePostRequest, Post } from '../types/Post';

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<{ posts: Post[] }>('/api/posts');
  return response.data.posts;
};

export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  try {
    const response = await api.post<Post>('/api/posts', data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('NOT_LOGGED_IN');
      }
      if (error.response?.status === 403) {
        throw new Error('USER_NOT_ADMIN');
      }
      if (error.response?.status === 400) {
        const serverError = error.response.data?.error;
        throw new Error(serverError || 'Validation error');
      }
    }
    throw error;
  }
};
