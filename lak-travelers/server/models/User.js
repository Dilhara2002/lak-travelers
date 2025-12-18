import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
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

    // Vendor Approval System - මෙය සරල කර ඇත
    isApproved: {
      type: Boolean,
      default: true, // සාමාන්‍යයෙන් True, Vendor කෙනෙක් නම් Controller එකෙන් False කරමු
    },

    // Vendor Details (Optional) - මෙහි ව්‍යුහය වඩාත් ස්ථාවර කර ඇත
    vendorDetails: {
      businessName: { type: String, default: "" },
      serviceType: { 
        type: String, 
        enum: ['hotel', 'vehicle', 'tour', 'none'], 
        default: 'none'
      },
      registrationNumber: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      description: { type: String, default: "" },

      // Nested objects වලට default හිස් අගයන් ලබා දීමෙන් Crash වීම වැළකේ
      hotelStarRating: { type: String, default: "" },
      vehicleFleetSize: { type: String, default: "" },
      guideLanguages: { type: String, default: "" },
      experienceYears: { type: String, default: "" },
      
      profileImage: { type: String, default: "" },
      idFront: { type: String, default: "" },
      idBack: { type: String, default: "" }
    },
  },
  {
    timestamps: true,
  }
);

/* ============================================================
   Password hashing middleware
============================================================ */
userSchema.pre('save', async function (next) {
  // Password එක වෙනස් වෙලා නැත්නම් විතරක් Skip කරන්න
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/* ============================================================
   Password compare method
============================================================ */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;