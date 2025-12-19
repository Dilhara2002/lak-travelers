import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js'; 
import aiRoutes from './routes/aiRoutes.js';
// 🚨 වැදගත්: Error Middleware මෙහිදී Import කරගන්න
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
 * 🤖 2. AI Routes Registration
 * 🚨 මෙය අනිවාර්යයෙන්ම Error Middleware (notFound) වලට පෙර තිබිය යුතුය.
 */
app.use('/api/ai', aiRoutes);

/**
 * 📦 3. Production Setup (Hosting)
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
 * 🚨 4. Final Error Handling Middleware
 * කිසිදු Route එකක් match නොවූ විට පමණක් මෙය ක්‍රියාත්මක වේ.
 */
app.use(notFound);
app.use(errorHandler);

// Database සම්බන්ධ කිරීම
connectDB();

/**
 * 🚀 5. Start Server
 */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} 🚀`);
});