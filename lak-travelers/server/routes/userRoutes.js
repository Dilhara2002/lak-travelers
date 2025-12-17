import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
} from '../controllers/authController.js';
import {
  getUserProfile,
  updateUserProfile,
  updateVendorProfile,
  getPendingVendors, // 👈 Import
  approveVendor,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

// Register (POST /api/users)
router.post('/', registerUser);

// Login (POST /api/users/auth)
router.post('/auth', authUser);

// Logout (POST /api/users/logout)
router.post('/logout', logoutUser);


/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

// View & Update Profile (GET, PUT /api/users/profile)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/vendor-profile', protect, updateVendorProfile);

router.get('/pending', protect, admin, getPendingVendors);
router.put('/approve/:id', protect, admin, approveVendor);

export default router;
