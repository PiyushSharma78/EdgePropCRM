// src/features/auth/authAPI.js
import axiosInstance from "../../api/axios";

export const registerUserAPI = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUserAPI = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};
export const logoutUserAPI = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const checkAuthAPI = async () => {
  const response = await axiosInstance.get("/auth/check-auth");
  return response.data;
};
