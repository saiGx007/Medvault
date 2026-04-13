import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout if it's a 401 and NOT a login request itself
    if (error.response && error.response.status === 401 && !error.config.url.includes('/login')) {
      console.warn("Unauthorized request - Logging out");
      localStorage.clear();
      // Use window.location.replace to prevent back-button loops
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;