import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getLoginHistory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/login-history/history`
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET LOGIN HISTORY ERROR:",
      error
    );

    throw error;
  }
};

export const getUserLoginHistory = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/login-history/history/${userId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET USER LOGIN HISTORY ERROR:",
      error
    );

    throw error;
  }
};