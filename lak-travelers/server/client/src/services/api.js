import axios from 'axios';

// Backend එකේ ලිපිනය (URL)
const API = axios.create({
  baseURL: 'http://localhost:5001/api', 
  withCredentials: true, // Cookies වැඩ කරන්න මේක ඕනේ
});

export default API;