import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';

// @desc    සියලුම Bookings ලබා ගැනීම (Admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate({
      path: 'hotel tour vehicle',
      select: 'name vehicleModel user',
      populate: { path: 'user', select: 'name email' } 
    });
  res.json(bookings);
});

// @desc    Vendor හට අදාළ Bookings ලබා ගැනීම
// @desc    Vendor හට අදාළ Bookings ලබා ගැනීම
export const getMyVendorBookings = asyncHandler(async (req, res) => {
  // Vendor විසින් අයිති සියලුම හෝටල්, සංචාර සහ වාහන මුලින්ම සොයා ගනී
  // මෙය වඩාත් ආරක්ෂිත සහ සාර්ථක ක්‍රමයයි
  const bookings = await Booking.find({})
    .populate('user', 'name email') // බුක් කළ පුද්ගලයාගේ විස්තර
    .populate({
      path: 'hotel',
      match: { user: req.user._id } // මෙම හෝටලය ලොග් වී සිටින Vendor ට අයිතිදැයි බලයි
    })
    .populate({
      path: 'tour',
      match: { user: req.user._id }
    })
    .populate({
      path: 'vehicle',
      match: { user: req.user._id }
    });

  // Populate කළ පසු match නොවන ඒවා null වේ. 
  // එබැවින් අවම වශයෙන් එක සේවාවක් හෝ null නොවන Bookings පමණක් පෙරා ගනී.
  const myBookings = bookings.filter(booking => 
    booking.hotel !== null || 
    booking.tour !== null || 
    booking.vehicle !== null
  );

  if (myBookings.length === 0) {
    res.json([]); // දත්ත නැතිනම් හිස් Array එකක් එවයි
  } else {
    res.json(myBookings);
  }
});

// @desc    Status Update කිරීම (Accept/Reject)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, problem, solution } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.status = status || booking.status;
    booking.vendorFeedback = {
      problem: problem || "",
      solution: solution || ""
    };

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Booking එකක් අවලංගු කිරීම (Cancel)
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (booking) {
    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    අලුත් Booking එකක් සෑදීම
// @route   POST /api/bookings
// @desc    අලුත් Booking එකක් සෑදීම
export const createBooking = asyncHandler(async (req, res) => {
  // 🚨 මෙතැන totalPrice නිවැරදිව ලැබෙනවාදැයි පරීක්ෂා කරන්න
  const { hotel, tour, vehicle, checkInDate, checkOutDate, totalPrice } = req.body;

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
    totalPrice, // 👈 මෙම අගය අනිවාර්යයි
    status: 'Pending'
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});