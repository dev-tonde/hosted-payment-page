import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.sandbox.bvnk.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (!response.data) {
      return Promise.reject(new Error('No data received from API'));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      console.error('Network error or no response from server');
    } else {
      console.error('Unknown error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
