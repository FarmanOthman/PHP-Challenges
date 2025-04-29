import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { TasksAPI } from '../services/api';

interface TaskListProps {
  filter: 'all' | 'pending' | 'completed';
  category: string | null;
  onEditTask: (task: Task) => void;
  refreshTrigger: number;
}

const TaskList: React.FC<TaskListProps> = ({ filter, category, onEditTask, refreshTrigger }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (category) {
          response = await TasksAPI.getByCategory(category);
        } else if (filter !== 'all') {
          response = await TasksAPI.getByStatus(filter);
        } else {
          response = await TasksAPI.getAll();
        }
        
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [filter, category, refreshTrigger]);

  const handleStatusToggle = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await TasksAPI.updateStatus(task.id, newStatus);
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await TasksAPI.delete(id);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };
  
  // Filter tasks client-side if needed (useful when we've already fetched by category)
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {filter !== 'all' 
            ? `You don't have any ${filter} tasks${category ? ` in ${category}` : ''}.` 
            : category 
              ? `You don't have any tasks in ${category}.`
              : "You don't have any tasks yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {filteredTasks.map((task) => (
          <li key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={task.status === 'completed'}
                    onChange={() => handleStatusToggle(task)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Mark "${task.title}" as ${task.status === 'completed' ? 'pending' : 'completed'}`}
                  />
                  <label htmlFor={`task-${task.id}`} className="sr-only">
                    Mark "{task.title}" as {task.status === 'completed' ? 'pending' : 'completed'}
                  </label>
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {task.description}
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    {task.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {task.category}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    {task.due_date && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <svg className="mr-1.5 h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Due {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-2">
                <button
                  onClick={() => onEditTask(task)}
                  className="bg-white rounded-full p-1 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label={`Edit task: ${task.title}`}
                  title={`Edit task: ${task.title}`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-white rounded-full p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label={`Delete task: ${task.title}`}
                  title={`Delete task: ${task.title}`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;