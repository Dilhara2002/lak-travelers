import mongoose from 'mongoose';

// 1. තනි Review එකක් හැදෙන විදිය (Schema)
const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },   // Review දාපු කෙනාගේ නම
  rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 අතර පමණක් තරු ලබා දිය හැක
  comment: { type: String, required: true }, // Comment එක
  image: { type: String }, // Review එකක් සමඟ පින්තූරයක් එක් කිරීමට
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
  // හෝටලය ඇතුළත් කළ පරිශීලකයා (Vendor/Admin)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { 
    type: String, 
    required: [true, 'Please add a hotel name'] 
  },
  location: { 
    type: String, 
    required: [true, 'Please add a location'] 
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description'] 
  },
  pricePerNight: { 
    type: Number, 
    required: [true, 'Please add price per night'],
    default: 0 
  },
  image: { 
    type: String, 
    required: [true, 'Please upload a hotel image'] 
  },
  mapUrl: { 
    type: String, 
    required: [true, 'Please add a Google Maps URL'] 
  },
  
  // Reviews List එකක්
  reviews: [reviewSchema], 
  
  rating: {
    type: Number,
    required: true,
    default: 0, 
  },
  
  numReviews: {
    type: Number,
    required: true,
    default: 0, 
  },

}, {
  timestamps: true,
});

// models/hotel.js ඇතුළත අවසාන පේළිය මෙලෙස වෙනස් කරන්න
const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
export default Hotel;