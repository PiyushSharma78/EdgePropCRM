//Original;

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // from .env
console.log(BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  //withCredentials: true, // if you're using cookies
});

// Optional: Add token to every request (used later for now we are only using cookies)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    // config.headers["auth-token"] = token;
  }
  return config;
});

export default axiosInstance;
