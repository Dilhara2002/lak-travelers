import axios from 'axios';

/**
 * 🚀 API URL එක ස්වයංක්‍රීයව තීරණය කිරීම
 */
const getBaseURL = () => {
  // 1. .env ගොනුවේ VITE_API_URL එකක් ඇත්නම් එය භාවිතා කරයි
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  
  // 2. ඔබ localhost හි වැඩ කරන්නේ නම් 5001 ට සම්බන්ධ වේ
  if (window.location.hostname === "localhost") {
    return "http://localhost:5001/api";
  }

  // 3. ඔබගේ නිවැරදි Render Backend URL එක (Vercel නොව Render විය යුතුය)
  return "https://lak-travelers-api.onrender.com/api"; 
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor: Token එක Header එකට එකතු කිරීම
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

// ✅ Response Interceptor: Error හසුරුවා ගැනීම
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error Response:', message);
    
    // 401 Unauthorized නම් Logout කර Login පිටුවට යැවීම
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