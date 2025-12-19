import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/* =====================================================
   1️⃣ USER CONTROLLERS (පරිශීලක පාලක)
===================================================== */

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
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
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
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/* =====================================================
   2️⃣ VENDOR CONTROLLERS (වෙන්ඩර් පාලක)
===================================================== */

// @desc    Update user profile to vendor
// @route   PUT /api/users/vendor-profile
export const updateVendorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // සියලුම vendorDetails නිවැරදිව update කිරීම
  user.vendorDetails = {
    businessName: req.body.businessName || user.vendorDetails?.businessName || "",
    serviceType: req.body.serviceType || user.vendorDetails?.serviceType || "none",
    phone: req.body.phone || user.vendorDetails?.phone || "",
    address: req.body.address || user.vendorDetails?.address || "",
    description: req.body.description || user.vendorDetails?.description || "",
    profileImage: req.body.profileImage || user.vendorDetails?.profileImage || "",
    idFront: req.body.idFront || user.vendorDetails?.idFront || "",
    idBack: req.body.idBack || user.vendorDetails?.idBack || "",
    registrationNumber: req.body.registrationNumber || user.vendorDetails?.registrationNumber || "",
    hotelStarRating: req.body.hotelStarRating || user.vendorDetails?.hotelStarRating || "",
    vehicleFleetSize: req.body.vehicleFleetSize || user.vendorDetails?.vehicleFleetSize || "",
    guideLanguages: req.body.guideLanguages || user.vendorDetails?.guideLanguages || "",
    experienceYears: req.body.experienceYears || user.vendorDetails?.experienceYears || "",
  };

  user.isApproved = false; // Admin අනුමැතිය අවශ්‍ය බැවින්
  user.role = 'vendor';

  const updatedUser = await user.save();

  res.status(200).json(updatedUser);
});

/* =====================================================
   3️⃣ ADMIN CONTROLLERS (ඇඩ්මින් පාලක)
===================================================== */

// @desc    Get all vendors waiting for approval
// @route   GET /api/users/pending
export const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor', isApproved: false }).select('-password');
  res.json(vendors || []);
});

// @desc    Approve a vendor
// @route   PUT /api/users/approve/:id
// 🚨 මෙම කොටස ඔයාට අමතක වී තිබුණා - මෙය අනිවාර්යයි
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

// @desc    Get Admin Dashboard Stats
// @route   GET /api/users/admin-stats
export const getAdminStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments({ role: 'user' });
  const vendorsCount = await User.countDocuments({ role: 'vendor' });
  
  res.json({
    usersCount,
    vendorsCount,
    bookingsCount: 0, 
    hotelsCount: 0,
    toursCount: 0,
    vehiclesCount: 0,
    totalRevenue: 0,
  });
});