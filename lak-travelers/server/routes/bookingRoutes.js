import express from 'express';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';
import { 
  createBooking,
  getAllBookings, 
  getMyVendorBookings, 
  updateBookingStatus,
  cancelBooking // 👈 දැන් මෙය ක්‍රියා කරයි
} from '../controllers/bookingController.js';

const router = express.Router();

// Admin Route
router.get('/admin/all', protect, admin, getAllBookings);

// Vendor Route
router.get('/vendor/my', protect, vendor, getMyVendorBookings);
router.route('/').post(protect, createBooking);

// Common/User Routes
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;