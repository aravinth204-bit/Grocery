export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60';
  if (url.startsWith('http')) return url;
  
  const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};
