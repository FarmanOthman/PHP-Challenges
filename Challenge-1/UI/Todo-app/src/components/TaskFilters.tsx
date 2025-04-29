import React from 'react';

interface TaskFiltersProps {
  activeFilter: 'all' | 'pending' | 'completed';
  activeCategory: string | null;
  categories: string[];
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  onCategoryChange: (category: string | null) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  activeCategory,
  categories,
  onFilterChange,
  onCategoryChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeFilter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;