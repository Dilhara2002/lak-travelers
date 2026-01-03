import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Tour from '../models/Tour.js';
import Vehicle from '../models/Vehicle.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

// Temporary store for OTP (Consider Redis for production)
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

  // ✅ Nodemailer Transporter එක යාවත්කාලීන කරන ලදී (Timeout ගැටලුව සඳහා)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // 587 වෙනුවට 465 වඩාත් ස්ථාවරයි
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password එක භාවිතා කරන්න
    },
    // Timeout වැළැක්වීමට අමතර සැකසුම්
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 600000 }; // 10 min expiry

  const mailOptions = {
    from: `"Lak Travelers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verification Code - Lak Travelers',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a73e8;">Lak Travelers Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #f1f3f4; padding: 10px; display: inline-block; letter-spacing: 5px; color: #333;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    res.status(500);
    throw new Error('Failed to send email. Check your email credentials.');
  }
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
 * @route   POST /api/users/auth
 * @access  Public
 */
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

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
  user.isApproved = false; // Requires re-approval if details changed
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
    res.json({ message: 'Vendor request rejected and account removed' });
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
    user.email = req.body.email || user.email;
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