import axios from "axios";

// Get the API URL from environment variables, or default to localhost:3000
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  withCredentials: true, // This is crucial for sending and receiving httpOnly cookies
});

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local state if 401 received
      localStorage.removeItem("DOCKY-mock-user");
    }
    return Promise.reject(error);
  },
);

