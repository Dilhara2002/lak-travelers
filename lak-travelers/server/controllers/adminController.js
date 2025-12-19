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
  // සත්‍යාපනය (Verification) සඳහා ලොග් එකක් දැමීම
  console.log(`Admin Stats Requested by: ${req.user.name} (ID: ${req.user._id})`);

  try {
    // 1. සියලුම අයිතමයන්ගේ එකතුව (Counts) ලබා ගැනීම
    // Promise.all භාවිතා කිරීමෙන් සියලුම Queries එකවර (Parallel) ක්‍රියාත්මක වේ.
    const [
      usersCount, 
      vendorsCount, 
      bookingsCount, 
      hotelsCount, 
      toursCount, 
      vehiclesCount
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'vendor' }), // 👈 logic එක මෙහිදී නිවැරදි කරන ලදී
      Booking.countDocuments(),
      Hotel.countDocuments(),
      Tour.countDocuments(),
      Vehicle.countDocuments(),
    ]);

    // 2. මුළු ආදායම (Total Revenue) ගණනය කිරීම
    // Database එක තුළදීම $sum කිරීම වඩාත් වේගවත් වේ.
    const revenueStats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" } 
        }
      }
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    // 3. මෑතකදී සිදු වූ වෙන් කිරීම් (Recent Bookings) - විකල්ප (Optional)
    // Dashboard එකට මෑත දත්ත කිහිපයක් පෙන්වීම ප්‍රයෝජනවත්ය.
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    console.log("Admin Dashboard Stats Calculated Successfully ✅");

    res.status(200).json({
      success: true,
      stats: {
        usersCount,
        vendorsCount,
        bookingsCount,
        hotelsCount,
        toursCount,
        vehiclesCount,
        totalRevenue
      },
      recentBookings
    });

  } catch (error) {
    console.error("Error calculating admin stats:", error);
    res.status(500);
    throw new Error("සංඛ්‍යාලේඛන ලබා ගැනීමේදී දෝෂයක් සිදු විය.");
  }
});

export { getAdminStats };