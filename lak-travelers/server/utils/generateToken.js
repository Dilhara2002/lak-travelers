import jwt from 'jsonwebtoken';

/**
 * @desc    JWT ටෝකනය සාදා එය HTTP-Only Cookie එකක් ලෙස යැවීම
 * @param   {Object} res - Express response object
 * @param   {String} userId - පරිශීලකයාගේ MongoDB ID එක
 */
const generateToken = (res, userId) => {
  // 1. ටෝකනය නිර්මාණය කිරීම
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // 2. Cookie එකක් ලෙස Client (Browser) වෙත යැවීම
  res.cookie('jwt', token, {
    httpOnly: true,    // XSS ප්‍රහාර වලින් ආරක්ෂා වීමට JavaScript access වළක්වයි
    
    // ✅ NODE_ENV එක production (Vercel) නම් පමණක් secure: true වේ. 
    // Localhost වලදී (development) false වීමෙන් Cookie එක වැඩ කිරීම සහතික කරයි.
    secure: process.env.NODE_ENV !== 'development', 
    
    // ✅ Cross-site cookies සඳහා Vercel වලදී 'none' අවශ්‍යයි. 
    // නමුත් localhost එකේදී 'lax' තිබීම වඩාත් ස්ථාවරයි.
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    
    maxAge: 30 * 24 * 60 * 60 * 1000, // දින 30 ක කාලයක්
    path: '/',
  });
};

export default generateToken;