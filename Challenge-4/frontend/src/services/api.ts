import axios from 'axios';

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust this URL based on your Laravel backend
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('auth_token');
      // You could dispatch a logout action here if using Redux
    }
    return Promise.reject(error);
  }
);

export default api;