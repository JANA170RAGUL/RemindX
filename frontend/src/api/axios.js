import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (Expired or invalid token)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Dispatch custom event to trigger logout in the UI securely without direct store import loop
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const message = error.response?.data?.message || 'An unexpected error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export default apiClient;
