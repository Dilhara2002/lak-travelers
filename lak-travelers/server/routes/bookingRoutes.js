import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();

// Booking දාන්න අනිවාර්යයෙන් Login වෙලා ඉන්න ඕනේ (protect)
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

export default router;