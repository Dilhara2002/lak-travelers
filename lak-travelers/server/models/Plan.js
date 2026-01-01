import mongoose from 'mongoose';

const planSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    location: { type: String, required: true },
    duration: { type: Number, required: true },
    preferences: { type: String },
    itinerary: { type: String, required: true },
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);
export default Plan;