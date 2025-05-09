import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set axios default header with token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Load user data if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('/api/user');
                if (res.data.status) {
                    setUser(res.data.user);
                } else {
                    throw new Error('Failed to load user data');
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to load user', error);
                setToken(null);
                setUser(null);
                setError('Authentication failed. Please log in again.');
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Register new user
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await axios.post('/api/register', userData);
            if (res.data.status) {
                setToken(res.data.token);
                setUser(res.data.user);
                return res.data;
            } else {
                throw new Error(res.data.message || 'Registration failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data?.errors || error.message || 'Registration failed';
            setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await axios.post('/api/login', credentials);
            if (res.data.status) {
                setToken(res.data.token);
                setUser(res.data.user);
                return res.data;
            } else {
                throw new Error(res.data.message || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = async () => {
        setLoading(true);
        
        try {
            if (token) {
                await axios.post('/api/logout');
            }
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            setToken(null);
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            register,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
