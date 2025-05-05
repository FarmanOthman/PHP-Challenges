import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white font-bold text-xl">Chat App</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/chat" className="text-white hover:text-gray-300">Chat</Link>
              </li>
              <li className="flex items-center">
                <span className="text-gray-300 mr-2">{user?.name}</span>
                <button 
                  onClick={logout} 
                  className="text-white hover:text-gray-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/about" className="text-white hover:text-gray-300">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;