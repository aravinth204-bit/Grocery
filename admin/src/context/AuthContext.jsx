import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminData = localStorage.getItem('adminInfo');
    if (adminData) {
      setAdminInfo(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      // Uses the same login endpoint from backend
      const { data } = await API.post('/auth/login', { email, password }, config);
      
      if (data.user && data.user.role === 'admin') {
        setAdminInfo(data.user);
        localStorage.setItem('adminInfo', JSON.stringify(data.user));
        localStorage.setItem('adminToken', data.token); // Store token separately for API service
        return { success: true };
      } else {
        return { success: false, message: 'Not authorized as an admin' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response && error.response.data.error 
          ? error.response.data.error 
          : error.message 
      };
    }
  };

  const logoutAdmin = () => {
    setAdminInfo(null);
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ adminInfo, loginAdmin, logoutAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
