import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    අලුත් පරිශීලකයෙකු ලියාපදිංචි කිරීම
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, language } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    language: language || 'en',
    isApproved: role === 'vendor' ? false : true, // Vendor කෙනෙක් නම් Admin අනුමැතිය ලැබෙන තෙක් false වේ
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    පරිශීලකයා Login කරවීම (Authentication)
 * @route   POST /api/users/auth
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // ටෝකන් එක සාදා Cookie එකක් ලෙස යැවීම
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    පරිශීලකයා Logout කරවීම
 * @route   POST /api/users/logout
 * @access  Public
 */
const logoutUser = asyncHandler(async (req, res) => {
  // ✅ Logout වීමේදී Cookie එක සම්පූර්ණයෙන්ම ඉවත් කිරීමට නිවැරදි සැකසුම් (Security settings) ලබා දිය යුතුය
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,       // Vercel/HTTPS සඳහා අනිවාර්යයි
    sameSite: 'none',   // Cross-domain සඳහා අනිවාර්යයි
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

export { registerUser, authUser, logoutUser };