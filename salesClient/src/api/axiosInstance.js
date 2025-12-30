import axios from 'axios';

// Determine API base URL: prefer VITE env when provided, otherwise
// use localhost for development hosts and the production Render URL for remote hosts.
const PROD_API = 'https://server-canovacrm.onrender.com/api';
const ENV_URL = import.meta.env?.VITE_API_URL;

function getBaseUrl() {
  if (ENV_URL) return ENV_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '') return 'http://localhost:5000/api';
    return PROD_API;
  }
  return 'http://localhost:5000/api';
}

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
