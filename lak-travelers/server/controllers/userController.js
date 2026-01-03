import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Tour from '../models/Tour.js';
import Vehicle from '../models/Vehicle.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

// OTP තාවකාලිකව ගබඩා කිරීමට (Consider Redis for production)
let otpStore = {};

/**
 * @desc    Send OTP to Email
 * @route   POST /api/users/send-otp
 * @access  Public
 */
export const sendOTP = asyncHandler(async (req, res) => {
  const { email, isUpdate } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const userExists = await User.findOne({ email: email.trim().toLowerCase() });

  if (!isUpdate && userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Port 587 සඳහා මෙය සැමවිටම false විය යුතුය
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // App Password එකේ හිස්තැන් ඇත්නම් ඉවත් කරයි
    },
    // Timeout ගැටලුව මඟහරවා ගැනීමට කාලය වැඩි කිරීම
    connectionTimeout: 20000, 
    socketTimeout: 30000,
    greetingTimeout: 20000,
    tls: {
      rejectUnauthorized: false // Cloud සර්වර් වලදී මෙය අත්‍යවශ්‍ය වේ
    }
  });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email.toLowerCase()] = { otp, expires: Date.now() + 600000 }; 

  const mailOptions = {
    from: `"Lak Travelers" <${process.env.EMAIL_USER}>`,
    to: email.toLowerCase(),
    subject: 'Verification Code - Lak Travelers',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
        <h2 style="color: #1a73e8; text-align: center;">Lak Travelers Verification</h2>
        <p style="text-align: center;">Your verification code is:</p>
        <div style="background: #f1f3f4; padding: 15px; text-align: center; border-radius: 8px;">
          <h1 style="margin: 0; letter-spacing: 8px; color: #333; font-size: 32px;">${otp}</h1>
        </div>
        <p style="text-align: center; color: #777; font-size: 12px; margin-top: 20px;">This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  // ✅ Try-Catch භාවිතයෙන් සර්වර් එක Crash වීම වැළැක්වීම
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error("🚨 Nodemailer Critical Error:", error.message);
    res.status(500);
    throw new Error('Email server connection timeout. Please try again in a moment.');
  }
});

/**
 * @desc    Verify OTP and register user
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, otp } = req.body;

  const emailKey = email.toLowerCase();
  const otpData = otpStore[emailKey];

  if (!otpData || otpData.otp !== otp) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  if (Date.now() > otpData.expires) {
    delete otpStore[emailKey];
    res.status(400);
    throw new Error('OTP expired');
  }

  const user = await User.create({
    name: name.trim(),
    email: emailKey,
    password,
    role: role || 'user',
    isApproved: role === 'vendor' ? false : true,
  });

  if (user) {
    delete otpStore[emailKey];
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate user & get token
 */
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Logout user
 */
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get user profile
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
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = (req.body.email || user.email).toLowerCase();
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
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update Vendor Profile
 */
export const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  user.vendorDetails = { ...user.vendorDetails, ...req.body };
  user.isApproved = false; 
  user.role = 'vendor';

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

/**
 * @desc    Admin: Get all pending vendors
 */
export const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor', isApproved: false }).select('-password');
  res.json(vendors);
});

/**
 * @desc    Admin: Approve vendor
 */
export const approveVendor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isApproved = true;
    await user.save();
    res.json({ message: 'Vendor approved successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Admin: Reject vendor
 */
export const rejectVendor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user && user.role === 'vendor') {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor request rejected' });
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

/**
 * @desc    Admin: Create User
 */
export const adminCreateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isApproved } = req.body;
  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
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
 * @desc    Admin: Update User
 */
export const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = (req.body.email || user.email).toLowerCase();
    user.role = req.body.role || user.role;
    user.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : user.isApproved;
    if (req.body.vendorDetails) user.vendorDetails = { ...user.vendorDetails, ...req.body.vendorDetails };
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Admin: Delete User
 */
export const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') { res.status(400); throw new Error('Cannot delete admin'); }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Admin: Get all users
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

/**
 * @desc    Admin: Get dashboard statistics
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