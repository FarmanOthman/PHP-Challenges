import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types';
import { TasksAPI } from '../services/api';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Extract unique categories from tasks
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await TasksAPI.getAll();
        const tasks = response.data;
        const uniqueCategories = Array.from(
          new Set(
            tasks
              .map(task => task.category)
              .filter((category): category is string => !!category)
          )
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, [refreshTrigger]);

  const handleFilterChange = (newFilter: 'all' | 'pending' | 'completed') => {
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

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Todo Dashboard</h1>
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
        {showForm ? (
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