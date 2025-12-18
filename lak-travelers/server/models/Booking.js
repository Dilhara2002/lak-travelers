import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    // 1. වෙන්කිරීම සිදු කළ පරිශීලකයා
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 2. වෙන්කිරීමේ වර්ගය (Hotel / Tour / Vehicle)
    bookingType: {
      type: String,
      required: true,
      enum: ['hotel', 'tour', 'vehicle'],
      default: 'hotel',
    },

    // 3. සම්බන්ධිත අයිතමය (සෑම Booking එකකදීම මෙයින් එකක් පමණක් භාවිත වේ)
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },

    /* ---------------- හෝටල් වෙන්කිරීම් (HOTEL BOOKING) ---------------- */
    checkInDate: {
      type: Date,
    },
    checkOutDate: {
      type: Date,
    },

    /* ---------------- සංචාර වෙන්කිරීම් (TOUR BOOKING) ---------------- */
    tourDate: {
      type: Date,
    },
    peopleCount: {
      type: Number,
      default: 1,
    },

    /* ---------------- වාහන වෙන්කිරීම් (VEHICLE BOOKING) ---------------- */
    pickupDate: {
      type: Date,
    },
    returnDate: { // 👈 මිල ගණනය කිරීමට මෙය අලුතින් එක් කළා
      type: Date,
    },
    pickupLocation: {
      type: String,
    },

    /* ---------------- ගෙවීම් සහ තත්ත්වය (PAYMENT & STATUS) ---------------- */
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed', // දැනට Payment Gateway එකක් නැති නිසා auto-confirm වේ
    },
  },
  {
    timestamps: true, // CreatedAt සහ UpdatedAt ස්වයංක්‍රීයව එක් වේ
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;