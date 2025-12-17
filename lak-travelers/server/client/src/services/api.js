import axios from 'axios';

// Backend එකේ ලිපිනය (URL)
const API = axios.create({
  baseURL: 'https://lak-travelers-oqpg.vercel.app/api', 
  withCredentials: true, // 👈 Cookies (JWT) Backend එකට යැවීමට මෙය අනිවාර්යයි
});

export default API;