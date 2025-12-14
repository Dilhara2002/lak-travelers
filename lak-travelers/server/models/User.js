import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // නම අනිවාර්යයි
  },
  email: {
    type: String,
    required: true,
    unique: true, // එකම email එකෙන් දෙපාරක් register වෙන්න බැහැ
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'], // මේ තුනෙන් එකක් විතරයි වෙන්න පුළුවන්
    default: 'user',
  },
  language: {
    type: String,
    enum: ['en', 'si', 'ta'], // English, Sinhala, Tamil
    default: 'en',
  },
}, {
  timestamps: true // User හදපු වෙලාව (created_at) auto save වෙනවා
});

// Password එක database එකට save කරන්න කලින් encrypt (hash) කරනවා
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Login වෙනකොට password එක check කරන function එක
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;