import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/users
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

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
    isApproved: role === 'vendor' ? false : true,
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

// @desc    Auth user & get token
// @route   POST /api/users/auth
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
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

// @desc    Logout user
// @route   POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'none',
  });
  res.status(200).json({ message: 'Logged out' });
});

// @desc    Update Vendor Profile
// @route   PUT /api/users/vendor-profile
export const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user && user.role === 'vendor') {
    user.vendorDetails = {
      ...user.vendorDetails,
      ...req.body // Frontend එකෙන් එවන සියලුම vendor details මෙහිදී update වේ
    };

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(403);
    throw new Error('Vendor profile not found or unauthorized');
  }
});

export { getUserProfile, updateUserProfile, getPendingVendors, approveVendor } from './authController.js'; // ඔබගේ අනෙකුත් functions මෙලෙස export කරන්න