import axios from 'axios';
import { Task } from '../types';

// Configure axios with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Change this to your Laravel API base URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors, but don't automatically redirect
    if (error.response && error.response.status === 401) {
      console.log('Authentication error detected, but letting components handle redirect');
    }
    return Promise.reject(error);
  }
);

// Tasks API
export const TasksAPI = {
  // Get all tasks
  getAll: () => api.get('/tasks'),
  
  // Get tasks by status
  getByStatus: (status: 'pending' | 'in_progress' | 'completed') => 
    api.get(`/tasks?status=${status}`),
  
  // Get tasks by category
  getByCategory: (category: string) => 
    api.get(`/tasks?category=${category}`),
  
  // Get a single task
  getById: (id: number) => api.get(`/tasks/${id}`),
  
  // Create a new task
  create: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => 
    api.post('/tasks', task),
  
  // Update a task
  update: (id: number, task: Partial<Task>) => 
    api.put(`/tasks/${id}`, task),
  
  // Delete a task
  delete: (id: number) => api.delete(`/tasks/${id}`),
  
  // Update task status
  updateStatus: (id: number, status: 'pending' | 'in_progress' | 'completed') => 
    api.put(`/tasks/${id}`, { status })
};

// Auth API
export const AuthAPI = {
  // Login
  login: (email: string, password: string) => 
    api.post('/login', { email, password }),
  
  // Register
  register: (name: string, email: string, password: string, password_confirmation: string) => 
    api.post('/register', { name, email, password, password_confirmation }),
  
  // Logout
  logout: () => api.post('/logout'),
  
  // Get user profile
  getProfile: () => api.get('/user')
};

export default api;