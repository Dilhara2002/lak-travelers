import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Tour from '../models/Tour.js';
import Vehicle from '../models/Vehicle.js';

const getAdminStats = asyncHandler(async (req, res) => {
  console.log("Admin Stats Request Received..."); // 👇 Check 1

  // 1. Counts ගන්න
  const usersCount = await User.countDocuments({ role: 'user' });
  const vendorsCount = await User.countDocuments({ role: 'vendor' });
  const bookingsCount = await Booking.countDocuments();
  const hotelsCount = await Hotel.countDocuments();
  const toursCount = await Tour.countDocuments();
  const vehiclesCount = await Vehicle.countDocuments();

  // 👇 Check 2: මේවා Terminal එකේ Print වෙනවද බලන්න
  console.log("Counts:", { usersCount, vendorsCount, bookingsCount, hotelsCount, toursCount, vehiclesCount });

  // 2. Revenue ගන්න (Booking වල totalPrice එක එකතු කරනවා)
  const bookings = await Booking.find();
  
  // 👇 Check 3: Booking Object එකක් Print කරලා බලන්න structure එක හරිද කියලා
  if (bookings.length > 0) {
    console.log("Sample Booking:", bookings[0]); 
  }

  // totalPrice field එක Booking එකේ තියෙනවද බලන්න. නැත්නම් 0 එන්නේ.
  const totalRevenue = bookings.reduce((acc, item) => {
    return acc + (item.totalPrice || item.price || 0); // totalPrice හෝ price තිබුනොත් ගන්නවා
  }, 0);

  console.log("Total Revenue:", totalRevenue);

  res.json({
    usersCount,
    vendorsCount,
    bookingsCount,
    hotelsCount,
    toursCount,
    vehiclesCount,
    totalRevenue
  });
});

export { getAdminStats };