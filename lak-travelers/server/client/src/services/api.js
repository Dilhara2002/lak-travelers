import axios from 'axios';

// Create axios instance
const API = axios.create({
  // Vercel deployment එකේදී env එකෙන් URL එක ගනී, නැතිනම් localhost පාවිච්චි කරයි
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true, // Cookies (JWT) හුවමාරුවට අනිවාර්යයි
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor: සෑම request එකකටම token එක එකතු කිරීමට
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        // Token එක cookies හරහා යන නිසා headers එකට අවශ්‍ය නැත
        // නමුත් අවශ්‍ය නම් authorization header එක භාවිතා කළ හැක
        if (parsedUserInfo.token) {
          config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
        }
      } catch (error) {
        console.error('Error parsing userInfo:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: ලොගින් එක expire වුණොත් handle කිරීමට
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('userInfo');
      // Optional: Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden - vendor not approved
      console.log('Vendor not approved yet');
    }
    
    // Better error message for user
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    
    return Promise.reject(error);
  }
);

export default API;