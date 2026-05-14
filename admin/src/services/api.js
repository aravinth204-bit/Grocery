import axios from 'axios';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.endsWith('/api') ? url : `${url}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Upload API
export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin API
export const getDashboardStats = () => API.get('/admin/stats');
export const getCustomers = () => API.get('/admin/customers');

// Products API
export const getProducts = () => API.get('/products');
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders API
export const getOrders = () => API.get('/orders');
export const getAnalytics = () => API.get('/orders/analytics');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// Settings API
export const getSettings = () => API.get('/settings');
export const updateSettings = (settings) => API.put('/settings', settings);

// Notifications API
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');

// Messages API
export const getMessages = () => API.get('/messages');
export const updateMessageStatus = (id, status) => API.put(`/messages/${id}`, { status });
export const deleteMessage = (id) => API.delete(`/messages/${id}`);

export default API;
