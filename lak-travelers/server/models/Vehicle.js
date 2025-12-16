import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema({
  driverName: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  type: { type: String, required: true },
  licensePlate: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  description: { type: String, required: true },
  contactNumber: { type: String, required: true },
  
  // 👇 වෙනස් කළ කොටස: 'image' වෙනුවට 'images' (Array එකක්)
  images: [{ type: String, required: true }], 
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;