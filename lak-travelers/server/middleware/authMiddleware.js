import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * @desc    සාමාන්‍යයෙන් ලොග් වූ පරිශීලකයින් හඳුනාගැනීම (Protect Route)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. මුලින්ම Cookies වල 'jwt' තියෙනවාද බලන්න (Safe access using optional chaining)
  token = req.cookies?.jwt;

  // 2. Cookies වල නැත්නම් Authorization Header එක බලන්න (Bearer Token)
  // මෙය Axios මගින් localStorage එකේ ඇති token එක එවන විට ප්‍රයෝජනවත් වේ.
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // ටෝකන් එක Verify කිරීම
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // පරිශීලකයා සොයා req.user වෙත ඇතුළත් කිරීම
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); 
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token found');
  }
});

/**
 * @desc    Admin පරිශීලකයින් පමණක් හඳුනාගැනීම
 */
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin');
  }
});

/**
 * @desc    අනුමත වූ (Approved) Vendor කෙනෙක් දැයි පරීක්ෂා කිරීම
 */
const vendor = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) {
    if (req.user.role === 'vendor' && !req.user.isApproved) {
      res.status(403);
      throw new Error('Vendor account not approved by admin yet');
    }
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a vendor');
  }
});

export { protect, admin, vendor };