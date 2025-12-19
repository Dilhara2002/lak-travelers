import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    vendorDetails: {
      businessName: { type: String, default: "" },
      serviceType: { type: String, enum: ['hotel', 'vehicle', 'tour', 'none'], default: 'none' },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      idFront: { type: String, default: "" },
      idBack: { type: String, default: "" },
      registrationNumber: { type: String, default: "" },
      hotelStarRating: { type: String, default: "" },
      vehicleFleetSize: { type: String, default: "" },
      guideLanguages: { type: String, default: "" },
      experienceYears: { type: String, default: "" },
      description: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

/**
 * 🛡️ PASSWORD ENCRYPTION MIDDLEWARE
 * async/await භාවිතා කරන විට next පරාමිතිය අවශ්‍ය නොවේ. 
 * දෝෂයක් ඇත්නම් එය ඉබේම හසුරුවයි.
 */
userSchema.pre('save', async function () {
  // Password එක වෙනස් වී නොමැති නම් hashing පියවර මඟ හරින්න
  if (!this.isModified('password')) {
    return; // මීළඟ පියවරට ඉබේම යොමු වේ
  }

  // Password එක Hash කිරීම
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 🔑 PASSWORD MATCHING METHOD
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

