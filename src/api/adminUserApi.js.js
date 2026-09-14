import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const syncUsers = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/sync-users`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Sync Error:",
      error.response?.data || error
    );

    throw error;
  }
};