import jwt from 'jsonwebtoken';

/**
 * @desc    JWT ටෝකනය සාදා එය HTTP-Only Cookie එකක් ලෙස යැවීම සහ ටෝකනය return කිරීම
 * @param   {Object} res - Express response object
 * @param   {String} userId - පරිශීලකයාගේ MongoDB ID එක
 */
const generateToken = (res, userId) => {
  // 1. ටෝකනය නිර්මාණය කිරීම (Payload එක ලෙස userId භාවිතා කරයි)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // 2. Cookie එකක් ලෙස Client (Browser) වෙත යැවීම
  res.cookie('jwt', token, {
    httpOnly: true,    
    secure: process.env.NODE_ENV !== 'development', 
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    path: '/',
  });

  // ✅ වැදගත්: Axios හරහා localStorage හි තබා ගැනීමට ටෝකනය return කළ යුතුය
  return token; 
};

export default generateToken;