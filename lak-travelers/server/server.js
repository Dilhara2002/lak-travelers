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

// Environment variables load කිරීම
dotenv.config();

const app = express();

/**
 * 🛡️ 1. CORS Setup (Production Ready)
 * මෙහිදී අවසර දිය යුතු Origins ලැයිස්තුවක් භාවිතා කරයි.
 */
const allowedOrigins = [
  'https://lak-travelers.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // origin එකක් නැති (Postman/Mobile) හෝ ලැයිස්තුවේ ඇති Origins වලට අවසර දීම
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS Policy'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

/**
 * 🚀 2. Middlewares
 */
// OPTIONS requests (Pre-flight) සඳහා ඉක්මන් ප්‍රතිචාර ලබා දීම
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

// JSON සහ URL-encoded දත්ත හසුරුවීම (Base64/Images සඳහා limit එක 10mb ලෙස සකසා ඇත)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Development mode එකේදී logs පෙන්වීම
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Uploaded පින්තූර සඳහා Static path එක
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
    // Database එක නැතිව සර්වර් එක දුවන්න බැරි නිසා වසා දැමීම
    process.exit(1);
  }
};
connectDB();

/**
 * 🤖 4. Route Registration
 * සියලුම API endpoints ආරම්භ වන්නේ '/api' කොටසිනි.
 */
app.use('/api/users', userRoutes); 
app.use('/api/upload', uploadRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/reviews", reviewRoutes);

// Health Check Endpoint
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
 * Render සහ අනෙකුත් cloud සේවාවන් සඳහා 0.0.0.0 binding එක සහ PORT අත්‍යවශ්‍ය වේ.
 */
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT} 🚀`);
});

export default app;