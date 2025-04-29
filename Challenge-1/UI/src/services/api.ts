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

// Tasks API
export const TasksAPI = {
  // Get all tasks
  getAll: () => api.get<Task[]>('/tasks'),
  
  // Get tasks by status
  getByStatus: (status: 'pending' | 'completed') => 
    api.get<Task[]>(`/tasks?status=${status}`),
  
  // Get tasks by category
  getByCategory: (category: string) => 
    api.get<Task[]>(`/tasks?category=${category}`),
  
  // Get a single task
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  
  // Create a new task
  create: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Task>('/tasks', task),
  
  // Update a task
  update: (id: number, task: Partial<Task>) => 
    api.put<Task>(`/tasks/${id}`, task),
  
  // Delete a task
  delete: (id: number) => api.delete(`/tasks/${id}`),
  
  // Update task status
  updateStatus: (id: number, status: 'pending' | 'completed') => 
    api.patch<Task>(`/tasks/${id}/status`, { status })
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