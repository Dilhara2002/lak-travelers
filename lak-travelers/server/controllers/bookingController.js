import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';

/**
 * @desc    Create new booking (Hotel or Tour)
 * @route   POST /api/bookings
 * @access  Private
 */
// ... createBooking function start ...
const createBooking = asyncHandler(async (req, res) => {
  const { 
    hotelId, checkInDate, checkOutDate, 
    tourId, tourDate, peopleCount,
    vehicleId, pickupDate, pickupLocation, // 👈 New Fields
    bookingType 
  } = req.body;

  let bookingData = {
    user: req.user._id,
    bookingType: bookingType || 'hotel',
  };

  // 1. Hotel Logic
  if (bookingType === 'hotel') {
     // ... (Old Hotel Logic) ...
     bookingData.hotel = hotelId;
     bookingData.checkInDate = checkInDate;
     bookingData.checkOutDate = checkOutDate;
  } 
  
  // 2. Tour Logic
  else if (bookingType === 'tour') {
     // ... (Old Tour Logic) ...
     bookingData.tour = tourId;
     bookingData.tourDate = tourDate;
     bookingData.peopleCount = peopleCount;
  }

  // 3. 👇 Vehicle Logic (New)
  else if (bookingType === 'vehicle') {
    if (!vehicleId || !pickupDate || !pickupLocation) {
      res.status(400);
      throw new Error('Please fill all vehicle booking fields');
    }
    bookingData.vehicle = vehicleId;
    bookingData.pickupDate = pickupDate;
    bookingData.pickupLocation = pickupLocation;
  }

  const booking = new Booking(bookingData);
  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});
// ...

/**
 * @desc    Get logged in user bookings (Hotel + Tour)
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('hotel', 'name location image')
    .populate('tour', 'name duration image');

  res.json(bookings);
});

/**
 * @desc    Cancel booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only booking owner can cancel
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }

  await booking.deleteOne();
  res.json({ message: 'Booking cancelled successfully' });
});

export { createBooking, getMyBookings, cancelBooking };
