import axios from "axios";

const API = axios.create({
  // Dynamically uses your online Vercel backend URL, or falls back to localhost for local testing
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Automatically inject JWT token into request headers if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
