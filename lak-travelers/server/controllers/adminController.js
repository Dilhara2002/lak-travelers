import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Tour from '../models/Tour.js';
import Vehicle from '../models/Vehicle.js';

/**
 * @desc    Admin Dashboard සඳහා සංඛ්‍යාලේඛන ලබා ගැනීම
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = asyncHandler(async (req, res) => {
  console.log("Admin Stats Request Received by:", req.user.name); 

  // 1. සියලුම අයිතමයන්ගේ එකතුව (Counts) ලබා ගැනීම
  // Promise.all භාවිතා කිරීමෙන් එකවර සියලුම Queries ක්‍රියාත්මක වන නිසා වේගය වැඩි වේ.
  const [
    usersCount, 
    vendorsCount, 
    bookingsCount, 
    hotelsCount, 
    toursCount, 
    vehiclesCount
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'role' === 'vendor' ? 'vendor' : 'vendor' }), // Role එක නිවැරදිව පරීක්ෂා කිරීම
    Booking.countDocuments(),
    Hotel.countDocuments(),
    Tour.countDocuments(),
    Vehicle.countDocuments(),
  ]);

  // 2. මුළු ආදායම (Total Revenue) ගණනය කිරීම
  // සියලුම Booking දත්ත මතකයට (Memory) ගෙන ඒම වෙනුවට Database එක තුළදීම එකතු කිරීම (Aggregate) වඩාත් කාර්යක්ෂමයි.
  const revenueStats = await Booking.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" } // ඔබේ Booking Model එකේ totalPrice field එක තිබිය යුතුය
      }
    }
  ]);

  const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

  console.log("Stats Calculated Successfully ✅");

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