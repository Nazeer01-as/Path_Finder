import axios from 'axios';

// Smart determination of API base URL for both localhost and production deployment
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // In local development, use envUrl if provided or default to local backend port 5000
    if (isLocal) {
      return envUrl || 'http://localhost:5000/api';
    }

    // In production / deployed environment (e.g. Vercel):
    // 1. If explicit production API URL is set and doesn't point to localhost, use it
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }

    // 2. Direct connection to Render backend as default
    return 'https://path-finder-0g4h.onrender.com/api';
  }

  return envUrl || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30s timeout to accommodate Render free-tier spin-up
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pathfinder_token');
    // Ensure token exists and is not the literal string "null" or "undefined"
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry or global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if this was a login attempt so we don't trigger unnecessary redirects or token clearance
      const isLoginRequest = error.config && error.config.url && error.config.url.includes('/auth/login');

      if (!isLoginRequest) {
        // If unauthorized during an authenticated session, clear token and redirect
        if (localStorage.getItem('pathfinder_token')) {
          localStorage.removeItem('pathfinder_token');
          localStorage.removeItem('pathfinder_user');
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

