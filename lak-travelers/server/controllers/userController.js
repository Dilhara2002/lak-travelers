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

  generateToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
  });
});

/* ===============================
   Login user
   POST /api/users/auth
================================ */
const authUser = asyncHandler(async (req, res) => {
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

/* ===============================
   Logout user
   POST /api/users/logout
================================ */
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

/* ===============================
   Get user profile
   GET /api/users/profile
================================ */
const getUserProfile = asyncHandler(async (req, res) => {
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
  user.email = req.body.email || user.email;

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
   (Vendor Only)
================================ */
const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== 'vendor') {
    res.status(403);
    throw new Error('Vendor access only');
  }

  user.vendorDetails = {
    ...user.vendorDetails,

    // Basic Info
    businessName: req.body.businessName || user.vendorDetails?.businessName,
    serviceType: req.body.serviceType || user.vendorDetails?.serviceType,
    registrationNumber:
      req.body.registrationNumber || user.vendorDetails?.registrationNumber,
    phone: req.body.phone || user.vendorDetails?.phone,
    address: req.body.address || user.vendorDetails?.address,
    description: req.body.description || user.vendorDetails?.description,

    // Specific Vendor Info
    specificDetails: {
      hotelStarRating: req.body.hotelStarRating,
      vehicleFleetSize: req.body.vehicleFleetSize,
      guideLanguages: req.body.guideLanguages,
      experienceYears: req.body.experienceYears,
    },

    // Documents
    documents: {
      profileImage: req.body.profileImage,
      idFront: req.body.idFront,
      idBack: req.body.idBack,
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

// @desc    Get all pending vendors (Admin only)
// @route   GET /api/users/pending
// @access  Private/Admin
const getPendingVendors = asyncHandler(async (req, res) => {
  // role එක 'vendor' සහ isApproved 'false' අය පමණක් සොයන්න
  const vendors = await User.find({ role: 'vendor', isApproved: false }).select('-password');
  res.json(vendors);
});

// @desc    Approve a vendor
// @route   PUT /api/users/approve/:id
// @access  Private/Admin
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
  getPendingVendors, // 👈 New
  approveVendor,
};
