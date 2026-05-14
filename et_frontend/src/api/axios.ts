import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/user/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token dead. Session expired.");
        
        //  FIX: Infinite loop se bachne ke liye page reload (window.location) kabhi mat karein.
        // Sirf catch block me error return karein, ise AuthContext handle karega.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

