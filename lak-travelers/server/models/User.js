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
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
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
      default: true, // සාමාන්‍ය අයට true, vendor සඳහා controller එකෙන් false කරනු ලැබේ
    },
    vendorDetails: {
      businessName: { type: String, default: "" },
      serviceType: { type: String, enum: ['hotel', 'vehicle', 'tour', 'none'], default: 'none' },
      registrationNumber: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      description: { type: String, default: "" },
      // පින්තූර URLs
      profileImage: { type: String, default: "" },
      idFront: { type: String, default: "" },
      idBack: { type: String, default: "" },
      // අමතර විස්තර
      hotelStarRating: { type: String, default: "" },
      vehicleFleetSize: { type: String, default: "" },
      guideLanguages: { type: String, default: "" },
      experienceYears: { type: String, default: "" }
    },
  },
  { timestamps: true }
);

// Password Hashing Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;