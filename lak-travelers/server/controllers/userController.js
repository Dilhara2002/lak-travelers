import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/* ===============================
   Register new user
   POST /api/users
================================ */
const registerUser = asyncHandler(async (req, res) => {
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
  });

  if (user) {
    // 👇 Token එක සාදා Cookie එකක් ලෙස යැවීම
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

/* ===============================
   Login user
   POST /api/users/auth
================================ */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // 👇 Token එක සාදා Cookie එකක් ලෙස යැවීම
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

/* ===============================
   Logout user
   POST /api/users/logout
================================ */
const logoutUser = asyncHandler(async (req, res) => {
  // 👇 Cookie එක ඉවත් කිරීමේදීත් Security settings නිවැරදි විය යුතුයි
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,       // Production/Vercel සඳහා සැමවිටම true
    sameSite: 'none',   // Cross-site cookie ඉවත් කිරීමට අනිවාර්යයි
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

/* ===============================
   Get user profile
   GET /api/users/profile
================================ */
const getUserProfile = asyncHandler(async (req, res) => {
  // Middleware එක හරහා එන req.user._id භාවිතා කර පරිශීලකයා සෙවීම
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
    vendorDetails: user.vendorDetails,
  });
});

/* ===============================
   Update user profile
   PUT /api/users/profile
================================ */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  
  // Email එක වෙනස් කිරීමට අවශ්‍ය නම් පමණක් මෙය භාවිතා කරන්න
  if (req.body.email) {
      user.email = req.body.email;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    isApproved: updatedUser.isApproved,
  });
});

/* ===============================
   Update Vendor Profile
   PUT /api/users/vendor-profile
================================ */
const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== 'vendor') {
    res.status(403);
    throw new Error('Vendor access only');
  }

  user.vendorDetails = {
    ...user.vendorDetails,
    businessName: req.body.businessName || user.vendorDetails?.businessName,
    serviceType: req.body.serviceType || user.vendorDetails?.serviceType,
    registrationNumber: req.body.registrationNumber || user.vendorDetails?.registrationNumber,
    phone: req.body.phone || user.vendorDetails?.phone,
    address: req.body.address || user.vendorDetails?.address,
    description: req.body.description || user.vendorDetails?.description,

    specificDetails: {
      ...user.vendorDetails?.specificDetails,
      hotelStarRating: req.body.hotelStarRating || user.vendorDetails?.specificDetails?.hotelStarRating,
      vehicleFleetSize: req.body.vehicleFleetSize || user.vendorDetails?.specificDetails?.vehicleFleetSize,
      guideLanguages: req.body.guideLanguages || user.vendorDetails?.specificDetails?.guideLanguages,
      experienceYears: req.body.experienceYears || user.vendorDetails?.specificDetails?.experienceYears,
    },

    documents: {
      ...user.vendorDetails?.documents,
      profileImage: req.body.profileImage || user.vendorDetails?.documents?.profileImage,
      idFront: req.body.idFront || user.vendorDetails?.documents?.idFront,
      idBack: req.body.idBack || user.vendorDetails?.documents?.idBack,
    },
  };

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    isApproved: updatedUser.isApproved,
    vendorDetails: updatedUser.vendorDetails,
  });
});

/* ===============================
   Admin Functions
================================ */
const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor', isApproved: false }).select('-password');
  res.json(vendors);
});

const approveVendor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isApproved = true;
    const updatedUser = await user.save();
    res.json({ message: 'Vendor Approved Successfully', user: updatedUser });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateVendorProfile,
  getPendingVendors,
  approveVendor,
};