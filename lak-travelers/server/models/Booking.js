import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },

    checkInDate: { type: String }, 
    checkOutDate: { type: String },
    tourDate: { type: String },
    pickupDate: { type: String },

    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'partially_paid'], default: 'unpaid' },
    paymentMethod: { type: String, enum: ['pay_on_arrival', 'online_payment', 'bank_transfer'], default: 'pay_on_arrival' },
    currency: { type: String, default: 'LKR' },

    status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'cancelled'], default: 'pending' },
    vendorFeedback: {
      problem: { type: String, default: "" },
      solution: { type: String, default: "" }
    },
    isWhatsAppNotified: { type: Boolean, default: false }
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;