import axios from "axios";
const API = axios.create({
  // Hardcode your live Vercel backend URL directly
  baseURL: "https://mern-rbac-assignment-2tkg.vercel.app/api",
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
