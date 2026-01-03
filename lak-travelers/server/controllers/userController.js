import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Tour from '../models/Tour.js';
import Vehicle from '../models/Vehicle.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

// Temporary store for OTP (consider using Redis for production)
let otpStore = {};

/**
 * @desc    Send OTP to Email
 * @route   POST /api/users/send-otp
 * @access  Public
 */
export const sendOTP = asyncHandler(async (req, res) => {
  const { email, isUpdate } = req.body;

  const userExists = await User.findOne({ email });

  if (!isUpdate && userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Port 465 සඳහා true භාවිතා කරන්න
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // මෙතැනට අනිවාර්යයෙන්ම Gmail "App Password" එකක් තිබිය යුතුයි
  },
  tls: {
    rejectUnauthorized: false // බොහෝ විට Timeout ප්‍රශ්න විසඳීමට මෙය උදව් වේ
  }
});

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 600000 }; // 10 min expiry

  const mailOptions = {
    from: `"Lak Travelers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verification Code - Lak Travelers',
    html: `<h3>Your OTP is: <b>${otp}</b></h3>`,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: 'OTP sent successfully!' });
});

/**
 * @desc    Verify OTP and register user
 * @route   POST /api/users
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, otp } = req.body;

  const otpData = otpStore[email];

  if (!otpData || otpData.otp !== otp) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  if (Date.now() > otpData.expires) {
    delete otpStore[email];
    res.status(400);
    throw new Error('OTP expired');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isApproved: role === 'vendor' ? false : true,
  });

  if (user) {
    delete otpStore[email];
    // Set cookie and get token string
    const token = generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: token, // Returned for frontend localStorage
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/auth
 * @access  Public
 */
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Set cookie and get token string
    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: token, // Returned for frontend localStorage
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Public
 */
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.profileImage) user.profileImage = req.body.profileImage;
  if (req.body.password) user.password = req.body.password;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    profileImage: updatedUser.profileImage,
  });
});

/**
 * @desc    Apply to be a Vendor
 * @route   PUT /api/users/vendor-profile
 * @access  Private
 */
export const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { 
    res.status(404); 
    throw new Error('User not found'); 
  }

  user.vendorDetails = { ...user.vendorDetails, ...req.body };
  user.isApproved = false;
  user.role = 'vendor';

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

/**
 * @desc    Get all pending vendors
 * @route   GET /api/users/pending
 * @access  Private/Admin
 */
export const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor', isApproved: false })
    .select('-password');
  res.json(vendors);
});

/**
 * @desc    Approve a vendor
 * @route   PUT /api/users/approve/:id
 * @access  Private/Admin
 */
export const approveVendor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isApproved = true;
  await user.save();
  res.json({ message: 'Vendor approved successfully' });
});

/**
 * @desc    Reject and delete vendor request
 * @route   DELETE /api/users/reject/:id
 * @access  Private/Admin
 */
export const rejectVendor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && user.role === 'vendor') {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor request rejected and account removed' });
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

/**
 * @desc    Admin manually creates a User or Vendor
 * @route   POST /api/users/admin/create
 * @access  Private/Admin
 */
export const adminCreateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isApproved } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isApproved: isApproved !== undefined ? isApproved : true,
  });

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Admin updates any User or Vendor details
 * @route   PUT /api/users/admin/update/:id
 * @access  Private/Admin
 */
export const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : user.isApproved;

    if (req.body.vendorDetails) {
      user.vendorDetails = { ...user.vendorDetails, ...req.body.vendorDetails };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Admin deletes any User or Vendor
 * @route   DELETE /api/users/admin/:id
 * @access  Private/Admin
 */
export const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete an admin user');
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get all users for Admin
 * @route   GET /api/users/admin/all
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

/**
 * @desc    Get system-wide statistics for dashboard
 * @route   GET /api/users/admin-stats
 * @access  Private/Admin
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments({ role: 'user' });
  const vendorsCount = await User.countDocuments({ role: 'vendor' });
  const hotelsCount = await Hotel.countDocuments();
  const toursCount = await Tour.countDocuments();
  const vehiclesCount = await Vehicle.countDocuments();
  const bookingsCount = await Booking.countDocuments({ status: { $ne: 'cancelled' } });

  const confirmedBookings = await Booking.find({ status: 'confirmed' });
  const totalRevenue = confirmedBookings.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  res.json({
    usersCount,
    vendorsCount,
    bookingsCount,
    hotelsCount,
    toursCount,
    vehiclesCount,
    totalRevenue,
  });
});