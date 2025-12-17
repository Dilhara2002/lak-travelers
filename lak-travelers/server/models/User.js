import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 👇 Role (user | vendor | admin)
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },

    // 👇 Vendor approval system
    isApproved: {
      type: Boolean,
      default: function () {
        // vendor නම් false, user/admin නම් true
        return this.role !== 'vendor';
      },
    },

    // 👇 Vendor extra details
  vendorDetails: {
    businessName: { type: String },
    serviceType: { 
      type: String, 
      enum: ['hotel', 'vehicle', 'tour'], 
      default: 'hotel'
    },
    registrationNumber: { type: String },
    phone: { type: String },
    address: { type: String },
    description: { type: String },

    // 👇 අලුතින් එකතු කළ කොටස් (Specific Fields & Documents)
    specificDetails: {
      hotelStarRating: { type: String }, // Hotel Only
      vehicleFleetSize: { type: String }, // Vehicle Only
      guideLanguages: { type: String },   // Tour Guide Only
      experienceYears: { type: String }   // Tour Guide Only
    },
    documents: {
      profileImage: { type: String }, // Vendor Profile Pic
      idFront: { type: String },      // ID Front / Passport
      idBack: { type: String }        // ID Back / Driving License
    }
  },
  },
  {
    timestamps: true,
  }
);

/* ===============================
   Password hash (before save)
================================ */
userSchema.pre('save', async function (next) {
  // password වෙනස් වෙලා නැත්නම් hash නොකරන්න
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ===============================
   Password compare method
================================ */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
