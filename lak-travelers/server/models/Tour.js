import mongoose from 'mongoose';

// 1. Review Schema එක හදන්න (User Schema එකට පහලින්)
const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String }, // Optional Image
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

const tourSchema = mongoose.Schema({
  // ... (user, name, description වගේ පරණ fields එහෙමම තියන්න) ...
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  destinations: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  groupSize: { type: Number, required: true },
  image: { type: String, required: true },
  mapUrl: { type: String }, // Map Link (Optional)

  // 2. Reviews Array එක සහ Rating එකතු කරන්න
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },

}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;