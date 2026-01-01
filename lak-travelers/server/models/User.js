import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please add a name'] },
    email: { type: String, required: [true, 'Please add an email'], unique: true, lowercase: true },
    password: { type: String, required: [true, 'Please add a password'], minlength: 6 },
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    isApproved: { type: Boolean, default: true },
    vendorDetails: {
      businessName: { type: String, default: "" },
      serviceType: { type: String, enum: ['hotel', 'vehicle', 'tour', 'none'], default: 'none' },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      registrationNumber: { type: String, default: "" },
      description: { type: String, default: "" },
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;