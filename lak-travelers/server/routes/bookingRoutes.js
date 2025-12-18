import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  createBooking, 
  getBookings, 
  getMyBookings, 
  cancelBooking 
} from '../controllers/bookingController.js';

const router = express.Router();

// 1. අලුත් Booking එකක් දැමීම (ලොග් වූ ඕනෑම අයෙකුට)
router.post('/', protect, createBooking);

// 2. තමන්ගේම Bookings බැලීම (ලොග් වූ පරිශීලකයාට පමණි)
router.get('/mybookings', protect, getMyBookings);

// 3. සියලුම Bookings බැලීම (Admin හට පමණි)
router.get('/', protect, admin, getBookings);

// 4. Booking එකක් අවලංගු කිරීම
router.delete('/:id', protect, cancelBooking);

export default router;