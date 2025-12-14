import mongoose from 'mongoose';

const hotelSchema = mongoose.Schema({
  // හෝටලය අයිති කාටද (Vendor ID)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String, // උදා: Kandy
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // Image URL එක
    required: false,
    default: "https://via.placeholder.com/300" 
  },
}, {
  timestamps: true,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;