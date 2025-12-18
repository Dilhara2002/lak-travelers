import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // පරිශීලකයා නිර්මාණය කිරීම
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isApproved: role === 'vendor' ? false : true, 
  });

  if (user) {
    // JWT Cookie එක සාදා යැවීම
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
 * @desc    Auth user & get token
 * @route   POST /api/users/auth
 * @access  Public
 */
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

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Public
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,       // Vercel deployment සඳහා
    sameSite: 'none',   // Cross-origin context සඳහා
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      vendorDetails: user.vendorDetails,
    });
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
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    
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
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update Vendor Details & Documents
 * @route   PUT /api/users/vendor-profile
 * @access  Private (Vendor Only)
 */
const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== 'vendor') {
    res.status(403);
    throw new Error('Vendor access only');
  }

  // Vendor Details ව්‍යුහය වඩාත් ආරක්ෂිතව සකස් කිරීම
  user.vendorDetails = {
    businessName: req.body.businessName || user.vendorDetails?.businessName,
    serviceType: req.body.serviceType || user.vendorDetails?.serviceType,
    registrationNumber: req.body.registrationNumber || user.vendorDetails?.registrationNumber,
    phone: req.body.phone || user.vendorDetails?.phone,
    address: req.body.address || user.vendorDetails?.address,
    description: req.body.description || user.vendorDetails?.description,
    
    // පින්තූර මෙහිදී සෘජුවම ගබඩා වේ
    profileImage: req.body.profileImage || user.vendorDetails?.profileImage,
    idFront: req.body.idFront || user.vendorDetails?.idFront,
    idBack: req.body.idBack || user.vendorDetails?.idBack,

    // සේවා වර්ගයට අදාළ දත්ත
    hotelStarRating: req.body.hotelStarRating || user.vendorDetails?.hotelStarRating,
    vehicleFleetSize: req.body.vehicleFleetSize || user.vendorDetails?.vehicleFleetSize,
    guideLanguages: req.body.guideLanguages || user.vendorDetails?.guideLanguages,
    experienceYears: req.body.experienceYears || user.vendorDetails?.experienceYears,
  };

  try {
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500);
    throw new Error('Error updating vendor profile: ' + error.message);
  }
});

/**
 * @desc    Get all pending vendors (Admin only)
 * @route   GET /api/users/pending-vendors
 * @access  Private/Admin
 */
const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor', isApproved: false }).select('-password');
  res.json(vendors);
});

/**
 * @desc    Approve a vendor
 * @route   PUT /api/users/approve/:id
 * @access  Private/Admin
 */
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