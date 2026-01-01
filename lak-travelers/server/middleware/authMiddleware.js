import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * @desc    සාමාන්‍යයෙන් ලොග් වූ පරිශීලකයින් හඳුනාගැනීම (Protect Route)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. මුලින්ම Cookies වල 'jwt' තියෙනවාද බලන්න
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } 
  // 2. Cookies වල නැත්නම් Authorization Header එක බලන්න (Bearer Token)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // split(' ') මගින් 'Bearer' සහ 'token' වෙන් කර ගනී
    token = req.headers.authorization.split(' ')[1];
  }

  // ටෝකනයක් පවතිනවාද සහ එය "undefined" හෝ "null" string එකක් නොවේදැයි බලන්න
  if (token && token !== 'undefined' && token !== 'null') {
    try {
      // ටෝකන් එක Verify කිරීම
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // පරිශීලකයා සොයා req.user වෙත ඇතුළත් කිරීම (decoded.userId හෝ decoded.id පරීක්ෂා කරන්න)
      req.user = await User.findById(decoded.userId || decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); 
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      res.status(401);
      // 'jwt malformed' වැනි දෝෂ මෙහිදී හසුුවේ
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
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

/**
 * @desc    අනුමත වූ (Approved) Vendor කෙනෙක් දැයි පරීක්ෂා කිරීම
 */
const vendor = (req, res, next) => {
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
};

export { protect, admin, vendor };