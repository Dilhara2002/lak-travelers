import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';

// 1. Import all route files
import userRoutes from './routes/userRoutes.js'; 
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

/**
 * 🚀 Middleware Setup
 */
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

/**
 * 🗄️ Database Connection
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
connectDB();

/**
 * 🤖 Route Registration (FIXES THE 404 ERRORS)
 */
app.use('/api/users', userRoutes); 
app.use('/api/upload', uploadRoutes);
app.use('/api/hotels', hotelRoutes);    // 👈 Added
app.use('/api/tours', tourRoutes);      // 👈 Added
app.use('/api/vehicles', vehicleRoutes); // 👈 Added
app.use('/api/bookings', bookingRoutes); // 👈 Added
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Lak Travelers API is running locally....');
});

/**
 * 🚨 Error Handling
 */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT} 🚀`);
});

export default app;