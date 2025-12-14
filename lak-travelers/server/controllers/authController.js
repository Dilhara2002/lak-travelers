import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, language } = req.body;

  // 1. User දැනටමත් ඉන්නවාද කියලා බලනවා
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // 2. අලුත් User කෙනෙක් හදනවා
  const user = await User.create({
    name,
    email,
    password,
    role,     // මෙය පසුව frontend එකෙන් එවන්න පුළුවන් (user/vendor)
    language
  });

  if (user) {
    // 3. සාර්ථක නම් Token එක හදලා යවනවා
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      language: user.language,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Email එකෙන් User ව හොයනවා
  const user = await User.findOne({ email });

  // 2. User ඉන්නවා නම් සහ Password එක හරි නම්
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  // Cookie එක clear කරනවා
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export { registerUser, authUser, logoutUser };