import jwt from 'jsonwebtoken';

/**
 * @desc    JWT ටෝකනය සාදා එය HTTP-Only Cookie එකක් ලෙස යැවීම සහ ටෝකනය return කිරීම
 * @param   {Object} res - Express response object
 * @param   {String} userId - පරිශීලකයාගේ MongoDB ID එක
 * @param   {String} role - පරිශීලක role (optional, අඩුපාඩු නම් default ලෙස 'user')
 */
const generateToken = (res, userId, role = 'user') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  // 1. ටෝකනය නිර්මාණය කිරීම (Payload එක ලෙස userId සහ role)
  const tokenPayload = { 
    userId, 
    role 
  };
  
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'lak-travelers-api',
    audience: 'lak-travelers-client'
  });

  // 2. Cookie එකක් ලෙස Client (Browser) වෙත යැවීම
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Vercel + Render.com deployment සඳහා සුදුසු cookie settings
  const cookieOptions = {
    httpOnly: true,    
    secure: isProduction, // Production එකේදී true, development එකේදී false
    sameSite: isProduction ? 'none' : 'lax', // Cross-site cookies සඳහා 'none' required
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
    // Domain setting - Render.com backend සහ Vercel frontend සඳහා
    domain: isProduction ? '.onrender.com' : undefined, // Adjust based on your domain
  };

  // Development mode එකේදී localhost තුළ වැඩ කිරීමට
  if (isDevelopment) {
    cookieOptions.secure = false;
    cookieOptions.sameSite = 'lax';
  }

  // Cookie set කිරීම
  res.cookie('jwt', token, cookieOptions);

  // 3. Additional cookie for client-side access (අවශ්‍ය නම්)
  // Frontend එකට token එක access කිරීමට අවශ්‍ය නම්
  res.cookie('auth_token', token, {
    httpOnly: false, // Client-side access සඳහා
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  // ✅ ටෝකනය return කිරීම (axios/fetch requests සඳහා)
  return token; 
};

/**
 * @desc    JWT ටෝකනය verify කිරීම
 * @param   {String} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    
    // Specific error types
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    
    throw error;
  }
};

/**
 * @desc    Clear authentication cookies
 * @param   {Object} res - Express response object
 */
export const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    expires: new Date(0),
  };

  // Clear both cookies
  res.cookie('jwt', '', cookieOptions);
  res.cookie('auth_token', '', {
    ...cookieOptions,
    httpOnly: false,
  });
};

export default generateToken;