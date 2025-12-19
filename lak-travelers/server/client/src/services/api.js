import axios from 'axios';

/**
 * Axios Instance
 * Backend API සමඟ communicate කරන්න
 */
const API = axios.create({
  // ✅ Backend URL (env වලින් ගන්න එක best practice)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',

  // ✅ Cookies (JWT) send / receive කරන්න අනිවාර්යයි
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * 🔐 Response Interceptor
 * 401 Unauthorized ආවොත් auto handle කරගන්න
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expire උනොත් local data clear කරනවා
      localStorage.removeItem('userInfo');

      // Optional: redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
