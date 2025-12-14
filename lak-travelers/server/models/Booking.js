import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // User කෙනෙක්ට සම්බන්ධයි
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Hotel', // Hotel එකකට සම්බන්ධයි
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // booking එක දාපු වෙලාව save වෙනවා
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;