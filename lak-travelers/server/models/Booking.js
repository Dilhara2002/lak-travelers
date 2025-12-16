import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    // User who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Booking type: hotel / tour / vehicle
    bookingType: {
      type: String,
      required: true,
      enum: ['hotel', 'tour', 'vehicle'],
      default: 'hotel',
    },

    // Related entity (only ONE will be used per booking)
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

    /* ---------------- HOTEL BOOKING ---------------- */
    checkInDate: {
      type: Date,
    },
    checkOutDate: {
      type: Date,
    },

    /* ---------------- TOUR BOOKING ---------------- */
    tourDate: {
      type: Date,
    },
    peopleCount: {
      type: Number,
      default: 1,
    },

    /* ---------------- VEHICLE BOOKING ---------------- */
    pickupDate: {
      type: Date,
    },
    pickupLocation: {
      type: String,
    },

    /* ---------------- PAYMENT ---------------- */
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed', // No payment gateway yet
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
