import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';

/**
 * @desc    Get logged in user bookings (Traveler side)
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  // Database එකෙන් IDs වෙනුවට සම්පූර්ණ විස්තර ලබා ගැනීමට populate භාවිතා කරයි
  const bookings = await Booking.find({ user: req.user._id })
    .populate('hotel', 'name image location') 
    .populate('tour', 'name image destinations')
    .populate('vehicle', 'vehicleModel images')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

/**
 * @desc    Get all Bookings (Admin only)
 * @route   GET /api/bookings/admin/all
 * @access  Private/Admin
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate({
      path: 'hotel tour vehicle',
      select: 'name vehicleModel user',
      populate: { path: 'user', select: 'name email' } 
    })
    .sort({ createdAt: -1 });
    
  res.json(bookings);
});

/**
 * @desc    Get Bookings relevant to the logged-in Vendor
 * @route   GET /api/bookings/vendor/my
 * @access  Private/Vendor
 */
export const getMyVendorBookings = asyncHandler(async (req, res) => {
  // Find bookings and match them against items owned by this vendor
  const bookings = await Booking.find({})
    .populate('user', 'name email') 
    .populate({
      path: 'hotel',
      match: { user: req.user._id }
    })
    .populate({
      path: 'tour',
      match: { user: req.user._id }
    })
    .populate({
      path: 'vehicle',
      match: { user: req.user._id }
    })
    .sort({ createdAt: -1 });

  // Filter the list: Keep only the bookings where one of the services matches the Vendor
  const myBookings = bookings.filter(booking => 
    booking.hotel !== null || 
    booking.tour !== null || 
    booking.vehicle !== null
  );

  res.json(myBookings);
});

/**
 * @desc    Update booking status (Accept/Reject/Confirm)
 * @route   PUT /api/bookings/:id/status
 * @access  Private/Vendor
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Expecting: 'confirmed', 'rejected', or 'cancelled'
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // We use lowercase status to stay consistent with the Frontend Badges
    booking.status = status.toLowerCase();
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

/**
 * @desc    Cancel a booking (User side)
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to cancel this booking');
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

/**
 * @desc    Create a new Booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { hotel, tour, vehicle, checkInDate, checkOutDate, tourDate, pickupDate, totalPrice } = req.body;

  if (!totalPrice) {
    res.status(400);
    throw new Error('Total price is required to complete the booking');
  }

  const booking = new Booking({
    user: req.user._id,
    hotel,
    tour,
    vehicle,
    checkInDate,
    checkOutDate,
    tourDate,
    pickupDate,
    totalPrice,
    status: 'pending' // Default starting status in lowercase
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});