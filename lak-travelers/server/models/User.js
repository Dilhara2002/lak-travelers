import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please add a name'] },
    email: { type: String, required: [true, 'Please add an email'], unique: true, lowercase: true },
    password: { type: String, required: [true, 'Please add a password'], minlength: 6 },
    role: { type: String, enum: ['user', 'vendor', 'admin', 'super-admin'], default: 'user' },
    isApproved: { type: Boolean, default: true },
    
    // Vendor Details Schema යාවත්කාලීන කිරීම
    vendorDetails: {
      businessName: { type: String, default: "" },
      businessAddress: { type: String, default: "" }, // Controller එකට ගැලපෙන ලෙස වෙනස් කළා
      businessPhone: { type: String, default: "" },   // Controller එකට ගැලපෙන ලෙස වෙනස් කළා
      serviceType: { type: String, enum: ['hotel', 'vehicle', 'tour', 'none'], default: 'none' },
      registrationNumber: { type: String, default: "" },
      description: { type: String, default: "" },
      hotelStarRating: { type: String, default: "" },
      vehicleFleetSize: { type: String, default: "" },
      guideLanguages: { type: String, default: "" },
      experienceYears: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      idDocuments: {
        front: { type: String, default: "" },
        back: { type: String, default: "" }
      },
      updatedAt: { type: Date, default: Date.now }
    },
    lastLogin: { type: Date },
    isBanned: { type: Boolean, default: false }
}, { timestamps: true });

/**
 * 🔐 Password Hashing Middleware
 * FIXED: 'next' ඉවත් කර async/await පමණක් භාවිතා කරන ලදී.
 */
userSchema.pre('save', async function () {
  // Password එක වෙනස් වී නොමැති නම් පමණක් ඉදිරියට යන්න
  if (!this.isModified('password')) {
    return; 
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 🔑 Password එක Compare කරන ශ්‍රිතය
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;