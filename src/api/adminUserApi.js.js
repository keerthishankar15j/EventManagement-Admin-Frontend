import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const syncUsers = async () => {
  const response = await axios.post(`${API_URL}/admin/sync-users`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/admin/users/${id}`);
  return response.data;
};