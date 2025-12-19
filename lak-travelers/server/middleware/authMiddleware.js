import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * @desc    සාමාන්‍යයෙන් ලොග් වූ පරිශීලකයින් හඳුනාගැනීම (Protect Route)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Cookie එකෙන් ටෝකන් එක ලබා ගැනීම
  // GenerateToken එකේදී භාවිතා කළ 'jwt' යන නමම මෙහිදී භාවිතා කළ යුතුය
  token = req.cookies.jwt; 

  if (token) {
    try {
      // 2. ටෝකන් එක Verify කිරීම
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. පරිශීලකයා සොයා req.user වෙත ඇතුළත් කිරීම (Password රහිතව)
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // සාර්ථක නම් ඊළඟ පියවරට (Controller එකට) යවයි
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    // ටෝකන් එක නොමැති විට 401 error එක ලබා දෙයි
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

/**
 * @desc    Admin පරිශීලකයින් පමණක් හඳුනාගැනීම
 */
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});

/**
 * @desc    අනුමත වූ (Approved) Vendor කෙනෙක් දැයි පරීක්ෂා කිරීම
 * @info    Vendor කෙනෙකුට වාහන/හෝටල් එකතු කිරීමට මෙය අත්‍යවශ්‍ය වේ.
 */
const vendor = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) {
    // Vendor කෙනෙක් නම් අනිවාර්යයෙන්ම අනුමත වී තිබිය යුතුය
    if (req.user.role === 'vendor' && !req.user.isApproved) {
      res.status(403);
      throw new Error('Vendor account not approved by admin yet');
    }
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a vendor');
  }
});

export { protect, admin, vendor };