import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types';
import { TasksAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique categories from tasks
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching tasks...');
        const response = await TasksAPI.getAll();
        
        // Check if the response has the expected structure
        if (response && response.data && response.data.tasks) {
          console.log('Tasks fetched successfully:', response.data.tasks);
          
          const tasks = response.data.tasks;
          const uniqueCategories = Array.from(
            new Set(
              tasks
                .map((task: { category?: string | null }) => task.category)
                .filter((category: string | null | undefined): category is string => !!category)
            )
          ) as string[]; // Add explicit type assertion here
          setCategories(uniqueCategories);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Failed to load tasks. Unexpected response format.');
        }
      } catch (err: unknown) {
        console.error('Error fetching categories:', err);
        
        // Don't trigger logout or navigation here - just show an error message
        setError('Failed to load tasks. Please try again.');
        
        // If it's a 401 error, let the auth context handle it
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          console.log('Authentication error detected in Dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a user (we're authenticated)
    if (user) {
      fetchCategories();
    }
  }, [refreshTrigger, user]);

  const handleFilterChange = (newFilter: 'all' | 'pending' | 'in_progress' | 'completed') => {
    setFilter(newFilter);
  };

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormComplete = () => {
    setShowForm(false);
    setEditingTask(undefined);
    // Trigger a refresh of the task list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleLogout = async () => {
    // Use the logout function from auth context
    await logout();
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Todo Dashboard</h1>
              {user && (
                <span className="ml-4 text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddTask}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Task
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : showForm ? (
          <TaskForm
            task={editingTask}
            onComplete={handleFormComplete}
            onCancel={handleFormCancel}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <TaskFilters
              activeFilter={filter}
              activeCategory={activeCategory}
              categories={categories}
              onFilterChange={handleFilterChange}
              onCategoryChange={handleCategoryChange}
            />
            <TaskList
              filter={filter}
              category={activeCategory}
              onEditTask={handleEditTask}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;