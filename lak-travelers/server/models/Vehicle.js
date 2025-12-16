import mongoose from 'mongoose';

// 1. Review Schema
const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const vehicleSchema = mongoose.Schema({
  // ... (Other fields remain same) ...
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  licensePlate: { type: String, required: true },
  driverName: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  description: { type: String, required: true },
  contactNumber: { type: String, required: true },
  images: [{ type: String }], // Array of images
  mapUrl: { type: String },

  // 2. Add Reviews & Rating
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },

}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;