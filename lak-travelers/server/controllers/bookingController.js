import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Tour from '../models/Tour.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Create new booking with Price Calculation
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { 
    bookingType, 
    hotelId, tourId, vehicleId, 
    checkInDate, checkOutDate, 
    tourDate, peopleCount, 
    pickupDate, pickupLocation 
  } = req.body;

  let totalPrice = 0;
  let bookingData = {
    user: req.user._id,
    bookingType,
  };

  // 1. HOTEL BOOKING LOGIC 🏨
  if (bookingType === 'hotel') {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const timeDiff = end - start;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const validNights = nights > 0 ? nights : 1;

    totalPrice = validNights * hotel.pricePerNight;
    bookingData = { ...bookingData, hotel: hotelId, checkInDate, checkOutDate, totalPrice };
  }

  // 2. TOUR BOOKING LOGIC 🚐
  else if (bookingType === 'tour') {
    const tour = await Tour.findById(tourId);
    if (!tour) { res.status(404); throw new Error('Tour not found'); }

    const count = peopleCount || 1;
    totalPrice = tour.price * count;
    bookingData = { ...bookingData, tour: tourId, tourDate, peopleCount: count, totalPrice };
  }

  // 3. VEHICLE BOOKING LOGIC 🚗
  else if (bookingType === 'vehicle') {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }

    totalPrice = vehicle.pricePerDay;
    bookingData = { ...bookingData, vehicle: vehicleId, pickupDate, pickupLocation, totalPrice };
  }

  const booking = await Booking.create(bookingData);
  res.status(201).json(booking);
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find().populate('user', 'id name email');
    res.json(bookings);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  // 👇 හෝටල්, Tours, Vehicles වල නම සහ පින්තූරය (image) එන්න ඕනේ නිසා populate කරනවා
  const bookings = await Booking.find({ user: req.user._id })
    .populate('hotel', 'name image location')       // Hotel details
    .populate('tour', 'name image destinations')    // Tour details
    .populate('vehicle', 'vehicleModel images type'); // Vehicle details (Note: vehicle has 'images' array)

  res.json(bookings);
});

// @desc    Cancel/Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
  
    if (booking) {
      // Booking එක අයිති User ට හෝ Admin ට විතරයි Cancel කරන්න පුළුවන්
      if(booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          res.status(401);
          throw new Error('Not authorized to cancel this booking');
      }

      await booking.deleteOne();
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
});

// 👇 Export එකේ cancelBooking තියෙනවද කියලා හොඳට බලන්න
export { createBooking, getBookings, getMyBookings, cancelBooking };