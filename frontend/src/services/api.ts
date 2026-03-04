// API base config — configure Axios or fetch with base URL and default headers
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
});

export default api;
