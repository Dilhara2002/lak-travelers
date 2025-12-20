import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js'; 
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js'; // 👈 User routes අමතක කරන්න එපා
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

/**
 * 🗄️ 1. Database Connection
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`Database Error: ${error.message} ❌`);
    process.exit(1);
  }
};

/**
 * 🚀 2. IMPORTANT: Global Middleware (Limit Setup)
 * මේ පේළි දෙක අනිවාර්යයෙන්ම Routes වලට ඉහළින් තිබිය යුතුය.
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 🤖 3. Routes Registration
 */
app.use('/api/users', userRoutes); // 👈 User Profile/OTP/Register සියල්ල මෙහි ඇත
app.use('/api/ai', aiRoutes);

/**
 * 📦 4. Production Setup (Hosting)
 */
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

/**
 * 🚨 5. Final Error Handling Middleware
 */
app.use(notFound);
app.use(errorHandler);

// Database සම්බන්ධ කිරීම
connectDB();

/**
 * 🚀 6. Start Server
 */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} 🚀`);
});