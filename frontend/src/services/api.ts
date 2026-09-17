import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://merald-group.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('merald_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
