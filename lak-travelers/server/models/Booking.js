import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    checkInDate: { type: String }, // Changed to String for easier Frontend display
    checkOutDate: { type: String },
    tourDate: { type: String },
    pickupDate: { type: String },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled'], // Lowercase to match Frontend
      default: 'pending',
    },
    vendorFeedback: {
      problem: { type: String, default: "" },
      solution: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;