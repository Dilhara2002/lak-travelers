import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    vendorFeedback: {
      problem: { type: String, default: "" },
      solution: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

// 🚨 මෙන්න මේ පේළිය අනිවාර්යයි (Default export එක)
export default Booking;