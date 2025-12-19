import express from 'express';
import {
  registerUser,
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

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

router.put('/vendor-profile', protect, updateVendorProfile);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin Routes
router.get('/pending', protect, admin, getPendingVendors);
router.get('/admin-stats', protect, admin, getAdminStats); // 🚀 මීට පෙර Error වූ පේළිය
router.put('/approve/:id', protect, admin, approveVendor);

export default router;