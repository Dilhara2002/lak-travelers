import axios from 'axios';

/**
 * Axios Instance එක නිර්මාණය කිරීම
 */
const API = axios.create({
  // ඔබගේ Vercel Backend URL එක
  baseURL: 'https://lak-travelers-oqpg.vercel.app/api', 
  
  // 👈 Cookies (JWT) Browser එක සහ Backend එක අතර හුවමාරු වීමට මෙය අත්‍යවශ්‍යයි
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

/**
 * 🛠️ Interceptor එකක් එක් කිරීම (විකල්ප නමුත් වැදගත්)
 * මෙය මගින් කිසියම් හේතුවකින් 401 (Unauthorized) error එකක් ආවොත් 
 * ස්වයංක්‍රීයව Logout කිරීමට හෝ දෝෂය හඳුනා ගැනීමට උදව් වේ.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session එක ඉකුත් වී ඇත්නම් Local Data පිරිසිදු කරයි
      localStorage.removeItem('userInfo');
      // අවශ්‍ය නම් මෙතැනදී navigate('/login') කළ හැක
    }
    return Promise.reject(error);
  }
);

export default API;