import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // 👇 Role එක (User, Vendor, Admin)
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'vendor', 'admin'], 
    default: 'user' 
  },
  
}, {
  timestamps: true,
});

// 👇 Password හරිද කියලා බලන method එක
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 👇 Password Hash කරන කොටස (Save වෙන්න කලින්)
userSchema.pre('save', async function (next) {
  // Password එක වෙනස් වෙලා නැත්නම් hash කරන්නේ නෑ
  if (!this.isModified('password')) {
    return next(); // ⚠️ මෙතන return එක අනිවාර්යයි!
  }

  // Password එක Hash කරනවා
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;