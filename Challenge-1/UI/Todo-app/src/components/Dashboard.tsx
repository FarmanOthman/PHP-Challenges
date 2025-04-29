import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build a Todo App', completed: false },
    { id: 3, text: 'Deploy to production', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const newItem: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    
    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleLogout = () => {
    // Here you would clear any authentication tokens/state
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col sm:py-12">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Todo Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mt-8">
          <form onSubmit={handleAddTodo} className="flex">
            <input
              type="text"
              placeholder="Add a new todo"
              className="flex-1 border-gray-300 border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </div>

        <div className="mt-6">
          <ul className="bg-white shadow overflow-hidden rounded-md divide-y divide-gray-200">
            {todos.map(todo => (
              <li key={todo.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <span 
                      className={`ml-3 ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;