import mongoose from 'mongoose';

// 1. තනි Review එකක් සඳහා වන Schema එක
const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { 
    type: Number, 
    required: true,
    min: 1, 
    max: 5 
  },
  comment: { type: String, required: true },
  image: { type: String }, // Review එකක් සමඟ පින්තූරයක් එක් කිරීමට (Optional)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { 
  timestamps: true 
});

// 2. Tour Schema එක
const tourSchema = mongoose.Schema({
  // සංචාරය ඇතුළත් කළ පරිශීලකයා (Vendor / Admin)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  name: { 
    type: String, 
    required: [true, 'Please add a tour name'] 
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description'] 
  },
  destinations: { 
    type: String, 
    required: [true, 'Please add destinations'] 
  },
  duration: { 
    type: String, 
    required: [true, 'Please add duration (e.g., 3 Days)'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Please add a price'],
    default: 0 
  },
  groupSize: { 
    type: Number, 
    required: [true, 'Please add group size'],
    default: 1 
  },
  image: { 
    type: String, 
    required: [true, 'Please upload a tour image'] 
  },
  mapUrl: { 
    type: String 
  }, // Map Link (Optional)

  // Reviews සහ Ratings පාලනය
  reviews: [reviewSchema],
  rating: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  numReviews: { 
    type: Number, 
    required: true, 
    default: 0 
  },

}, { 
  timestamps: true 
});

const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);
export default Tour;

