import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
} from '../controllers/authController.js';
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

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

export default router;
