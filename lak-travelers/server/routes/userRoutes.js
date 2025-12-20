import express from 'express';
import {
  registerUser,
  sendOTP,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateVendorProfile,
  getPendingVendors,
  approveVendor,
  getAdminStats,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * 🔓 Public Routes (ඕනෑම අයෙකුට විවෘතයි)
 */
// පරිශීලක ලියාපදිංචිය (දැන් OTP සමඟ)
router.post('/', registerUser); 

// OTP කේතය ඊමේල් කිරීමට (Register සහ Update දෙකටම)
router.post('/send-otp', sendOTP); 

// ලොගින් සහ ලොග්අවුට්
router.post('/auth', authUser);
router.post('/logout', logoutUser);


/**
 * 🔒 Protected Routes (ලොග් වූ අයට පමණයි)
 */
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); // පින්තූරය සහ OTP මෙහිදී handle වේ

// Vendor කෙනෙකු වීමට ඉල්ලුම් කිරීම
router.put('/vendor-profile', protect, updateVendorProfile);


/**
 * 🛡️ Admin Routes (ඇඩ්මින්වරුන්ට පමණයි)
 */
// අනුමැතිය අපේක්ෂිත වෙන්ඩර්වරු ලබා ගැනීම
router.get('/pending', protect, admin, getPendingVendors);

// Dashboard දත්ත (Stats) ලබා ගැනීම
router.get('/admin-stats', protect, admin, getAdminStats);

// වෙන්ඩර් කෙනෙකු අනුමත කිරීම
router.put('/approve/:id', protect, admin, approveVendor);

export default router;