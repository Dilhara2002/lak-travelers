import axios from 'axios';

// Backend එකේ ලිපිනය (URL)
const API = axios.create({
  baseURL: 'https://lak-travelers-oqpg.vercel.app/api', 
  withCredentials: true, // Cookies වැඩ කරන්න මේක ඕනේ
});

export default API;