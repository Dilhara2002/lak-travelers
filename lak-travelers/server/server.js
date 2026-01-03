import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

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
 * 🛡️ 1. CORS Setup
 * Vercel සහ Localhost යන දෙකටම අවසර ලබා දී ඇත.
 */
app.use(cors({
  origin: ['https://lak-travelers.vercel.app', 'http://localhost:5173'], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

/**
 * 🚀 2. Middlewares
 */
// OPTIONS (Pre-flight) requests සඳහා ඉක්මන් ප්‍රතිචාර (502 Error වැළැක්වීමට)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

/**
 * 🗄️ 3. Database Connection
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`Database Error: ${error.message} ❌`);
    // Render හි දිගින් දිගටම Restart වීම වැළැක්වීමට වහාම Exit නොවී සිටීම වඩාත් සුදුසුයි
  }
};
connectDB();

/**
 * 🤖 4. Route Registration
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
  res.send('Lak Travelers API is Live and Running! 🚀');
});

/**
 * 🚨 5. Error Handling
 */
app.use(notFound);
app.use(errorHandler);

/**
 * 🌐 6. Server Start
 * Render සඳහා 0.0.0.0 Binding එක අත්‍යවශ්‍ය වේ.
 */
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT} 🚀`);
});

export default app;