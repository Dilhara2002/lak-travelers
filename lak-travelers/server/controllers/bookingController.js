import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { hotelId, checkInDate, checkOutDate } = req.body;

  if (!hotelId || !checkInDate || !checkOutDate) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const booking = new Booking({
    user: req.user._id, // Login වී සිටින user
    hotel: hotelId,
    checkInDate,
    checkOutDate,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  // තමන්ගේ බුකින් විතරක් හොයනවා, හෝටලයේ විස්තරත් එක්ක (populate)
  const bookings = await Booking.find({ user: req.user._id }).populate('hotel');
  res.json(bookings);
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // ආරක්ෂාවට: Booking එක දාපු කෙනාට විතරයි අයින් කරන්න පුළුවන්
    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to cancel this booking');
    }

    await booking.deleteOne(); // Booking එක මකනවා
    res.json({ message: 'Booking removed' });
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

export { createBooking, getMyBookings, cancelBooking };