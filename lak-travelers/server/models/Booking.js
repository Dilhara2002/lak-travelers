import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  
  // Hotel, Tour, or Vehicle
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }, // 👈 New Field

  // Booking Type
  bookingType: {
    type: String,
    required: true,
    enum: ['hotel', 'tour', 'vehicle'], // 👈 'vehicle' added
    default: 'hotel',
  },

  // Dates & Details
  checkInDate: { type: String },  // Hotel
  checkOutDate: { type: String }, // Hotel
  
  tourDate: { type: String },     // Tour
  peopleCount: { type: Number },  // Tour
  
  pickupDate: { type: String },   // Vehicle 👈 New
  pickupLocation: { type: String }, // Vehicle 👈 New

}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;