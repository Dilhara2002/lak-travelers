import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';

// 1. Route Imports
import userRoutes from './routes/userRoutes.js'; 
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reviewRoutes from "./routes/reviewRoutes.js";

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

/**
 * 🛡️ CORS Setup - Localhost Only
 * මෙහිදී cors() මඟින්ම OPTIONS (pre-flight) requests හසුරුවයි.
 */
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// ✅ වැදගත්: PathError ඇති කරන 'app.options' පේළිය මෙහිදී ඉවත් කර ඇත.
// ඒ වෙනුවට සියලුම routes වලට පෙර OPTIONS පරීක්ෂා කරන සරල middleware එකක් පහත පරිදි එක් කළ හැක.
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

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
 * 🤖 Route Registration
 */
app.use('/api/users', userRoutes); 
app.use('/api/upload', uploadRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/reviews", reviewRoutes);

app.get('/', (req, res) => {
  res.send('Lak Travelers API is running on Localhost....');
});

/**
 * 🚨 Error Handling
 */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚀`);
});

export default app;