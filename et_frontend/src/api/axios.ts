// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// // const api = axios.create({
// //   baseURL: import.meta.env.VITE_API_BASE_URL,
// //   withCredentials: true
// // });

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
//     //   originalRequest._retry = true;
//     //   try {
//     //     await axios.post(`${API_BASE_URL}/user/refresh`, {}, { withCredentials: true });
//     //     return api(originalRequest);
//     //   } catch (refreshError) {
//     //     console.error("Refresh token dead. Session expired.");
        
//     //     //  FIX: Infinite loop se bachne ke liye page reload (window.location) kabhi mat karein.
//     //     // Sirf catch block me error return karein, ise AuthContext handle karega.
//     if (
//   error.response?.status === 401 && 
//   originalRequest && 
//   !originalRequest._retry &&
//   !originalRequest.url.includes('/user/refresh') // 👈 Yeh line infinite loop rokegi
// ) {
//   originalRequest._retry = true;
//   try {
//     await axios.post(`${API_BASE_URL}/user/refresh`, {}, { withCredentials: true });
//     return api(originalRequest);
//   } catch (refreshError) {
//     console.error("Refresh token dead. Session expired.");
    
//     // AuthContext ko batane ke liye event dispatch karein taaki user log out ho jaye
//     if (typeof window !== "undefined") {
//       window.dispatchEvent(new Event("auth-session-expired"));
//     }
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// 🟢 axios.ts (Replace full file)
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 🟢 REQUEST INTERCEPTOR: Automatically inject token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 👈 Sets header for Render production
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      originalRequest && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/user/refresh')
    ) {
      originalRequest._retry = true;
      try {
        // 🟢 Pass refresh token in header or body if cookies fail on Render
        const localRefreshToken = localStorage.getItem("refreshToken");
        
        const res = await axios.post(
          `${API_BASE_URL}/user/refresh`, 
          { refreshToken: localRefreshToken }, // Optional body payload fallback
          { withCredentials: true, headers: { Authorization: `Bearer ${localRefreshToken}` } }
        );

        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token dead. Session expired.");
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isLoggedIn");

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-session-expired"));
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
