import mongoose from 'mongoose';

// 1. තනි Review එකක් හැදෙන විදිය (Schema)
const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },   // Review දාපු කෙනාගේ නම
  rating: { type: Number, required: true }, // දුන්න තරු ගණන (1-5)
  comment: { type: String, required: true }, // Comment එක
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // User කෙනෙක්ට සම්බන්ධයි
  },
}, {
  timestamps: true,
});

// 2. Hotel Schema එක
const hotelSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  image: { type: String },
  
  // 👇 අලුතින් එකතු කළ කොටස්
  reviews: [reviewSchema], // Reviews List එකක්
  
  rating: {
    type: Number,
    required: true,
    default: 0, // මුලින්ම Rating එක 0 යි
  },
  
  numReviews: {
    type: Number,
    required: true,
    default: 0, // මුලින්ම Reviews ගණන 0 යි
  },

}, {
  timestamps: true,
});

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;