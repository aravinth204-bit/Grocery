import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('freshcart_token'));

  // Set the Authorization header for Axios
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('freshcart_token', token);
      
      // Fetch user data if token exists but user is not set
      if (!user) {
        getMe()
          .then(res => {
            setUser(res.data.data);
          })
          .catch(err => {
            console.error("Token invalid, logging out...");
            logout();
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      delete API.defaults.headers.common['Authorization'];
      localStorage.removeItem('freshcart_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (userData) => {
    try {
      const res = await loginUser(userData);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || "Login failed. Please check your credentials." 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerUser(userData);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || "Registration failed." 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
