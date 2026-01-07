import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    
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
    isApproved: role === 'vendor' ? false : true, // If you are a vendor, it will be false until Admin approval is received.
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
 * @desc     Login (Authentication)
 * @route   POST /api/users/auth
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Create the token and send it as a cookie
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
 * @desc     Logout 
 * @route   POST /api/users/logout
 * @access  Public
 */
const logoutUser = asyncHandler(async (req, res) => {
  //  You must provide the correct security settings to completely remove the cookie when logging out.
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,       // Vercel/HTTPS 
    sameSite: 'none',   // Cross-domain 
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

export { registerUser, authUser, logoutUser };