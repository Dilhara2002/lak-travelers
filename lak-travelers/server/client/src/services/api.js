import axios from 'axios';

/**
 * 🚀 API URL එක ස්වයංක්‍රීයව තීරණය කිරීම
 */
const getBaseURL = () => {
  // .env ගොනුවේ VITE_API_URL එකක් ඇත්නම් එය ප්‍රමුඛතාවය ගනී
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // ඔබ ඉන්නේ localhost එකේ නම් 5001 port එකට සම්බන්ධ වේ
  // නැතිනම් ඔබේ ස්ථිර Vercel Backend URL එකට සම්බන්ධ වේ
  return window.location.hostname === "localhost" 
    ? "http://localhost:5001/api" 
    : "https://lak-travelers-api.vercel.app/api"; 
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo.token) {
          config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
        }
      } catch (error) {
        console.error('Error parsing userInfo:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error Response:', message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    error.message = message;
    return Promise.reject(error);
  }
);

export default API;