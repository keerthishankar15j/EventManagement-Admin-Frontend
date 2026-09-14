import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getLoginHistory = async () => {
  const response = await axios.get(`${API_URL}/admin/login-history/history`);
  return response.data;
};

export const getUserLoginHistory = async (userId) => {
  const response = await axios.get(`${API_URL}/admin/login-history/history/${userId}`);
  return response.data;
};