import axios from 'axios';

// Get the API URL from environment variables, or default to localhost:3000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  withCredentials: true, // This is crucial for sending and receiving httpOnly cookies
});

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns a 401 (meaning JWT is missing/invalid/expired)
    if (error.response?.status === 401) {
      // Clear mock user state just in case
      localStorage.removeItem('docintel-mock-user');
      
      // We only want to redirect if we aren't already on the login, register, or home page
      // And we don't want to redirect if the failing request is /auth/me itself (as that just means not logged in)
      const isAuthMeRequest = error.config?.url?.includes('/auth/me');
      if (
        !isAuthMeRequest &&
        window.location.pathname !== '/' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
