import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
} from '../controllers/authController.js';

const router = express.Router();

// Register වෙන පාර (POST /api/users)
router.post('/', registerUser);

// Login වෙන පාර (POST /api/users/auth)
router.post('/auth', authUser);

// Logout වෙන පාර (POST /api/users/logout)
router.post('/logout', logoutUser);

export default router;