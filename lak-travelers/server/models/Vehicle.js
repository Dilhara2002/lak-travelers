import mongoose from 'mongoose';

// 1. Review Schema එක (වාහන සඳහා ප්‍රතිපෝෂණ)
const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  image: { type: String }, // Optional Review Image
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

// 2. Vehicle Schema එක
const vehicleSchema = mongoose.Schema({
  // වාහනය ඇතුළත් කළ පරිශීලකයා (Vendor/Admin)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: { 
    type: String, 
    required: [true, 'Please add vehicle type (e.g. Car, Van, Bus)'] 
  },
  vehicleModel: { 
    type: String, 
    required: [true, 'Please add vehicle model'] 
  },
  licensePlate: { 
    type: String, 
    required: [true, 'Please add license plate number'],
    unique: true // එකම අංකය සහිත වාහන දෙකක් තිබිය නොහැක
  },
  driverName: { 
    type: String, 
    required: [true, 'Please add driver name'] 
  },
  capacity: { 
    type: Number, 
    required: [true, 'Please add seating capacity'] 
  },
  pricePerDay: { 
    type: Number, 
    required: [true, 'Please add price per day'] 
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description'] 
  },
  contactNumber: { 
    type: String, 
    required: [true, 'Please add a contact number'] 
  },
  images: [{ 
    type: String,
    required: [true, 'Please upload at least one image']
  }], 
  mapUrl: { type: String },

  // Reviews සහ Ratings
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
}, { timestamps: true });

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;

