import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Chat App</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with friends and colleagues in real-time
        </p>

        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <Link 
              to="/chat" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
            >
              Start Chatting
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow transition-all"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Real-time Chat</h3>
          <p className="text-gray-600">
            Experience seamless, real-time conversations with friends and colleagues.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Online Status</h3>
          <p className="text-gray-600">
            See when your contacts are online and ready to chat.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Secure Messaging</h3>
          <p className="text-gray-600">
            Your conversations are secure and private with our authentication system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;