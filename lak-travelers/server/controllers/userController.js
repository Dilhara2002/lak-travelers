import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

// OTP තාවකාලිකව තබා ගැනීමට (Production වලදී Redis වැනි දෙයක් වඩා හොඳයි)
let otpStore = {}; 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/// @desc    Send OTP to Email
// @route   POST /api/users/send-otp
export const sendOTP = asyncHandler(async (req, res) => {
  const { email, isUpdate } = req.body; // isUpdate කියන එක frontend එකෙන් එවමු

  const userExists = await User.findOne({ email });

  // 🚨 Register වෙද්දී නම් (isUpdate නැති වෙලාවට) user ඉන්නවා නම් error එකක් දෙන්න
  if (!isUpdate && userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 600000 };

  const mailOptions = {
    from: `"Lak Travelers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verification Code - Lak Travelers',
    html: `<h3>Your OTP is: <b>${otp}</b></h3>`,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: 'OTP sent successfully!' });
});

// @desc    Verify OTP and Register user
// @route   POST /api/users/verify-register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, otp } = req.body;

  if (!otpStore[email] || otpStore[email].otp !== otp) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  if (Date.now() > otpStore[email].expires) {
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
    delete otpStore[email]; // සාර්ථක නම් OTP එක මකන්න
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

// --- ඉතිරි Controllers (authUser, logoutUser, Profile updates ආදිය) කලින් විදිහටම තියන්න ---
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  user ? res.json(user) : (res.status(404), (() => { throw new Error('User not found') })());
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// server/controllers/userController.js

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // ✅ පින්තූරය මෙතැනදී update වෙනවා
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // 🚀 ඉතාම වැදගත්: මෙන්න මෙතනට profileImage එක දාන්න
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage, // 👈 මේ පේළිය අනිවාර්යයි
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.vendorDetails = { ...user.vendorDetails, ...req.body };
  user.isApproved = false;
  user.role = 'vendor';
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

export const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor', isApproved: false }).select('-password');
  res.json(vendors || []);
});

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

export const getAdminStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments({ role: 'user' });
  const vendorsCount = await User.countDocuments({ role: 'vendor' });
  res.json({ usersCount, vendorsCount, bookingsCount: 0, hotelsCount: 0, toursCount: 0, vehiclesCount: 0, totalRevenue: 0 });
});