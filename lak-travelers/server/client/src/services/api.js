import axios from 'axios';

/**
 * 🚀 API URL එක ස්වයංක්‍රීයව තීරණය කිරීම
 * Vercel එකේදී (Production) අදාළ Vercel URL එකත්, 
 * ඔබේ පරිගණකයේදී (Development) localhost URL එකත් ස්වයංක්‍රීයව තෝරා ගනී.
 */
const getBaseURL = () => {
  // 1. මුලින්ම .env ගොනුවේ VITE_API_URL එකක් තිබේදැයි බලයි
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. එසේ නැතිනම් දැනට Browser එකේ ඇති URL එක අනුව තීරණය කරයි
  // ඔබ ඉන්නේ localhost එකේ නම් 5001 port එකට සම්බන්ධ වේ
  return window.location.hostname === "localhost" 
    ? "http://localhost:5001/api" 
    : "https://lak-travelers-api.vercel.app/api"; // ඔබේ ස්ථිර Vercel Backend URL එක
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Cookies (JWT) හුවමාරුවට අනිවාර්යයි
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor: Token එක Header එකට එක් කිරීම
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        // Backend එකේ ආරක්ෂාව සඳහා Authorization Header එක අනිවාර්යයෙන් එක් කරයි
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

// ✅ Response Interceptor: Error Handling සහ Auto-Logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚨 Browser Console එකේ පෙන්වන දෝෂය පිරිසිදු කරයි
    const message = error.response?.data?.message || error.message;
    console.error('API Error Response:', message);
    
    // 401 (Unauthorized) - Token එක අවලංගු වී ඇත්නම් Login එකට යොමු කරයි
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // 403 (Forbidden) - Vendor තවම අනුමත වී නැතිනම්
    if (error.response?.status === 403) {
      console.warn('Access Forbidden: User/Vendor not authorized');
    }
    
    // දෝෂ පණිවිඩය UI එකේ පෙන්වීමට හැකි වන සේ සකසයි
    error.message = message;
    return Promise.reject(error);
  }
);

export default API;