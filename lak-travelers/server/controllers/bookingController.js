import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Tour from '../models/Tour.js';
import Vehicle from '../models/Vehicle.js';

/**
 * @desc    නව වෙන්කිරීමක් සිදු කිරීම (Create Booking)
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const { 
    bookingType, 
    hotelId, tourId, vehicleId, 
    checkInDate, checkOutDate, 
    tourDate, peopleCount, 
    pickupDate, returnDate, // Vehicle සඳහා returnDate එකතු කළා
    pickupLocation 
  } = req.body;

  let totalPrice = 0;
  let bookingData = {
    user: req.user._id, // Auth Middleware එකෙන් ලැබෙන ID එක
    bookingType,
  };

  // 1. HOTEL BOOKING LOGIC 🏨
  if (bookingType === 'hotel') {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) { res.status(404); throw new Error('Hotel not found'); }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
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

    // දින ගණන අනුව මිල ගණනය කිරීම (වැඩිදියුණු කළා)
    const start = new Date(pickupDate);
    const end = returnDate ? new Date(returnDate) : new Date(pickupDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

    totalPrice = vehicle.pricePerDay * days;
    bookingData = { ...bookingData, vehicle: vehicleId, pickupDate, returnDate, pickupLocation, totalPrice };
  }

  const booking = await Booking.create(bookingData);
  res.status(201).json(booking);
});

/**
 * @desc    සියලුම වෙන්කිරීම් බැලීම (Admin Only)
 */
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('tour', 'name')
      .populate('vehicle', 'vehicleModel');
    res.json(bookings);
});

/**
 * @desc    ලොග් වී සිටින පරිශීලකයාගේ වෙන්කිරීම් බැලීම
 */
const getMyBookings = asyncHandler(async (req, res) => {
  // 401 Error එක මගහරවා ගැනීමට req.user._id නිවැරදිව ලැබිය යුතුයි
  const bookings = await Booking.find({ user: req.user._id })
    .populate('hotel', 'name image location')
    .populate('tour', 'name image destinations')
    .populate('vehicle', 'vehicleModel images type');

  res.json(bookings);
});

/**
 * @desc    වෙන්කිරීමක් අවලංගු කිරීම
 */
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
  
    if (booking) {
      // ආරක්ෂක පියවර: අයිතිකරුට හෝ ඇඩ්මින්ට පමණක් අවසරය
      if(booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          res.status(401);
          throw new Error('Not authorized to cancel this booking');
      }

      await booking.deleteOne();
      res.json({ message: 'Booking removed successfully' });
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
});

export { createBooking, getBookings, getMyBookings, cancelBooking };