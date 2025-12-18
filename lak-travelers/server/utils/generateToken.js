import jwt from 'jsonwebtoken';

/**
 * @desc    JWT ටෝකනය සාදා එය HTTP-Only Cookie එකක් ලෙස සේවාදායකයා වෙත යැවීම
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
    httpOnly: true,    // JavaScript මගින් Cookie එක කියවීම වළක්වයි (ආරක්ෂාව සඳහා)
    
    // Vercel වලදී අනිවාර්යයෙන්ම 'true' විය යුතුය. Localhost වලදී ද 'true' තිබීම ගැටලුවක් නොවේ 
    // නමුත් ඔබේ Localhost එක HTTP නම් පමණක් මෙය ප්‍රශ්නයක් විය හැක.
    secure: true,      
    
    // Frontend (localhost:5173) සහ Backend (vercel.app) අතර Cookie හුවමාරුවට 'none' අනිවාර්යයයි
    sameSite: 'none',  
    
    maxAge: 30 * 24 * 60 * 60 * 1000, // දින 30 කින් කල් ඉකුත් වේ
    path: '/',
  });
};

export default generateToken;