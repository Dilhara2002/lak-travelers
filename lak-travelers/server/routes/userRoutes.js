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
  rejectVendor,
  getUsers, // 👈 Added this
  adminUpdateUser,
  adminCreateUser,
  adminDeleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @section Public Routes
 */
router.post('/', registerUser); 
router.post('/send-otp', sendOTP); 
router.post('/auth', authUser);
router.post('/logout', logoutUser);

/**
 * @section Protected Routes (Logged in users only)
 */
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/vendor-profile', protect, updateVendorProfile);

/**
 * @section Admin Management Routes (Full CRUD for Admin)
 */
// Get all users for the management table
router.get('/admin/all', protect, admin, getUsers); 

// Create, Update, and Delete users manually
router.post('/admin/create', protect, admin, adminCreateUser);
router.put('/admin/update/:id', protect, admin, adminUpdateUser);
router.delete('/admin/:id', protect, admin, adminDeleteUser);

/**
 * @section Vendor Approval System
 */
// Get vendors waiting for approval
router.get('/pending', protect, admin, getPendingVendors);

// Approve or Reject vendor applications
router.put('/approve/:id', protect, admin, approveVendor);
router.delete('/reject/:id', protect, admin, rejectVendor);

/**
 * @section Dashboard Statistics
 */
router.get('/admin-stats', protect, admin, getAdminStats);

export default router;